class DisableThrow {

	static metadata = {
		displayName: 'Disable Throw',
		description: 'Disable the throw button',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() {
		this.throwText = "Throw Away";
	}
	inInventory(url) {
		const buttons = document.querySelectorAll("button.btn.action-btn.ms-1.float-end");
		for (const button of buttons) {
			if (button.title !== this.throwText) continue;

			button.setAttribute("disabled", true);
		}
	}
}
