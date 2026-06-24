class HighlightExcessHealth {
	constructor() { }
	inUserProfile(url) {
		const trs = document.querySelectorAll("table.table tbody tr");
		if (trs.length < 6) return;

		const lifeTd = trs[5].children[1];
		const life = lifeTd.textContent;
		const curHealth = parseInt(life.split(" / ")[0].replaceAll(',', ""));
		const maxHealth = parseInt(life.split(" / ")[1].replaceAll(',', ""));
		if (curHealth > maxHealth)
			lifeTd.classList.add("text-danger", "fw-bold");
	}
}
