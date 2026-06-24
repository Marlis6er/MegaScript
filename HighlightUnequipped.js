class HighlightUnequipped {
	constructor(darkMode) { }
	inInventory(url) {
		const titles = document.querySelectorAll("h6.card-title");

		for (const title of titles) {
			if (['Fists', 'None', 'No Armour'].includes(title.textContent))
				title.classList.add("fw-bold", "text-danger");
		}
	}
	inProduction(url) {
		const idle = document.querySelector("p.idleNarcos");
		if (idle === null) return;
		const setColor = text => {
			if (text === "0") idle.classList.remove("fw-bold", "text-danger");
			else idle.classList.add("fw-bold", "text-danger");
		};

		setColor(idle.innerText);
		observeDOM(idle, e => setColor(e[0].target.innerText));
	}
}
