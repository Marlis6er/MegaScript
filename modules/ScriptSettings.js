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
					<span class="text-center fw-bold" style="color: hsl(250, 40%, 60%)">${name}</span>${description ? '<span style="color: gray"> - ' + description  + '</span>' : ''}
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
				const attributes = [
					id,
					this.storedSettings[module.name]?.['custom']?.[name],
					data?.defaultValue,
					data?.extra
				];
				let optionObj;
				switch(data?.type) {
					case SettingType.TOGGLE:
						optionObj = new OptionToggle(...attributes);
						break;
					case SettingType.INTEGER:
						optionObj = new OptionInteger(...attributes);
						break;
					case SettingType.LIST:
						optionObj = new OptionList(...attributes);
						break;
					case SettingType.MULTISELECT:
						optionObj = new OptionMultiSelect(...attributes);
						break;
					default:
						console.warn(`The setting type for ${name} is not specified`);
						optionObj = new OptionDefault(...attributes);
						break;
				}
				this.setOptionElement(module.name, 'custom', name, optionObj);
				const content = optionObj.getTemplate();

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
		return template;
	}
	_createNoCustomSettingsElem(){
		return this._createSettingOptionElem(
			'No custom settings specified',
			'Specify custom settings in the metadata of the module'
		);
	}
}

class OptionDefault {
	constructor(name, storedValue, defaultValue, data) {
		if (!this.htmlElem) {
			this.htmlElem = this._createHTMLTemplate(name);
			this.path = name.split('-');
		}
	}

	_createHTMLTemplate(name) {
		const template = document.createElement('div');
		template.innerHTML = 'Invalid option type';
		return template;
	}

	getTemplate() {
		return this.htmlElem;
	}

	getValue() {
		return undefined;
	}

	setValue() {
	}

	getPath() {
		return this.path;
	}
}

class OptionToggle {

	constructor(name, storedValue, defaultValue, data) {
		if (!this.htmlElem) {
			this.htmlElem = this._createHTMLTemplate(name);
			this.path = name.split('-');

			this.setValue(storedValue, defaultValue);
		}
	}

	_createHTMLTemplate(name) {
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

class OptionInteger {

	constructor(name, storedValue, defaultValue, data) {
		if (!this.htmlElem) {
			this.htmlElem = this._createHTMLTemplate(name);
			this.path = name.split('-');

			this.setValue(storedValue, defaultValue);
		}
	}

	_createHTMLTemplate(name) {
		const template = document.createElement('div');
		template.innerHTML = `<input class="form-control" required="" id="${name}Int" name="${name}" type="number" placeholder="7" min="0" max="9999" value="">`;
		return template;
	}

	getTemplate() {
		return this.htmlElem;
	}

	getValue() {
		const input = this.htmlElem.querySelector(`input`);
		const rawValue = input.value;
		const value = parseInt(rawValue);
		return value;
	}

	setValue(storedValue, defaultValue=0) {
		const input = this.htmlElem.querySelector(`input`);
		if (storedValue === undefined || storedValue === null)
			input.value = defaultValue;
		else
			input.value = storedValue;
	}

	getPath() {
		return this.path;
	}
}

class OptionList {
	EMPTY_ITEM_TEXT = '- Select Item -';
	DELETE_BTN_TEMPLATE = '<button class="btn btn-sm btn-danger action-btn fw-normal float-end ms-2" title="Remove entry"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path></svg></buton>';

	/**
	 * @param {{
	 *     availableElements: string[];
	 * }} data - Additional data
	 */
	constructor(name, storedValue, defaultValue, data) {
		this.itemList = [];
		this.unique = data?.unique || false;
		this.name = name;

		const availableElements = data?.availableElements || [];

		if (!this.htmlElem) {
			this.htmlElem = this._createHTMLTemplate(name);
			this.path = name.split('-');

			const formElem = this.htmlElem.querySelector('form')

			formElem.addEventListener('submit', this._addBtnHandler.bind(this));
			formElem.querySelector(`select#${name}Itemlist`).addEventListener('change', this._selectChangeHandler.bind(this));

			this._populateSelect(this.htmlElem.querySelector('select'), availableElements);

			this.setValue(storedValue, defaultValue);
		}
	}

	_createHTMLTemplate(name) {
		const template = document.createElement('div');
		template.innerHTML = `
			<table class="table align-items-center table-flush table-hover" id="${name}Table"><tbody></tbody></table>
			<hr>
			<form class="input-group row-adjust" id="${name}Form">
				<select class="form-select form-control col-8" id="${name}Itemlist" name="${name}" form="${name}Form">
					<option id="${name}DefaultOption">${this.EMPTY_ITEM_TEXT}</option>
				</select>
				<button class="btn btn-sm btn-success action-btn fw-normal float-end col-2" id="${name}AddBtn" disabled>Add</button>
			</form>
		`;

		return template;
	}

	_selectChangeHandler(evt) {
		const selected = evt.target.querySelector('option:checked');
		const form = evt.target.parentElement;
		const btn = form.querySelector(`button#${this.name}AddBtn`);
		if (selected.textContent === this.EMPTY_ITEM_TEXT)
			btn.disabled = true;
		else
			btn.disabled = false;
	}

	_addBtnHandler(evt) {
		evt.preventDefault();
		evt.stopImmediatePropagation();
		evt.stopPropagation();

		this._addToList();
	}

	getTemplate() {
		return this.htmlElem;
	}

	getValue() {
		const entries = this.htmlElem.querySelectorAll(`table#${this.name}Table > tbody > tr > td:first-of-type`);
		return entries.values().map(elem => elem.textContent).toArray();
	}

	setValue(storedValue, defaultValue=[]) {
		let elements;
		const input = this.htmlElem.querySelector(`input`);
		if (storedValue === undefined || storedValue === null)
			elements = defaultValue;
		else
			elements = storedValue;

		const itemListElem = this.htmlElem.querySelector('table > tbody');
		itemListElem.innerHTML = '';
		this.itemList = [];
		for (const entry of elements) {
			this._addToList(entry);
		}
	}

	_addToList(elem) {
		const tableBodyElem = this.htmlElem.querySelector('table > tbody');
		const formElem = this.htmlElem.querySelector('form');
		const selectElem = formElem.querySelector('select');
		const selectedOptionElem = selectElem.querySelector('option:checked');

		const entry = elem || selectedOptionElem.textContent;
		if (entry === this.EMPTY_ITEM_TEXT) return;
		if (this.unique && this.itemList.includes(entry)) return;
		if (this.unique) {
			selectElem
				.querySelectorAll('option')
				.values()
				.find(option => option.textContent === entry)
				.remove();
		}
			

		selectElem.selectedIndex = 0;
		selectElem.dispatchEvent(new Event('change'));

		this.itemList.push(elem);

		this._addToListElem(tableBodyElem, entry);
	}

	_addToListElem(tbodyElem, entry) {
		const newListElem = document.createElement('tr');
		const itemNameElem = document.createElement('td');
		itemNameElem.textContent = entry;

		const removeBtn = document.createElement('td');
		removeBtn.innerHTML = this.DELETE_BTN_TEMPLATE;

		removeBtn.querySelector('button').addEventListener('click', this._deleteBtnHandler.bind(this));

		newListElem.appendChild(itemNameElem);
		newListElem.appendChild(removeBtn);
		tbodyElem.appendChild(newListElem);
	}

	_deleteBtnHandler(evt) {
		const btn = evt.currentTarget;
		// Should be the tr element
		const tableRowElem = btn.parentElement.parentElement;
		const entry = tableRowElem.querySelector('td').textContent;

		if (this.unique) {
			const outerTdElem = tableRowElem.parentElement.parentElement.parentElement;
			const formElem = outerTdElem.querySelector('form');
			const selectElem = formElem.querySelector('select');
			
			const optionElem = document.createElement('option');
			optionElem.textContent = entry;
			selectElem.add(optionElem);
		}
		tableRowElem.remove();
		arrayRemoveElem(this.itemList, entry);
	}

	getPath() {
		return this.path;
	}

	_populateSelect(selectElem, entries) {
		selectElem.innerHTML = `<option>${this.EMPTY_ITEM_TEXT}</option>`;

		for (const entry of entries) {
			const optionElem = document.createElement('option');
			optionElem.textContent = entry;
			selectElem.add(optionElem);
		}
	}
}

class OptionMultiSelect {
	/**
	 * @param {{
	 *     availableElements: string[];
	 * }} data - Additional data
	 */
	constructor(name, storedValue, defaultValue, data) {
		this.availableElements = data?.availableElements || [];
		this.name = name;

		if (!this.htmlElem) {
			this.htmlElem = this._createHTMLTemplate(name);
			this.path = name.split('-');

			const formElem = this.htmlElem.querySelector('form');

			this._populateSelect(this.htmlElem.querySelector('select'), this.availableElements);

			this.setValue(storedValue, defaultValue);
		}
	}

	_createHTMLTemplate(name) {
		const template = document.createElement('div');
		template.innerHTML = `
			<form class="input-group row-adjust" id="${name}Form">
				<select class="form-select form-control" id="${name}MultiSelect" name="${name}" multiple>
				</select>
			</form>
		`;
		return template;
	}

	getTemplate() {
		return this.htmlElem;
	}

	getValue() {
		return this.htmlElem
			.querySelectorAll(`form > select`)
			.selectedOptions
			.values()
			.map(option => option.textContent)
			.toArray();
	}

	setValue(storedValue, defaultValue=[]) {
		let items;
		if (storedValue === undefined || storedValue === null)
			items = defaultValue;
		else
			items = storedValue;

		const selectElem = this.htmlElem.querySelector('form > select');
		for (const entry of items) {
			selectElem.options.values().find(option => option.textContent === entry).checked = true;
		}
	}

	getPath() {
		return this.path;
	}

	_populateSelect(selectElem, elements) {
		selectElem.innerHTML = '';

		for (const elem of elements) {
			const optionElem = document.createElement('option');
			optionElem.textContent = elem;
			selectElem.add(optionElem);
		}
	}
}