class HighlightInactives {

	static metadata = {
		displayName: 'Highlight Inactives',
		description: 'Color the names of inactive users',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() {
		this.yellowBy = 1; // in days
		this.redBy = 2; // in days

		this.endings = new Map([
			['Active', 0],
			['minute ago', 1 / (24 * 60)],
			['minutes ago', 1 / (24 * 60)],
			['hour ago', 1 / 24],
			['hours ago', 1 / 24],
			['day ago', 1],
			['days ago', 1],
			['month ago', 30],
			['months ago', 30],
			['No Activity', 90],
		]);
	}
	inCartel(url) {
		const table = document.querySelector("div.card-body > div.container-fluid");
		if (!table) return;
		
		const rows = table.querySelectorAll(".row.align-middle");

		for (const row of rows) {
			const cols = row.querySelectorAll(".col:not(.fw-bold)");
			const activity = cols[cols.length - 2];

			let days = parseInt(activity.innerText.match(/\d+/)?.[0] || '0');
			for (const [time_id, factor] of this.endings.entries()) {
				if (!activity.textContent.endsWith(time_id)) continue;

				days *= factor;
				break;
			}
			if (days >= this.redBy)
				activity.classList.add("text-danger");
			else if (days >= this.yellowBy)
				activity.classList.add("text-warning");
		}
	}
}
