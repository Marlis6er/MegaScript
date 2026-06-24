class TotalListingValue {
	constructor() { }
	inMarket(url) {
		const ownOffers = document.querySelector("div.offerListWrapper:first-of-type");
		if (ownOffers === null) return;

		const header = ownOffers.querySelector("div.row.row-cols-3.row-header");
		const offerItems = ownOffers.querySelectorAll('div.inventoryItemWrapper');

		const totalVal = this.getTotalValue(offerItems);

		const totalValCard = document.createElement("div");
		totalValCard.classList.add("card-body", "mb-2");
		totalValCard.innerHTML = `<p class="card-text">The total value of your listings is <span class="fw-bold">\u00a3${totalVal.toLocaleString("en-US")}</span>.</p>`;
		ownOffers.insertBefore(totalValCard, header);
	}
	getTotalValue(offerItems) {
		let totalVal = 0;
		for (const item of offerItems) {
			if (item.children.length < 5) continue;

			const valueText = item.children[2].textContent;
			const val = parseInt(valueText.slice(1).replaceAll(',', ""));

			const countText = item.children[4].textContent;
			const countOf = parseInt(countText.replaceAll(',', ""));

			totalVal += val * countOf;
		}
		return totalVal;
	}
}
