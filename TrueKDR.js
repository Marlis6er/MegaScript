class TrueKDR {
	constructor() { }
	inHomepage(url) {
		const stats = document.querySelectorAll(".col-md-6.d-flex.align-items-stretch.col-xxl-4");
		if (stats.length < 2) return;

		const table = stats[1].querySelector("div.row.align-items-center.gy-2.mb-2:nth-of-type(2)");
		const getNumberAtIndex = idx => parseInt(table.children[idx].children[0].innerText.replaceAll(',', ""));
		let totalW = getNumberAtIndex(3) + getNumberAtIndex(7);
		let totalL = getNumberAtIndex(5) + getNumberAtIndex(9);

		const descriptionText = document.createElement("div");
		descriptionText.className = "col-4";
		descriptionText.innerHTML = '<p class="profileLabel">True K/D</p>';
		table.insertBefore(descriptionText, table.children[2]);

		const trueKD = document.createElement("div");
		trueKD.className = "col-8";
		trueKD.innerHTML = `<p class="form-data-inset p-2 mb-0 rounded d-flex">${totalW} / ${totalL}</p>`;
		table.insertBefore(trueKD, table.children[3]);
	}
}
