class EstimatedIntGains {
	constructor(darkMode) {
		this.brightness = darkMode ? 50 : 45;

		this.improperWay = false; // Instead of using ^energy, Diablo used to use *energy incorrectly
		this.constant = this.improperWay ? 36715 : 36667;
		this.base = 1 + 1 / this.constant;
		this.ID = "expectedIntGains";

		this.maxInt = GM_getValue("perks_Max Int") || 1200; // NOTE: only works when integrated with other scripts
		const extraIntGains = GM_getValue("perks_Int Gains") || 0; // percentage; NOTE: only works when integrated with other scripts
		this.extraGainsFactor = 1 + extraIntGains / 100;
	}
	calcGain(energy, currentInt) {
		if (this.improperWay)
			return Math.min(this.maxInt - currentInt, currentInt * (this.base - 1) * energy * this.extraGainsFactor);
		else
			return Math.min(this.maxInt - currentInt, currentInt * (Math.pow(this.base, energy * this.extraGainsFactor) - 1));
	}
	genText(value, currentInt) {
		return `Expected gain: <span class="fw-bold">${value === 0 ? '0' : '~' + value.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>`;
	}
	genToMaxText(currentInt) {
		const eToMax = Math.log(this.maxInt / currentInt) / Math.log(this.base) / this.extraGainsFactor;
		return `<span class="fw-bold">~${Math.round(eToMax).toLocaleString("en-US")}</span> energy until ${this.maxInt.toLocaleString("en-US")}`;
	}
	inUniversity(url) {
		const container = document.querySelector("div.text-center.d-flex.flex-column.align-items-center");
		if (container === null) return;

		// Look for the form or the "too tired" message
		let targetElement = container.querySelector("form.input-group");
		if (targetElement === null) {
			targetElement = container.querySelector("p.card-text.text-danger");
			// Exit if neither the form nor the message is found
			if (targetElement === null) return;
		}

		let currentIntVal = 0;
		const currentInt = container.querySelector("p.card-text.fw-bold.text-muted");
		if (currentInt !== null) {
			currentIntVal = parseFloat(currentInt.textContent.split(' ')[0].slice(1));
		} else return; // Exit if currentInt is not found

		let energy = 50;
		if (targetElement.tagName === 'FORM') {
			const energyInput = targetElement.querySelector("input.form-control");
			if (energyInput !== null) energy = parseInt(energyInput.value);

			let value = this.calcGain(energy, currentIntVal);

			const expectedIntGains = document.createElement("p");
			expectedIntGains.id = this.ID;
			expectedIntGains.classList.add("card-text", "mt-2");
			expectedIntGains.innerHTML = this.genText(value, currentIntVal);

			// Insert the expected gain element after the form
			targetElement.insertAdjacentElement("afterend", expectedIntGains);

			// Add event listener for energy input changes
			if (energyInput === null) return;

			energyInput.addEventListener("input", e => {
				const energyText = e.target.value;
				if (energyText === "" || energyText.trim()[0] === '-') return;

				energy = parseInt(energyText);
				value = this.calcGain(energy, currentIntVal);
				expectedIntGains.innerHTML = this.genText(value, currentIntVal);
			});
		}

		// Always create and insert the "energy until maximum" element
		const eToMaxText = document.createElement("p");
		eToMaxText.classList.add("card-text", "mb-0");
		eToMaxText.innerHTML = this.genToMaxText(currentIntVal);

		// Insert the "energy until maximum" element after the targetElement
		targetElement.insertAdjacentElement("afterend", eToMaxText);

		const usedGainBox = document.querySelector("div.mb-4.card.border-success p.card-text.fw-bold.text-white");
		if (usedGainBox === null) return;

		const textSplit = usedGainBox.innerText.split(' ');
		if (textSplit[textSplit.length - 1] !== "Intelligence") return;

		const prevIntVal = currentIntVal - parseFloat(textSplit[7]);
		const expected = this.calcGain(parseInt(textSplit[4]), prevIntVal);
		usedGainBox.innerHTML += ` <span class="text-muted">(expected ${expected.toLocaleString("en-US", { minimumFractionDigits: 2 })})</span>`;
	}

}
