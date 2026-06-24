class BuyPointsLink {
	constructor() {
		this.add = `<div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Buy Points</h2></div></div></div><div class="card-body"><p class="card-text">Go to the <a class="text-white" href="/market?p=Points">Item Market</a> to buy points.</p></div>`;
	}

	inSupporter(url) {
		// Find the container (updated from the previous class names)
		let container = document.querySelector("div.col-12"); // Adjust this selector if needed


		// Find the cards in the container (adjust this according to the new structure of your cards)
		const cards = container.querySelectorAll("div.card.mb-4");

		// Create a new card to be inserted
		let linkCard = document.createElement("div");
		linkCard.classList.add("mb-4", "card");
		linkCard.innerHTML = this.add;

		// Find the third last card (or modify this logic if needed)
		const refillCard = cards[cards.length - 3];

		// Insert the new card before the refill card
		container.insertBefore(linkCard, refillCard);
	}
}
