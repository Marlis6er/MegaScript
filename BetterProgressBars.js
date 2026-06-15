class BetterProgressBars {
	constructor() {
		this.healthColor = `hsl(230, 75%, 60%)`;
		this.setReloadInterval();
	}

	setReloadInterval() {
		// Get the current time in UTC
		const now = new Date();
		const minutes = now.getUTCMinutes();
		const seconds = now.getUTCSeconds();

		// Calculate the minutes remaining until the next 5-minute interval
		const nextInterval = 500 - (minutes % 500);
		const timeToNextInterval = (nextInterval * 60 - seconds) * 1000;

		// Set a timeout to reload the page at the next 5-minute interval
		setTimeout(() => {
			window.location.reload();
		}, timeToNextInterval);
	}

	inExpeditions(url) {
		const bars = document.querySelectorAll(".progress-bar-striped");
		for (var bar of bars) bar.classList.remove("bg-success");
	}

	inJobs(url) {
		const bars = document.querySelectorAll("div.equipmentModule .progress-bar");
		for (var bar of bars) {
			const val = parseFloat(bar.getAttribute("aria-valuenow"));
			bar.classList.remove("bg-success");
			bar.classList.add("progress-bar-striped");
			bar.style.backgroundColor = `hsl(${val / 100 * 120}, 67%, 30%)`;
		}
		const buttons = document.querySelectorAll("div.equipmentModule form > .btn.w-100:not(#upgradeTimeButton):not(#upgradeRewardButton)");
		if (buttons.length === 1) {
			let bar = buttons[0].parentNode.parentNode.querySelector(".progress-bar");
			bar.classList.add("progress-bar-animated");
		}
	}

	inBarPage(url) {
		const bars = document.querySelectorAll(".progress-bar.bg-dark");
		for (var bar of bars) {
			bar.classList.remove("bg-dark");
			bar.classList.add("fs-6");
		}
	}

	inAnywhere() {
		const healthTimer = document.getElementById("lifeCountdown");
		const energyTimer = document.getElementById("energyCountdown");

		let healthBar = document.getElementById("lifeProgress");
		healthBar.classList.add("progress-bar-striped");
		let energyBar = document.getElementById("energyProgress");
		energyBar.classList.add("progress-bar-striped");

		observeDOM(healthTimer, e => {
			const text = e[0].addedNodes[0];
			if (text === "")
				healthBar.classList.remove("progress-bar-animated");

			else
				healthBar.classList.add("progress-bar-animated");
		});

		observeDOM(energyTimer, e => {
			const text = e[0].addedNodes[0];
			if (text === "")
				energyBar.classList.remove("progress-bar-animated");

			else
				energyBar.classList.add("progress-bar-animated");
		});

		const energyPercent = parseFloat(energyBar.style.width.slice(0, -1));
		const energyColor = Math.min(15, 150 / (109 - energyPercent));
		GM_addStyle(`#lifeProgress { background-color: ${this.healthColor} !important }`);
		GM_addStyle(`#energyProgress { background-color: hsl(${50 - energyColor}, 100%, 51.37%) !important }`);
	}
}
