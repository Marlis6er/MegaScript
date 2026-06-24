class HighlightInactives {
	constructor() {
		this.yellowBy = 1; // in days
		this.redBy = 2; // in days
	}
	inCartel(url) {
		const table = document.querySelector("div.card-body > div.container-fluid");
		const rows = table.querySelectorAll(".row.align-middle");

		for (const row of rows) {
			const cols = row.querySelectorAll(".col:not(.fw-bold)");
			const activity = cols[cols.length - 2];
			if (!activity.textContent.endsWith("days ago")
				&& !activity.textContent.endsWith("day ago")) continue;

			const days = parseInt(activity.innerText.match(/\d+/)[0]);
			if (days >= this.redBy)
				activity.classList.add("text-danger");
			else if (days >= this.yellowBy)
				activity.classList.add("text-warning");
		}
	}
}
