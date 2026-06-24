class EstateLevelInfo {
	constructor(darkMode) {
		this.brightness = darkMode ? 50 : 45;

		this.prefixes = ["", "", '\u00a3', '-', '+', '+', '+'];
		this.postfixes = ["", "", 'M', '%', '%', " INT", '%'];
		this.values = [
			[], // Plot cost, nothing to process here
			[], // Best house type, nothing to process here
			[0, 10, 50, 150, 250, 500, 2000, 5000], // Max safe, between 0 and 5bil
			[0, 1, 2, 4, 6, 8, 10], // Uni course time reduction, between 0% and 10%
			[0, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75], // Gym bonus, between 0% and 0.75%
			[0, 50, 100, 150, 200], // Intelligence cap bonus, between 0 and 200 int
			[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.75] // Int gain bonus, between 0% and 0.75%
		];
	}
	inEstateAgent(url) {
		const containers = document.querySelectorAll("#v-content-plots div.accordion-body");

		for (let i = 0; i < containers.length; ++i) {
			const container = containers[i];
			const numbers = container.querySelectorAll("div.col-6 p:not(.mb-0)");
			for (let j = 2; j < numbers.length; ++j) {
				let numberP = numbers[j];
				const number = parseInt(numberP.textContent);
				const val = this.values[j][number];
				if (val === undefined) return;

				const colorVal = val / this.values[j][this.values[j].length - 1];
				numberP.innerHTML += ` <span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">(${this.prefixes[j]}${val.toLocaleString("en-US")}${this.postfixes[j]})</span>`;
			}
		}
	}
}
