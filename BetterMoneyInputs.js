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
	_listener(e, input) {
		const elem = AutoNumeric.getAutoNumericElement(input);
		const curVal = parseFloat(elem.get().replaceAll(',', ""));
		const max = elem.getSettings().maximumValue;
		if (e.ctrlKey) return;

		if (e.key === 'a')
			elem.set(max);
		else if (e.key === 'h')
			elem.set(Math.floor(max / 2));
	}
	listener(e, input) {
		if (AutoNumeric.isManagedByAutoNumeric(input)) 
			this._listener(e, input);
		else
			input.addEventListener("autoNumeric:initialized", () => this._listener(e, input));
	}
	update(input) {
		this.changeAutonumeric(input);
		input.addEventListener("keydown", e => this.listener(e, input));
	}
	inBank(url) {
		const depositInput = document.querySelector("input#depositInput");
		const withdrawInput = document.querySelector("input#withdrawInput");
		if (depositInput === null) return;

		this.update(depositInput);
		this.update(withdrawInput);
	}
	inCartelArmory(url) {
		const pointsDeposit = document.querySelector("input#pointsdepositquantity");
		if (pointsDeposit === null) return;

		this.update(pointsDeposit);
	}
	inTradeView(url) {
		const cashInput = document.querySelector("input#cashModifier");
		const pointsInput = document.querySelector("input#pointsModifier");
		if (cashInput === null || cashInput.disabled) return;

		this.update(cashInput);
		this.update(pointsInput);
	}
	inMarket(url) {
		const pricePer = document.querySelector("input#priceper");
		const pointsPricePer = document.querySelector("input#pointspriceper");
		const qty = document.querySelector("input#quantity");
		const pointsQty = document.querySelector("input#pointsquantity");
		if (pricePer === null) return;

		this.update(pricePer);
		this.update(pointsPricePer);
		this.update(qty);
		this.update(pointsQty);

		pointsPricePer.min = 0; // Make it like pricePer
		if (AutoNumeric.isManagedByAutoNumeric(pointsPricePer)) {
			const elem = AutoNumeric.getAutoNumericElement(pointsPricePer);
			elem.update({ minimumValue: 0 });
		} else {
			pointsPricePer.addEventListener("autoNumeric:initialized", () => {
				const elem = AutoNumeric.getAutoNumericElement(pointsPricePer);
				elem.update({ minimumValue: 0 });
			});
		}
	}
	inUserProfile(url) {
		const sendCash = document.querySelector("input#sendCashInput");
		if (sendCash === null) return;

		this.update(sendCash);
	}
}
