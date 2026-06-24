class IntPerWeek {
	constructor(darkMode) {
		this.brightness = darkMode ? 50 : 45;

		this.stats = window.location.href[window.location.href.length - 1] === '2';
	}
	inUniversityPage(url) {
		const courses = document.querySelectorAll("div#classAccordion div.accordion-item");
		let intPerDay = [];
		let maxIpd = 0;
		let minIpd = Infinity;

		for (const course of courses) {
			const body = course.querySelector('div.accordion-collapse > div.accordion-body');
			const lengthElem = body.querySelector('div.row.pb-4 > div.col-6 > p.card-text:nth-of-type(2)');
			const length = parseInt(lengthElem.textContent.split(' ')[2]);
			const intGainElem = body.querySelector('div:nth-child(2) > div:nth-child(2) > p:nth-child(2)');
			const intGainText = intGainElem.textContent.match(/\d+\s/g);
			let intGain = 0;
			for (const text of intGainText) intGain += parseInt(text);

			// One combat course gives int rather than stats; ignore it
			if (this.stats && intGainElem.textContent.includes("intelligence"))
				intGain = 0;

			const ipd = 7 * intGain / length;
			intPerDay.push(ipd);
			maxIpd = Math.max(maxIpd, ipd);
			minIpd = Math.min(minIpd, ipd);
		}

		this.updateUI(courses, intPerDay, minIpd, maxIpd);
	}

	updateUI(courses, intPerDay, minIpd, maxIpd) {
		for (let i = 0; i < courses.length; ++i) {
			const ipd = intPerDay[i];
			const colorVal = (ipd - minIpd) / (maxIpd - minIpd);
			const infoTextElem = courses[i].querySelector('h2 > button > div:last-of-type > span');
			infoTextElem.innerHTML += ` <span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">(${ipd.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${this.stats ? "stats" : "INT"}/week)</span>`;
		}
	}
}
