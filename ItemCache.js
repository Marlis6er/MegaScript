class ItemCache {
	constructor(darkMode, days) {
		this.brightness = darkMode ? 50 : 45;
		this.days = days;

		this.prodItemNames = ["Bag of Fertiliser", "Agave Heart", "Coca Paste"];
		this.itemNames = [...this.prodItemNames, "Cocaine", "Personal Favour"]; // Also cache these for other scripts
	}
	getCache(type) {
		const cache = GM_getValue(`itemCache_${type}`);
		return cache === undefined ? null : cache;
	}
	setCache(type, cache) {
		GM_setValue(`itemCache_${type}`, cache);
		console.debug(`Set itemCache_${type} to ${cache}`);
		return cache;
	}
	getReq(type) {
		const req = GM_getValue(`prodReq_${type}`);
		return req === undefined ? null : req;
	}
	setReq(type, req) {
		GM_setValue(`prodReq_${type}`, req);
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

		for (let i = 4; i !== 8; ++i) {
			const jobPanel = jobPanels[i];
			let append = `<hr class="w-75"><p class="text-center">`;
			if (i !== 7) {
				const have = this.getCache(this.prodItemNames[i - 4]);
				const prodReq = this.getReq(this.prodItemNames[i - 4]);
				if (prodReq === null)
					append += `Have <span class="text-muted">???</span>`;
				else if (prodReq === 0)
					append += "None needed";
				else if (have === null)
					append += `Have <span class="text-muted">???/${prodReq}</span>`;

				else
					append += `Have <span class="fw-bold" style="color: hsl(${prodReq === 0 ? 120 : Math.min(have / (prodReq * this.days), 1) * 120}, 67%, ${this.brightness}%)">${have.toLocaleString("en-US")}/${prodReq}</span>`;
			} else append += "None needed";
			append += " for production</p>";
			jobPanel.innerHTML += append;
		}
	}
}