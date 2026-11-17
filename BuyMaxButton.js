class BuyMaxButton {

	static metadata = {
		displayName: 'Buy Max Button',
		description: 'Add a button to all town store items to buy all items at once',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() {
	}
	inArmedSurplus(url) {
		this._modifiySellBox();
	}
	inPharmacy(url) {
		this._modifiySellBox();
	}
	inMateos(url) {
		this._modifiySellBox();

		// Also modify the Buy Points box
		const form = document.querySelector('form[action="/Town/buyPoints/"]');
		const inputElem = form.querySelector('input#pointsToBuy');
		if (!inputElem) return;

		const maxAmount = Math.floor(parseInt(inputElem.getAttribute('max')));
		if (maxAmount === 0) return;

		const BuyMaxButton = this._createBuyMaxButton(maxAmount, form);

		form.appendChild(BuyMaxButton);
	}
	inDiablos(url) {
		this._modifiySellBox();
	}
	inCarDealership(url) {
		this._modifiySellBox();
	}
	inPetshop(url) {
		this._modifiySellBox();
	}
	_modifiySellBox(){
		const sellBoxElem = document.querySelector('div.container.inventoryWrapper');
		const items = sellBoxElem.querySelectorAll('div.inventoryItemWrapper');
		if (items.length === 0) return;

		for (const item of items) {
			const inputGroupElem = item.querySelector('div:nth-of-type(6) > div.input-group');
			const inputElem = inputGroupElem.querySelector('input');
			// Sold out or can't afford
			if (!inputElem) continue;

			const maxItems = Math.floor(parseInt(inputElem.getAttribute('max')));
			if (maxItems === 0) return;

			const BuyMaxButton = this._createBuyMaxButton(maxItems, inputGroupElem);

			inputGroupElem.appendChild(BuyMaxButton);
		}
	}

	_createBuyMaxButton(amount, inputGroupElem) {
		const btnMaxElem = document.createElement('button');
		btnMaxElem.textContent = 'MAX';
		btnMaxElem.classList = 'btn btn-sm btn-success';

		btnMaxElem.addEventListener('click', () => {
			const inputElem = inputGroupElem.querySelector('input');
			inputElem.value = amount;
			// Update the buy-button
			inputElem.dispatchEvent(new Event('change'));

			// Trigger a click on the buy button
			const originalButton = inputGroupElem.querySelector('button');
			originalButton.disabled = false;
			originalButton.dispatchEvent(new Event('click'));

		});

		return btnMaxElem;
	}
}
