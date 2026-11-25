class DPEnergyRefillReminder {

	static metadata = {
		displayName: 'Supporter Pack Energy Refill Reminder',
		description: 'Add warning to not use energy refill when energy is not zero or max energy is not 200',
		settings: {
			active: {
				inSupporter: {
					description: 'Add warning to not use energy refill when energy is not zero or max energy is not 200'
				}
			},
			custom: {
			}
		}
	}

	constructor() { }
	inSupporter(url) {
		const modalText = document.querySelector("#useRefillConfirm p.card-text.modal-bodyText");
		if (!modalText) return;

		const modalObserver = e => {
			const textSplit = e[0].target.innerText.split(' ');
			const option = textSplit[textSplit.length - 1];
			if (option !== "Energy?") return;

			if (document.querySelector("#maxEnergy").innerText !== "200")
				modalText.innerHTML += `<br><span class="text-warning">Your max energy isn't 200!</span>`;
			else if (document.querySelector("#currentEnergy").innerText !== "0")
				modalText.innerHTML += `<br><span class="text-danger">Your current energy isn't 0!</span>`;
		};
		observeDOM(modalText, modalObserver);
	}
}
