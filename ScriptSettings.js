class ScriptSettings {

	static metadata = {
		displayName: 'Script Settings',
		description: 'Renders this page. DO NOT DISABLE',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() {
		this.optionElements = {};
		this.name = "megascript-settings";
		this.fullName = "Megascript Settings";
		this.configManager = ConfigManager.getInstance();
		this.storedSettings = this.getSettings();

		this.methodToNameMap = new Map(
			this.configManager.PAGE_DATA.map(page_data => [page_data[1], page_data[2]])
		);
	}
	getSettings() {
		return getValue('script', 'settings');
	}
	setSettings(settings) {
		setValue('script', 'settings', settings);
	}
	getTempSettings(path) {
		return path.reduce((obj, key) => obj?.[key] ?? null, this.storedSettings);
	}
	setTempSettings(path, value) {
		const last = path.at(-1);
		const correctLayer = this.getTempSettings(path.slice(0, -1));
		if (correctLayer === null) {
			console.warn(`Could not update setting: Path ${path.join('-')} doesn't exist in settings`);
			return;
		}
		correctLayer[last] = value;
	}
	getOptionElement(moduleName, subpage, optionName) {
		if (!this.optionElements[moduleName])
			this.optionElements[moduleName] = {};
		if (!subpage || !optionName)
			return this.optionElements[moduleName];
		return this.optionElements[moduleName][subpage + '-' + optionName];
	}
	setOptionElement(moduleName, subpage, optionName, value) {
		if (!this.optionElements[moduleName])
			this.optionElements[moduleName] = {};
		this.optionElements[moduleName][subpage + '-' + optionName] = value;
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
		tab.appendChild(this._createSettingsTemplate());

		const settingsForm = tab.querySelector('#megaScriptGlobalSettingsForm');

		settingsForm.addEventListener('submit', this._handleSettingSubmit.bind(this));

		this.configManager.MODULES.forEach((module, index) => {
			const meta = module.metadata;
			if (!meta) {
				console.warn(`Settings not set up for module ${module.name}`);
			}

			settingsForm.appendChild(this._createSectionTemplate(
				module,
				meta?.displayName || module.name,
				meta?.description || ''
			));
		});

		const globalSubmitBtn = document.createElement('input');
		globalSubmitBtn.classList = 'btn btn-success mt-2';
		globalSubmitBtn.type = 'submit';
		globalSubmitBtn.value = 'Save ALL Changes';
		globalSubmitBtn.id = 'globalSubmitBtn';

		settingsForm.appendChild(globalSubmitBtn);

		tabContent.appendChild(tab);
	}
	_handleSettingSubmit(evt) {
		evt.preventDefault();
		evt.stopPropagation();
		evt.stopImmediatePropagation();

		const btn = evt.submitter;
		const oldValue = btn.value;

		btn.value = 'Settings Saved!';
		btn.disabled = true;

		setTimeout(() => {
			btn.value = oldValue;
			btn.disabled = false;
		}, 500);
		
		

		let settings;
		if (btn.id == 'globalSubmitBtn') {
			// Array of all settings
			settings = Object.values(this.optionElements).flatMap(e => Object.values(e));
		} else {
			const moduleName = btn.id.split('-')[0];
			settings = Object.values(this.getOptionElement(moduleName))
		}

		for (const settingObj of settings) {
			const path = settingObj.getPath();
			const value = settingObj.getValue();
			this.setTempSettings(path, value);
		}

		this.setSettings(this.storedSettings);
	}
	_createSettingsTemplate() {
		const settingsTemplate = document.createElement('div');
		settingsTemplate.classList = 'card-boder-0';
		settingsTemplate.innerHTML = `
			<div class="card-body">
				<div class="d-flex flex-column align-items-center">
					<div class="container classWrapper">
						<div class="accordion accordion-flush" id="classAccordion">
							<form class="mt-auto" id="megaScriptGlobalSettingsForm">
								<!-- Sections here -->
							</form>
						</div>
					</div>
				</div>
			</div>
		`
		return settingsTemplate;
	}
	_createSectionTemplate(module, name, description) {
		const sectionTemplate = document.createElement('div');
		const headerID = module.name + '-heading';
		const bodyID = module.name + '-body';
		sectionTemplate.classList = 'accordion-item';
		sectionTemplate.appendChild(this._createSectionHeaderTemplate(headerID, bodyID, name, description));
		sectionTemplate.appendChild(this._createSectionBodyTemplate(headerID, module));
		return sectionTemplate;
	}
	_createSectionHeaderTemplate(headerID, bodyID, name, description) {
		const sectionHeaderTemplate = document.createElement('h2');
		sectionHeaderTemplate.classList = 'accordion-header';
		sectionHeaderTemplate.id = headerID;
		sectionHeaderTemplate.innerHTML = `
			<button class="accordion-button bg-dark rounded collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${bodyID}" aria-expanded="false" aria-controls="${bodyID}">
				<div class="d-none d-sm-inline">
					<span class="text-center">${name}${description ? ' - ' + description : ''}</span>
				</div>
			</button>
		`;
		return sectionHeaderTemplate;
	}
	_createSectionBodyTemplate(headerID, module) {
		const sectionBodyTemplate = document.createElement('div');
		sectionBodyTemplate.classList = 'accordion-collapse collapse';
		sectionBodyTemplate.id = module.name + '-body';
		sectionBodyTemplate.setAttribute('aria-labelledby', headerID);
		sectionBodyTemplate.setAttribute('data-bs-parent', '#classAccordion');
		sectionBodyTemplate.innerHTML = `
			<div class="accordion-body">
				<form class="mt-auto">
					<div class="row pb-4">
						<div class="col-12 col-lg-6">
							<table id="${module.name}-isActive" class="table align-items-center table-flush table-hover dark-tertiary-bg">
								<thead class="thead-light">
									<tr>
										<th>Page</th>
										<th>Enabled</th>
									</tr>
								</thead>
								<tbody></tbody>
							</table>
						</div>
						<div class="col-6">
							<table id="${module.name}-customSettings" class="table align-items-center table-flush table-hover dark-tertiary-bg">
								<thead class="thead-light">
									<tr>
										<th>Setting</th>
										<th>Value</th>
									</tr>
								</thead>
								<tbody></tbody>
							</table>
						</div>
					</div>
					<input class="btn btn-success mt-2" type="submit" value="Save Changes" id="${module.name}-submitBtn">
				</form>
			</div>
		`;
		const tableActiveBody = sectionBodyTemplate.querySelector(`#${module.name}-isActive > tbody`);

		const methods = Object.getOwnPropertyNames(module.prototype);
		const settingsmeta = module.metadata?.settings;
		const allMethods = this.configManager.URL_MAP.values().toArray();
		const availableMethods = new Set(allMethods).intersection(new Set(methods));
		availableMethods
			.values()
			.forEach(method => {
				const methodMeta = settingsmeta?.active?.[method];
				const defaultDisplayName = this.methodToNameMap.get(method);
				const displayName = methodMeta?.displayName || defaultDisplayName;
				const description = methodMeta?.description || `Toggle module ${defaultDisplayName}`;
				const id = module.name + '-active-' + method;
				const template = this._createSettingOptionElem(displayName, description);
				const toggle = new OptionToggle(
					id,
					displayName,
					description,
					{
						storedValue: this.storedSettings[module.name]?.['active']?.[method],
						defaultValue: false
					}
				)

				this.setOptionElement(module.name, 'active', method, toggle);
				template.querySelector('td:last-of-type').appendChild(toggle.getTemplate());
				tableActiveBody.appendChild(template);
			});

		const tableCustomBody = sectionBodyTemplate.querySelector(`#${module.name}-customSettings > tbody`);

		const customSettings = settingsmeta?.custom;
		// No custom settings specified
		if (!customSettings || Object.keys(customSettings).length <= 0) {
			tableCustomBody.appendChild(this._createNoCustomSettingsElem());
		} else {
			for (const [name, data] of Object.entries(customSettings)) {
				const id = `${module.name}-custom-${name}`;
				let content;
				switch(data?.type) {
					case SettingType.TOGGLE:
						const toggle = new OptionToggle(
							id,
							data?.displayName || name,
							data?.description || '',
							{
								storedValue: this.storedSettings[module.name]?.['custom']?.[name],
								defaultValue: false
							}
						);
						this.setOptionElement(module.name, 'custom', name, toggle);
						content = toggle.getTemplate();
						break;
					default:
						console.warn(`The setting type for ${name} is not specified`);
						content = this._createMissingTypeEleme(name, data);
						break;
				}
				const template = this._createSettingOptionElem(data?.displayName || name, data?.description || '');
				template.querySelector('td:last-of-type').appendChild(content);
				tableCustomBody.appendChild(template);
			} 
		}

		sectionBodyTemplate
			.querySelector(`form.mt-auto`)
			.addEventListener('submit', this._handleSettingSubmit.bind(this));

		return sectionBodyTemplate;
	}
	_createSettingOptionElem(displayName, description) {
		const tableRow = document.createElement('tr');
		tableRow.classList = 'align-middle';
		tableRow.innerHTML = `
			<td title="${description}">${displayName}</td>
			<td></td>
		`;
		return tableRow;
	}
	_createMissingTypeEleme(name, data) {
		const template = this._createSettingOptionElem(
			data?.displayName || name,
			data?.description || ''
		);
		template.querySelector('td:last-of-type').innerHTML = 'Invalid Setting type'
	}
	_createNoCustomSettingsElem(){
		return this._createSettingOptionElem(
			'No custom settings specified',
			'Specify custom settings in the metadata of the module'
		);
	}
}

class OptionToggle {

	/**
	 * @param {{
	 *     storedValue: boolean,
	 *     defaultValue: boolean
	 * }} data - Additional data for the toggle
	 */
	constructor(name, displayName, description, data) {
		if (!this.htmlElem) {
			this.htmlElem = this._createHTMLTemplate(name, displayName, description);
			this.path = name.split('-');

			const storedValue = data?.storedValue;
			const defaultValue = data?.defaultValue;
			this.setValue(storedValue, defaultValue);
		}
	}

	_createHTMLTemplate(name, displayName, description) {
		const template = document.createElement('div');
		template.classList = 'form-check form-switch';
		template.innerHTML = `<input class="form-check-input" name="${name}" type="checkbox" id="${name}Switch">`;
		return template;
	}

	getTemplate() {
		return this.htmlElem;
	}

	getValue() {
		const input = this.htmlElem.querySelector(`input`);
		return input.checked;
	}

	setValue(storedValue, defaultValue=false) {
		const input = this.htmlElem.querySelector(`input`);
		input.checked = storedValue || defaultValue;
	}

	getPath() {
		return this.path;
	}
}