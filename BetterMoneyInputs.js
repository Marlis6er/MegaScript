class BetterMoneyInputs {
	constructor() { }
	_changeAutonumeric(input) {
		let elem = AutoNumeric.getAutoNumericElement(input);
		elem.update({
			decimalPlaces: 3,
			decimalPlacesRawValue: 0,
			decimalPlacesShownOnBlur: 0,
			allowDecimalPadding: false,
			alwaysAllowDecimalCharacter: true
		});
	}
	changeAutonumeric(input) {
		if (AutoNumeric.isManagedByAutoNumeric(input))
			this._changeAutonumeric(input);

		else
			input.addEventListener("autoNumeric:initialized", () => this._changeAutonumeric(input));
	}
	_listener(e, input, max) {
		let elem = AutoNumeric.getAutoNumericElement(input);
		const curVal = parseFloat(elem.get().replaceAll(',', ""));
		if (e.ctrlKey)
			return;
		if (e.key === 'k')
			elem.set(Math.min(max, Math.floor(curVal * 1000)));
		else if (e.key === 'm')
			elem.set(Math.min(max, Math.floor(curVal * 1000000)));
		else if (e.key === 'b')
			elem.set(Math.min(max, Math.floor(curVal * 1000000000)));
		else if (e.key === 'a')
			elem.set(max);
		else if (e.key === 'h')
			elem.set(Math.floor(max / 2));
	}
	listener(e, input) {
		const max = parseInt(input.max.replaceAll(',', ""));
		if (AutoNumeric.isManagedByAutoNumeric(input))
			this._listener(e, input, max);

		else
			input.addEventListener("autoNumeric:initialized", () => this._listener(e, input, max));
	}
	update(input) {
		this.changeAutonumeric(input);
		input.addEventListener("keydown", e => this.listener(e, input));
	}
	inBank(url) {
		let depositInput = document.querySelector("input#depositInput");
		let withdrawInput = document.querySelector("input#withdrawInput");
		if (depositInput === null) return;

		this.update(depositInput);
		this.update(withdrawInput);
	}
	inCartelArmory(url) {
		let pointsDeposit = document.querySelector("input#pointsdepositquantity");
		if (pointsDeposit === null) return;

		this.update(pointsDeposit);
	}
	inTradeView(url) {
		let cashInput = document.querySelector("input#cashModifier");
		let pointsInput = document.querySelector("input#pointsModifier");
		if (cashInput === null || cashInput.disabled) return;

		this.update(cashInput);
		this.update(pointsInput);
	}
	inMarket(url) {
		let pricePer = document.querySelector("input#priceper");
		let pointsPricePer = document.querySelector("input#pointspriceper");
		let qty = document.querySelector("input#quantity");
		let pointsQty = document.querySelector("input#pointsquantity");
		if (pricePer === null) return;

		this.update(pricePer);
		this.update(pointsPricePer);
		this.update(qty);
		this.update(pointsQty);

		pointsPricePer.min = 0; // Make it like pricePer
		if (AutoNumeric.isManagedByAutoNumeric(pointsPricePer)) {
			let elem = AutoNumeric.getAutoNumericElement(pointsPricePer);
			elem.update({ minimumValue: 0 });
		}
		else
			pointsPricePer.addEventListener("autoNumeric:initialized", () => {
				let elem = AutoNumeric.getAutoNumericElement(pointsPricePer);
				elem.update({ minimumValue: 0 });
			});
	}
	inUserProfile(url) {
		let sendCash = document.querySelector("input#sendCashInput");
		if (sendCash === null) return;

		this.update(sendCash);
	}
}
