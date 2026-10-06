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
	}
	inPharmacy(url) {
		this._modifiySellBox();
	}
	inMateos(url) {
	}
	inDiablos(url) {
	}
	inCarDealership(url) {
	}
	_modifiySellBox(){
		const sellBoxElem = document.querySelector('div.container.inventoryWrapper');
		const items = sellBoxElem.querySelectorAll('div.inventoryItemWrapper');
		if (items.length === 0) return;

		for (const item of items) {
			/** @type {Element} */
			const inputGroupElem = item.querySelector('div:nth-of-type(6) > div.input-group');
			const inputElem = inputGroupElem.querySelector('input');

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
			inputGroupElem.querySelector('button').dispatchEvent(new Event('click'));

		});

		return btnMaxElem;
	}
}
