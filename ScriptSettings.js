class ScriptSettings {
	constructor() {
		this.name = "megascript-settings";
		this.fullName = "Megascript Settings";
	}
	inSettings(URL) {
		const navTabs = document.querySelector("#settingsNav .nav-tabs");
		const tabContent = document.querySelector("#settingsNav .tab-content");
		if (navTabs === null || tabContent === null) return;

		const urlParams = new URLSearchParams(window.location.search);
		const selected = urlParams.get("t") === this.name;

		const button = document.createElement("button");
		button.id = `v-tab-${this.name}`;
		button.classList.add("nav-link", "settings-nav-link");
		if (selected) button.classList.add("active");

		button.setAttribute("data-bs-toggle", "tab");
		button.setAttribute("data-bs-target", `#v-content-${this.name}`);
		button.type = "button";
		button.role = "tab";
		button.setAttribute("aria-controls", `v-content-${this.name}`);
		button.setAttribute("aria-selected", selected.toString());
		button.setAttribute("tab", this.name);
		if (!selected) button.setAttribute("tabindex", "-1");

		button.innerText = this.fullName;
		navTabs.append(button);
		let tab = document.createElement("div");
		tab.classList.add("tab-pane", "fade");
		if (selected) tab.classList.add("active", "show");

		tab.id = `v-content-${this.name}`;
		tab.setAttribute("role", "tabpanel");
		tab.setAttribute("aria-labelledby", `v-tab-${this.name}`);
		tab.innerHTML = this._createSettingsTemplate();

		const accordion = tab.querySelector('#classAccordion');
		accordion.innerHTML += this._createSectionTemplate('accordion-1', 'Bank Deposit Tax', 'Display the bank deposit tax', 'TestContent');
		accordion.innerHTML += this._createSectionTemplate('accordion-2', 'Better Item Value', 'Display item value based on market prices', 'TestContent');
		accordion.innerHTML += this._createSectionTemplate('accordion-3', 'Add Links', 'Add various extra links to the nav bar', 'TestContent');
		accordion.innerHTML += this._createSectionTemplate('accordion-4', 'Better Money Inputs', 'Allow "h" to input half the money on hand', 'TestContent');
		accordion.innerHTML += this._createSectionTemplate('accordion-5', 'Better Progress Bars', 'Fancy animated and striped progress bars', 'TestContent');
		accordion.innerHTML += this._createSectionTemplate('accordion-6', 'Blackjack Helper', 'Highlight the optimal move', 'TestContent');
		

		tabContent.appendChild(tab);
	}
	_createSettingsTemplate() {
		return `
			<div class="card-border-0">
				<div class="card-body">
					<div class="d-flex flex-column align-items-center">
						<div class="container classWrapper">
							<div class="accordion accordion-flush" id="classAccordion">
								<!-- Sections here -->
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	}
	_createSectionTemplate(id, name, description, content) {
		return `
		<div class="accordion-item">
			${this._createSectionHeaderTemplate(id, name, description)}
			${this._createSectionBodyTemplate(id, content)}
			<!-- Section header here -->
			<!-- Section body here -->
		</div>
		`;
	}
	_createSectionHeaderTemplate(id, name, description) {
		return `
			<h2 class="accordion-header" id="heading-${id}">
				<button class="accordion-button bg-dark rounded collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false" aria-controls="${id}">
					<div class="d-none d-sm-inline">
						<span class="text-center">${name} - ${description}</span>
					</div>
				</button>
			</h2>
		`;
	}
	_createSectionBodyTemplate(id, content) {
		return `
			<div class="accordion-collapse collapse" id="${id}" aria-labelledby="heading-${id}" data-bs-parent="#classAccordion">
				<div class="accordion-body">
					${content}
				</div>
			</div>
		`;
	}
}
