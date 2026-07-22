class CenterTabs {
	constructor() {
		const navPageMethods = [
			'inExpeditions',
			'inMarket',
			'inEstateAgent',
			'inCartelPerks',
			'inHighscores',
			'inProperty',
			'inSettings'
		];

		// It works, but could be better
		navPageMethods.forEach(method => {
			this.__proto__[method] = this._centerTabs;
		});
	}
	_centerTabs() {
		const tabs = document.querySelectorAll(".nav-tabs");
		for (const tab of tabs) tab.classList.add("nav-justified");

		GM_addStyle(".nav-tabs .nav-link.active { border-bottom: 3px solid #0d6efd !important }");
	}
}
