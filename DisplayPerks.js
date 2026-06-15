class DisplayPerks {
	constructor() {
		this.statGains = ["Accuracy", "Agility", "Defence", "Strength"];
		this.prod = "Production Profit";
		this.medEffectiveness = "Med Effectiveness";
		this.medCooldown = "Med Cooldown";
		this.maxInt = "Max Int";
		this.intGains = "Int Gains";
		this.jobProfits = "Job Profits";
		this.standardJobRep = "Standard Job Rep";
		this.streetCrimeProfit = "Street Crime Profit";

		this.all = "Territory";
		this.medProgram = "Medical Program";
	}
	getPerk(type) {
		const perk = GM_getValue(`perks_${type}`);
		return perk === undefined ? null : perk;
	}
	setPerk(type, perk) {
		GM_setValue(`perks_${type}`, perk);
		console.debug(`Set perks_${type} to ${perk}`);
		return perk;
	}
	changeHospitalTime(texts) {
		const effectText = texts[texts.length - 1];
		if (effectText === undefined || !effectText.innerText.includes("Hospital timer"))
			return;
		const textSplit = effectText.innerText.split(' ');

		let lifePercent = parseInt(textSplit[1].slice(0, -1));
		lifePercent *= 1 + this.getPerk(this.medEffectiveness) / 100;

		let medCooldown = parseInt(textSplit[8]);
		medCooldown *= 1 - this.getPerk(this.medCooldown) / 100;
		const medCooldownText = this.formatTime(medCooldown);

		let hospTime = parseInt(textSplit[textSplit.length - 2]);
		hospTime *= 1 + this.getPerk(this.medEffectiveness) / 100;
		const hospTimeText = this.formatTime(hospTime);

		const medEffectivenessApplied = `<span class="text-success">(+${this.getPerk(this.medEffectiveness)}% applied)</span>`;
		const medCooldownApplied = `<span class="text-success">(-${this.getPerk(this.medCooldown)}% applied)</span>`;

		const result = `Restores ${lifePercent}% of Life ${this.getPerk(this.medEffectiveness) === 0 ? '' : medEffectivenessApplied}. \
Increases Medical cooldown by ${medCooldownText} ${this.getPerk(this.medCooldown) === 0 ? '' : medCooldownApplied} and reduces \
Hospital timer by ${hospTimeText} ${this.getPerk(this.medEffectiveness) === 0 ? '' : medEffectivenessApplied}.`;

		effectText.innerHTML = result;

	}
	formatTime(time) {
		let result = '';
		if (time >= 60) {
			const hours = Math.floor(time / 60);
			result += `${hours} hour${hours === 1 ? "" : 's'}${time % 60 ? " and" : ""}`;
		}
		if (time % 60)
			result += ` ${time % 60} minute${time % 60 === 1 ? "" : 's'}`;

		return result;
	}
	inHomepage(url) {
		// Grab the perk items from the updated structure
		const perks = document.querySelectorAll(".col-12.d-flex.align-items-stretch.col-xxl-4 .perk-item");

		const museumVals = {
			"Small": 50,
			"Large": 100,
			"Basic": 150,
			"Superior": 200
		};

		let allStats = 0;
		let medEffectiveness = 0;
		let prodEffectiveness = 0;

		for (let perk of perks) {
			const perkName = perk.querySelector(".perkTitle").innerText; // Get perk name
			const perkDesc = perk.querySelector(".perkDescription").innerText; // Get perk description

			const textSplit = perkDesc.split(' '); // Split description into words


			// Check for different perk types and apply logic accordingly
			if (perkName === this.all) {
				if (perkDesc.startsWith("Increase all Gym gains by"))
					allStats += parseFloat(textSplit[textSplit.length - 1].slice(0, -1));
			} else if (perkName === this.medProgram) {
				if (perkDesc.endsWith("more effective Medicine"))
					medEffectiveness += parseFloat(textSplit[0].slice(0, -1));
			} else if (perkDesc.endsWith("Street Crime Profit"))
				this.setPerk(this.streetCrimeProfit, parseFloat(textSplit[0].slice(0, -1)));
			else if (perkDesc.endsWith("increase to production profits"))
				prodEffectiveness += parseFloat(textSplit[0].slice(0, -1));
			else if (perkDesc.endsWith("increase to all Gym gains"))
				allStats += parseFloat(textSplit[0].slice(0, -1));
			else if (perkDesc.startsWith("Increases the Intelligence stat cap"))
				this.setPerk(this.maxInt, 1000 + museumVals[perkName.split(' ')[0]]);
			else if (perkDesc.startsWith("Increases all Intelligence gains"))
				this.setPerk(this.intGains, parseFloat(textSplit[textSplit.length - 1].slice(0, -1).replaceAll(',', "")));
			else if (perkDesc.endsWith("increase to Job profits"))
				this.setPerk(this.jobProfits, parseFloat(textSplit[0].slice(0, -1)));
			else if (perkDesc.endsWith("less Medical cooldown added by items"))
				this.setPerk(this.medCooldown, parseFloat(textSplit[0].slice(0, -1)));
			else if (perkDesc.endsWith("increase to medical item effectiveness"))
				medEffectiveness += parseFloat(textSplit[0].slice(0, -1));
			else if (perkDesc.endsWith("Reputation on Standard Jobs"))
				this.setPerk(this.standardJobRep, parseFloat(textSplit[0].slice(1, -1)));
		}

		// Update stat gains after processing perks
		let statGains = [allStats, allStats, allStats, allStats];
		for (let perk of perks) {
			const perkDesc = perk.querySelector(".perkDescription").innerText;
			for (let i = 0; i < this.statGains.length; ++i) {
				// Dynamically check if a perk description ends with one of the stat gain descriptions
				if (perkDesc.endsWith(`increase to ${this.statGains[i]} gains`))
					statGains[i] += parseInt(perkDesc.split(' ')[0].slice(0, -1)); // Assuming the first part of the description is the percentage value
			}
		}

		// Set the final stats
		for (let i = 0; i < this.statGains.length; ++i)
			this.setPerk(`${this.statGains[i]} Gain`, statGains[i]);

		// Set the other perks
		this.setPerk(this.medEffectiveness, medEffectiveness);
		this.setPerk(this.prod, prodEffectiveness);
	}

	inGym(url) {
		let statCols = document.querySelector("div.row.row-cols-2.row-cols-lg-4.row-cols-md-2.mt-2.mb-4.g-4");
		if (statCols === null) return;

		statCols = statCols.children;

		for (var col of statCols) {
			const perkGainText = `${col.children[0].children[0].innerText}Gain`;
			const perkGain = this.getPerk(perkGainText);
			if (perkGain !== null) continue;
			let extraGains = document.createElement("p");
			extraGains.classList.add("extraGains", "card-text");
			extraGains.innerHTML = `(+${perkGain}% gains)`;

			col.children[0].insertBefore(extraGains, col.children[0].children[3]);
		}
	}
	inInventory(url) {
		if (!this.getPerk(this.medEffectiveness)) return;
		const itemList = document.querySelector("div.container.inventoryWrapper.pt-2");

		for (var i = 2; i < itemList.children.length; ++i) {
			const item = itemList.children[i];
			const texts = item.querySelectorAll("div.card-text > div.card-text");
			this.changeHospitalTime(texts);
		}
	}
	inMarket(url) {
		const medItems = document.querySelector("div#content-medical");
		observeDOM(medItems, e => {
			const list = e[1].addedNodes[0];
			if (list.classList === undefined || !list.classList.contains("offerListWrapper"))
				return;

			let doit = false;
			for (var itemNum = 1; itemNum < list.children.length; ++itemNum) {
				const listing = list.children[itemNum];
				const listingName = listing.children[1].innerText;
				if (itemNum % 2)
					doit = ["Bandage", "Small Medical Kit", "Large Medical Kit", "Basic Trauma Kit", "Large Trauma Kit"].includes(listingName);
				else if (doit) {
					const texts = listing.querySelectorAll("div.card-text > div.card-text");
					this.changeHospitalTime(texts);
				}
			}
		});
	}
	inPharmacy(url) {
		const itemLists = document.querySelectorAll("div.container.inventoryWrapper.mb-4");

		for (var il = 0; il !== itemLists.length; ++il) {
			const itemList = itemLists[il];
			for (var i = 1; i !== itemList.children.length; ++i) {
				const item = itemList.children[i];
				const texts = item.querySelectorAll("div.card-text > div.card-text");
				this.changeHospitalTime(texts);
			}
		}
	}
}
