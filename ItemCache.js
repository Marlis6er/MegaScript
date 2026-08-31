class ItemCache {

	static metadata = {
		displayName: 'Item Cache',
		description: 'Cache the amount of items you currently have',
		settings: {
			active: {
				inMarket: {
					description: 'Update cache when items are listed or bought'
				},
				inInventory: {
					description: 'Store the amount of each item'
				},
				inProduction: {
					description: 'Display your current material items and how many days of production you have left'
				},
				inJobs: {
					description: 'Display your current material items and how many days of production you have left'
				}
			},
			custom: {
				production_stock_days: {
					displayName: 'Production Stock Days',
					description: 'Number of days of production materials to stock up',
					type: SettingType.INTEGER,
					extra: {
						defaultValue: 7
					}
				}
			}
		}
	}

	constructor() {
		const configManager = ConfigManager.getInstance();
		this.brightness = configManager.darkmode ? 50 : 45;
		this.days = configManager.getCustomSetting(this, 'production_stock_days') || 1;

		this.prodItemNames = ["Bag of Fertiliser", "Agave Heart", "Coca Paste"];
		this.itemNames = [...this.prodItemNames, "Cocaine", "Personal Favour", 'Corana Beer']; // Also cache these for other scripts
	}
	getCache(type) {
		return getNumericValue('itemCache', type);
	}
	setCache(type, cache) {
		setValue('itemCache', type, cache);
		console.debug(`Set itemCache_${type} to ${cache}`);
		return cache;
	}
	getReq(type) {
		return getNumericValue('prodReq', type);
	}
	setReq(type, req) {
		setValue('prodReq', type, req);
		console.debug(`Set prodReq_${type} to ${req}`);
		return req;
	}
	inMarket(url) {
		const eventCard = document.querySelector("div.contentColumn p.card-text.fw-bold.text-white");
		if (eventCard === null) return;

		const eventText = eventCard.innerText.split(" - ")[1];
		const textSplit = eventText.split(' ');
		if (textSplit[1] === "listed") {
			let i = 3;
			let itemName = textSplit[i];
			while (textSplit[++i] !== "for") itemName += ` ${textSplit[i]}`;
			if (!this.itemNames.includes(itemName)) return;

			const curVal = this.getCache(itemName);
			if (curVal === null) return;

			const amount = parseInt(textSplit[2].slice(1).replace(',', ""));
			this.setCache(itemName, curVal - amount);
		} else if (textSplit[0] === "bought") { // TODO: Fix this. Page no longer reloads when buying items
			let i = 2;
			let itemName = textSplit[i];
			while (textSplit[++i] !== "for") itemName += ` ${textSplit[i]}`;

			if (!this.itemNames.includes(itemName)) return;

			const curVal = this.getCache(itemName);
			if (curVal === null) return;

			const amount = parseInt(textSplit[1].slice(1).replace(',', ""));
			this.setCache(itemName, curVal + amount);
		}
	}
	inInventory(url) {
		let itemList = document.querySelectorAll("div.container.inventoryWrapper.pt-2 > div.inventoryItemWrapper");
		if (itemList === null) return;

		let done = [];

		for (const item of itemList) {
			if (item.children.length < 2) continue;

			const itemName = item.children[1].innerText.split(' ').slice(0, -1).join(' ');
			if (!this.itemNames.includes(itemName)) continue;

			const itemCount = parseInt(item.querySelector("span.itemQuantity").textContent.replace(",", ""));
			this.setCache(itemName, itemCount);
			done.push(itemName);
		}
		for (const itemName of this.itemNames) {
			if (!done.includes(itemName)) this.setCache(itemName, 0);
		}
	}
	// TODO: Adjust to account for prestiges
	inProduction(url) {
		const containers = document
			.querySelectorAll("div.prodContainer div.equipmentModule div.row.flex-column")
			.values()
			.toArray()
			.slice(2);
		if (containers === null) return;

		const narcosPerProd = [25, 10, 60];
		const prodReqs = [10, 5, 35];
		for (let i = 0; i < containers.length; ++i) {
			const container = containers[i];
			const assignedText = container.querySelector("input.assignNarcoInput");
			const assigned = parseInt(assignedText.value);
			const prodReq = Math.ceil(assigned / narcosPerProd[i]) * prodReqs[i];
			this.setReq(this.prodItemNames[i], prodReq);
		}
	}
	inJobs(url) {
		const jobPanels = document.querySelectorAll("div.equipmentModule div.flex-column");
		if (jobPanels?.length <= 0) return;

		const prodMatjobIDs = [4, 5, 6];
		for (const i of prodMatjobIDs) {
			const jobPanel = jobPanels[i];

			const supplyElem = jobPanel.querySelector('div.text-center > p');
			const supplyText = supplyElem.innerHTML;
			const supplyRegex = new RegExp('x(?<supply>\\d+)');
			const supply = supplyRegex.exec(supplyText)?.groups?.supply || 0;
			
			const prodReq = this.getReq(this.prodItemNames[i - 4]);
			if (prodReq === null) continue;

			supplyElem.title = `Material  for ${this.days} days`;
			const materialText = `Have <span class="fw-bold" style="color: hsl(${prodReq === 0 ? 120 : Math.min(supply / (prodReq * this.days), 1) * 120}, 67%, ${this.brightness}%)">${supply.toLocaleString("en-US")}/${prodReq * this.days}</span>`;

			if (supplyElem.textContent === 'N/A')
				supplyElem.innerHTML = materialText + ' ' + this.prodItemNames[i - 4];
			else 
				supplyElem.innerHTML = supplyText.replace(`x${supply}`, materialText);
		}
	}
}