class BetterItemValues {
	constructor(darkMode, strikethrough, alwaysColorNames) {
		this.brightness = darkMode ? 50 : 45;
		this.bestColor = `hsl(60, 100%, ${darkMode ? 70 : 40}%)`;
		this.strikethrough = strikethrough;
		this.alwaysColorNames = alwaysColorNames;

		this.pointName = "Supporter Points";

		const values = GM_listValues().filter(name => name.startsWith("value_")); // Prefill values first use
		this.defaultVals = {
			"Walther P38": 2200,
			"AK-47": 13000,
			"M1911": 13000,
			"M16A2 Rifle": 13000,
			"S&W Magnum Revolver": 120000,
			"MG34": 400000,
			"Fragmentation Grenade": 24999,
			"Stun Grenade": 18000,
			"Illuminating Grenade": 9999,
			"Flash Bang Grenade": 9999,
			"Tear Gas Grenade": 18000,
			"Covert Stab Vest": 75000,
			"Tactical Plate Armour": 3000000,
			"Personal Favour": 170000,
			"Supporter Pack": 9500000,
			"Corana Beer": 150000,
			"Mexcal Beer": 438000,
			"Blancoda Tequila": 847000,
			"Repose Tequila": 1850000,
			"Anejo Tequila": 1720000,
			"Raicilla": 2000000,
			"Bandage": 3999,
			"Small Medical Kit": 6999,
			"Tainted Cannabis": 9999,
			"Large Medical Kit": 16000,
			"Basic Trauma Kit": 25000,
			"Large Trauma Kit": 40000,
			"Tainted Cocaine": 15000,
			"Cannabis": 24998,
			"Cocaine": 610000,
			"Bag of Fertiliser": 19000,
			"Coca Paste": 26000,
			"Agave Heart": 53000,
			"Concrete Bags": 89000,
			"Nails": 124900,
			"Bricks": 99999,
			"Steel": 94000,
			"Dog Food": 7398,
			"Supporter Points": 34899,
			"El Chapo's Head": 10000000,
			"Glock 18": 500000,
			"Ballistic Vest": 100000,
			"G36": 750000,
			"Desert Eagle": 8000000
		}; // Players should go to the market to load up-to-date values, these are presets probably over half a year old
		if (values.length === 0) {
			for (var name in this.defaultVals)
				this.setValue(name, defaultVals[name]);
		}

		this.maxCokeDaily = 8;
		this.cokeODChance = 1; // percent
		this.taintedChance = [10, 20]; // percent
		this.energyItems = {
			"Corana Beer": 5,
			"Mexcal Beer": 10,
			"Blancoda Tequila": 15,
			"Repose Tequila": 20,
			"Anejo Tequila": 25,
			Raicilla: 30,
			Cocaine: 50 * (1 - this.cokeODChance / 100),
			"Glittering Gift": 100
		};
		this.hospitalItems = {
			Bandage: 10,
			"Small Medical Kit": 15,
			"Large Medical Kit": 60,
			"Basic Trauma Kit": 80,
			"Large Trauma Kit": 120
		};

		this.prodDepreciation = 2;
		this.narcoCounts = [1, 5, 25, 10, 60];
		this.prodMoney = [1000, 0, 105000, 70000, 800000]; // Accurate
		this.prodCokeScaling = [1, 1.75, 2.3125, 2.734375]; // Source: screenshot in the Coke suggestions thread
		this.prodReqs = [
			{},
			{},
			{ "Bag of Fertiliser": 10 },
			{ "Agave Heart": 5 },
			{ "Coca Paste": 35 }
		];
		this.doctorsOfficePerProd = 1;
		this.maxCannabis = 12;
		this.alcoholPerProd = 1;
		this.maxCoke = 8;
		this.itemCounts = [
			{},
			{
				Bandage: this.doctorsOfficePerProd * 50 / 100,
				"Small Medical Kit": this.doctorsOfficePerProd * 30 / 100,
				"Large Medical Kit": this.doctorsOfficePerProd * 12.5 / 100,
				"Basic Trauma Kit": this.doctorsOfficePerProd * 5 / 100,
				"Large Trauma Kit": this.doctorsOfficePerProd * 2.5 / 100
			},
			{
				Cannabis: this.maxCannabis / 2 * (1 - this.taintedChance[0] / 100),
				"Tainted Cannabis": this.maxCannabis / 2 * this.taintedChance[0] / 100
			},
			{
				"Corana Beer": this.alcoholPerProd * 25.9 / 100,
				"Mexcal Beer": this.alcoholPerProd * 8.5 / 100,
				"Blancoda Tequila": this.alcoholPerProd * 30.3 / 100,
				"Repose Tequila": this.alcoholPerProd * 14.1 / 100,
				"Anejo Tequila": this.alcoholPerProd * 9.5 / 100,
				Raicilla: this.alcoholPerProd * 3.1 / 100
			},
			{
				Cocaine: this.maxCoke / 2 * (1 - this.taintedChance[1] / 100),
				"Tainted Cocaine": this.maxCoke / 2 * this.taintedChance[1] / 100
			}
		];
		//this.jobTimes = [ 5, 30, 60, 180, 15, 30, 60, 90, 360, 720 ]; // NOTE: prestige may change this, so instead calculate
		this.jobMoney = [1650, 14000, 55000, 250000, 111, 111, 111, 260, 700000, 2250000];
		// Base rep for standard jobs doubled with https://cartelempire.online/Forum/1/7289
		this.jobRep = [20, 150, 320, 980, 21, 50, 82, 165, 2260, 4640];
		this.jobItems = [
			{},
			{ "Personal Favour": 1 / 20 },
			{ "Personal Favour": 1 / 15 },
			{ "Personal Favour": 1 / 10 },
			{ "Bag of Fertiliser": 5 },
			{ "Agave Heart": 2.5 },
			{ "Coca Paste": 9.5 },
			{ Nails: 11 * 0.4, Bricks: 11 * 0.3, "Concrete Bags": 11 * 0.2, Steel: 11 * 0.1 },
			{ "Personal Favour": 1 / 5 }, // TODO this is a guess
			{ "Personal Favour": 1 / 2 } // TODO this is a guess
		];

		const prodProfit = GM_getValue("perks_Production Profit") || 0; // percentage; NOTE: only works when integrated with other scripts
		this.prodProfitFactor = 1 + prodProfit / 100;
		const streetProfit = GM_getValue("perks_Street Crime Profit") || 0; // percentage; NOTE: only works when integrated with other scripts
		this.streetProfitFactor = 1 + streetProfit / 100;
		const jobProfit = GM_getValue("perks_Job Profits") || 0; // percentage; NOTE: only works when integrated with other scripts
		this.jobProfitFactor = 1 + jobProfit / 100;
		const medEffectivenessBoost = GM_getValue("perks_Med Effectiveness") || 0; // percentage; NOTE: only works when integrated with other scripts
		this.medEffectivenessFactor = 1 + medEffectivenessBoost / 100;

		this.poundPerEnergy = {};
		this.maxPpe = 0;
		this.minPpe = Infinity;
		this.poundPerHospitalTime = {};
		this.maxPpht = 0;
		this.minPpht = Infinity;

		for (const item in this.energyItems) {
			const price = this.getValue(item);
			if (price === null) continue;

			const ppe = price / this.energyItems[item];
			this.poundPerEnergy[item] = ppe;
			this.maxPpe = Math.max(this.maxPpe, ppe);
			this.minPpe = Math.min(this.minPpe, ppe);
		}
		for (const item in this.hospitalItems) {
			const price = this.getValue(item);
			if (price === null) continue;

			let time = this.hospitalItems[item];
			time *= this.medEffectivenessFactor;
			const ppht = price / time;
			this.poundPerHospitalTime[item] = ppht;
			this.maxPpht = Math.max(this.maxPpht, ppht);
			this.minPpht = Math.min(this.minPpht, ppht);
		}
		// NOTE: calculate job values inJob since it's only used there and we need prestige levels

		const pointVal = this.getValue(this.pointName);
		// To avoid multiplication with null
		const calcPointVal = amount => pointVal !== null ? amount * pointVal : pointVal;

		this.spinnerValues = new Map([
			['nothing', 0],
			['a Free Spin', 0],
			['\u00a310,000', 10_000],
			['\u00a350,000', 50_000],
			['\u00a3100,000', 100_000],
			['\u00a3250,000', 250_000],
			['a Personal Favour', this.getValue('Personal Favor')],
			['5 Points', calcPointVal(5)],
			['25 Points', calcPointVal(25)],
			['50 Points', calcPointVal(50)],
			['a Supporter Pack', this.getValue('Supporter Pack')],
			['500 Points', calcPointVal(500)]
		]);
	}
	getValue(itemName) {
		let formattedName = `value_${itemName.replaceAll(' ', '_')}`;
		let val = GM_getValue(formattedName, null);

		// Fallback to old format if new format returns null
		if (val === null || val === NaN) {
			formattedName = `value_${itemName}`; // Try without replacing spaces
			val = GM_getValue(formattedName, null);
		}

		// Failsafe, because GM_getValue turns null into NaN
		if (isNaN(val)) {
			val = null;
		}

		console.debug(`Fetching value for: ${formattedName}, ItemName: ${itemName}, Result: ${val}`);
		return val;
	}
	setValue(itemName, value) {
		GM_setValue(`value_${itemName}`, value);
		console.debug(`Set value_${itemName} to \u00a3${value.toLocaleString("en-US")}`);
		return value;
	}
	inMarket(url) {
		const itemSelector = document.querySelector("#itemSelector");
		if (itemSelector === null) return;

		const options = itemSelector.options;
		const pointPriceLabel = document.querySelector("#pricePerPointsLabel");

		let price = this.getValue(this.pointName);
		const pointCurrentBest = createPointPriceContainer(price);

		pointPriceLabel.textContent += ' ';
		pointPriceLabel.appendChild(pointCurrentBest);

		const pricePerLabel = document.querySelector("#pricePerLabel");

		let itemName = options[0].textContent;
		let currentBest = this.getValue(itemName);
		const priceCurrentBest = createItemPriceContainer(itemName, currentBest);

		pricePerLabel.textContent += ' ';
		pricePerLabel.appendChild(priceCurrentBest);

		itemSelector.addEventListener("change", e => {
			for (const option of options) {
				if (option.value !== e.target.value) continue;

				itemName = option.textContent.trim().replace(/\s+-\s+\d+(?:\.\d+)?%$/, "");
				price = this.getValue(itemName);
				priceCurrentBest.value = itemName;
				priceCurrentBest.textContent = `(\u00a3${price === null ? "???" : price.toLocaleString("en-US")})`;
				break;
			}
		});

		const container = document.querySelector("nav#itemMarketNav > div.tab-content");

		// Initial run to process any already loaded items
		processItems();

		// Start observing for dynamic changes
		observeMarketChanges();


		// Handle event card updates (unchanged)
		handleItemListing();

		// Function to handle item processing
		function processItems() {
			const offerListWrappers = document.querySelectorAll("div.offerListWrapper");
			console.info("Number of offerListWrappers found:", offerListWrappers.length);

			offerListWrappers.forEach(wrapper => {
				const itemCards = wrapper.querySelectorAll("div.col-xl-2.col-md-3.col-sm-4.col-6");
				console.info("Number of item cards in wrapper:", itemCards.length);

				itemCards.forEach(handleItemCard);
			});
		}

		function handleItemCard(card) {
			try {
				const itemName = card.querySelector("h5.card-title").textContent.trim();
				console.debug(`Found item: ${itemName}`); // Debugging log

				const itemPriceText = card.querySelector("p.card-text.fst-italic").textContent.trim();
				const itemPrice = parseInt(itemPriceText.slice(1).split(' ')[0].replaceAll(',', ""));

				// Format key to match required format
				const key = `value_${itemName.replace(/\s+/g, '_')}`;

				// Use GM_getValue to retrieve the current best value
				const currentBest = GM_getValue(key, null);
				console.debug(`Current stored value for ${itemName}: ${currentBest}`); // Debugging log

				if (currentBest === itemPrice) {
					console.debug(`No update needed for ${itemName}. Current: £${currentBest}, New: £${itemPrice}`); // Debugging log
					return;
				}

				console.debug(`Updating value for ${itemName} from ${currentBest} to ${itemPrice}`); // Debugging log
				GM_setValue(key, itemPrice); // Store value with formatted key
				const newStoredValue = GM_getValue(key);
				console.debug(`New stored value for ${itemName}: ${newStoredValue}`); // Debugging log


				// Ensure pointName and priceCurrentBest are defined
				if (typeof pointName !== 'undefined' && itemName === pointName) {
					pointCurrentBest.textContent = `(\u00a3${itemPrice.toLocaleString("en-US")})`;
				} else if (priceCurrentBest && priceCurrentBest.value === itemName) {
					priceCurrentBest.textContent = `(\u00a3${itemPrice.toLocaleString("en-US")})`;
				}
			} catch (error) {
				console.error(`Error processing card: ${error}`);
			}
		}

		// Observer to watch for changes in the market area and re-run the script
		function observeMarketChanges() {
			const targetNode = document.querySelector("#itemMarketNav"); // Adjust the selector as needed
			if (!targetNode) return;

			observeDOM(targetNode, (mutationsList) => {
				for (const mutation of mutationsList) {
					if (mutation.type !== "childList" || mutation.addedNodes.length <= 0)
						continue;
					console.info("Detected new nodes in market area, re-running item processing...");
					processItems(); // Re-run the script to process newly added items
				}
			});
		}

		function handleItemListing() {
			const eventCard = document.querySelector("div.contentColumn p.card-text.fw-bold.text-white");
			if (eventCard === null) return;

			const eventText = eventCard.textContent.split(" - ")[1];
			const textSplit = eventText.split(' ');
			if (textSplit[1] !== "listed") return;

			let i = 3;
			let itemName = textSplit[i];
			while (textSplit[++i] !== "for") itemName += ` ${textSplit[i]}`;

			const val = parseInt(textSplit.at(-1).slice(1).replace(',', ""));
			const curVal = this.getValue(itemName);

			if (curVal === null || val < curVal) this.setValue(itemName, val);
		}

		function createPointPriceContainer(price) {
			const pointCurrentBest = document.createElement("span");
			pointCurrentBest.id = "pricePerPointsLabelCurrentBest";
			pointCurrentBest.classList.add("text-muted");

			pointCurrentBest.innerText = `(\u00a3${price === null ? "???" : price.toLocaleString("en-US")})`;

			return pointCurrentBest;
		}

		function createItemPriceContainer(itemName, price) {
			const priceCurrentBest = document.createElement("span");
			priceCurrentBest.id = "pricePerLabelCurrentBest";
			priceCurrentBest.classList.add("text-muted");
			priceCurrentBest.value = itemName;

			priceCurrentBest.innerText = `(\u00a3${price === null ? "???" : price.toLocaleString("en-US")})`;

			return priceCurrentBest;
		}

	}
	inSupporter(url) {
		const refillText = document.querySelector("div.card-body p.card-text:not(.fw-bold)");
		const pointPrice = this.getValue(this.pointName);
		if (pointPrice === null) return;

		refillText.innerHTML = `${refillText.innerText.slice(0, -1)} <span class="text-muted">(\u00a3${(pointPrice * 25).toLocaleString("en-US")})</span>.`;
	}
	inEstateAgent(url) {
		const buildReqs = document.querySelectorAll("div.row.pb-2");

		for (const buildReq of buildReqs) {
			const matList = buildReq.querySelector('div.col-6.d-flex.flex-column > p');

			let totalCost = 0;
			matList.innerHTML = matList
				.innerHTML
				.split("<br>")
				.map(mat => {
					const count = parseInt(mat.split(' ')[0].slice(1).replaceAll(',', ""));
					const val = this.getValue(mat.split(' ').slice(1).join(' ').trim());

					if (val === null) totalCost = "???";
					else if (totalCost !== "???") totalCost += count * val;

					return `${mat.trim()} <span class="text-muted">(\u00a3${val === null ? "???" : (count * val).toLocaleString("en-US")})</span>`;
				})
				.join('<br>');

			if (totalCost !== "???") {
				const cash = buildReq.querySelector('div:nth-child(2) > p.form-data-inset.p-2.mb-2.rounded');
				totalCost += parseInt(cash.textContent.slice(1).replaceAll(',', ""));
			}
			buildReq.innerHTML += `<div class="col-6"><p class="fw-bold mb-0">Total Value:</p><p class="fw-bold text-muted">\u00a3${totalCost === "???" ? "???" : totalCost.toLocaleString("en-US")}</p></div>`;
		}

		const buildModal = document.querySelector("div#buildModal");

		observeDOM(buildModal, e => {
			const modal = e[1].target;
			const matList = modal.querySelectorAll("ul > li");

			let changed = false;
			let totalCost = 0;
			for (const matDesc of matList) {
				if (matDesc.children.length > 0) continue;

				const mat = matDesc.textContent;
				// Build cost
				if (mat[0] === '\u00a3') {
					totalCost += parseInt(mat.slice(1).replaceAll(',', ""));
					continue;
				}

				changed = true;
				const count = parseInt(mat.split(' ')[0].slice(0, -1).replaceAll(',', ""));
				const matName = mat.split(' ').slice(1).join(' ').trim();
				const val = this.getValue(matName === "Concrete" ? "Concrete Bags" : matName);
				matDesc.innerHTML = `${mat.trim()} <span class="text-muted">(\u00a3${val === null ? "???" : (count * val).toLocaleString("en-US")})</span>`;

				if (val === null) totalCost = "???";
				else if (totalCost !== "???") totalCost += count * val;
			}
			if (changed)
				modal.innerHTML += `<p class="fw-bold text-center mt-3">Total value: <span class="text-muted">\u00a3${totalCost === "???" ? "???" : totalCost.toLocaleString("en-US")}</span></p>`;
		});
	}
	inTownStore(url) {
		const itemSelector = 'div.container.inventoryWrapper.mb-4 > div.inventoryItemWrapper';
		const items = Array.from(document.querySelectorAll(itemSelector));
		for (const item of items) {
			if (item.children.length < 2) continue;

			let selling = false;
			let itemName = "";
			// Determine if we're in the sell or the buy section
			if (item.children[1].children.length) {
				itemName = item.children[1].textContent.split(' ').slice(0, -1).join(' ');
				selling = true;
			}
			else itemName = item.children[1].textContent;

			this.updateStoreUI(item, itemName, selling);
		}
	}
	updateStoreUI(item, itemName, inSellingUI) {
		const currentBest = this.getValue(itemName);
		if (currentBest === null) return;

		const priceElem = item.children[4];
		const currentVal = parseInt(priceElem.textContent.slice(1).replaceAll(',', ""));

		let shopHTML = priceElem.innerHTML;
		if (currentVal > currentBest)
			shopHTML = `<span class="text-${inSellingUI ? "success" : "danger"}">${priceElem.textContent}</span>`;
		else if (currentVal === currentBest && inSellingUI)
			shopHTML = `<span class="text-warning">${priceElem.textContent}</span>`;

		const marketHTML = `<br><span class="text-muted">(\u00a3${currentBest.toLocaleString("en-US")})</span>`;

		priceElem.innerHTML = shopHTML + marketHTML;
		const otherValueText = item.children[6].querySelector("div.col-6");
		otherValueText.innerHTML = `<div class="card-text"><div class="fw-bold">Value</div>${shopHTML}${marketHTML}</div>`;
	}
	inTradeView(url) {
		const tradeTabs = document.querySelectorAll("div.card-body:not(.text-center)");
		const totalVal = [0, 0];

		for (let i = 0; i !== 2; ++i) {
			const tradeTab = tradeTabs[i + 1];
			const itemList = tradeTab.querySelector("div.table-responsive tbody");
			if (itemList !== null) {
				totalVal[i] += this.handleTradeItemList(itemList);
			}

			const inputs = tradeTab.querySelectorAll("input.form-control");
			const pointVal = this.getValue(this.pointName);

			// Cash in trade
			totalVal[i] += parseInt(inputs[0].value.replaceAll(',', ""));

			if (pointVal !== null) {
				totalVal[i] += pointVal * parseInt(inputs[1].value.replaceAll(',', ""));
			} else {
				totalVal[i] = "???";
				continue;
			}
			const properties = tradeTab.querySelectorAll("div.card.equipmentModule");
			for (const property of properties) {
				const propertyVal = property.querySelector("div.card-text");
				totalVal[i] += parseInt(propertyVal.textContent.slice(1).replaceAll(',', ""));
			}
		}
		this.updateTradeUI(tradeTabs, totalVal);
	}
	handleTradeItemList(itemList) {
		itemList.children[0].innerHTML += "<th>Value</th>";

		let value = 0;
		const items = itemList.querySelectorAll("tr.align-middle");
		for (const item of items) {
			const itemName = item.children[0].textContent;
			const val = this.getValue(itemName);
			const itemCount = parseInt(item.children[1].textContent.replaceAll(',', ""));
			item.innerHTML += `<td class="text-muted">\u00a3${val === null ? "???" : (val * itemCount).toLocaleString("en-US")}</td>`;
			if (val === null) {
				value = "???";
				break;
			}
			value += val * itemCount;
		}
		return value;
	}
	updateTradeUI(tradeTabs, totalVal) {
		for (let i = 0; i !== 2; ++i) {
			const nameHeader = tradeTabs[i + 1].parentNode.querySelector("h2");
			const templateStart = `<h2 class="row"><div class="col">${nameHeader.textContent}</div><div class="col text-end`
			let styles;
			const templateEnd = `\u00a3${totalVal[i] === "???" ? "???" : totalVal[i].toLocaleString("en-US")}</div></h2>`;

			if (totalVal[0] === "???" || totalVal[1] === "???") {
				styles = ` text-muted">`;
			} else {
				const totalValSum = totalVal[0] + totalVal[1];
				const colorVal = totalValSum === 0 ? 0.5 : totalVal[1 - i] / totalValSum;
				styles = `" style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">`;
			}
			nameHeader.outerHTML = `${templateStart}${styles}${templateEnd}`;
		}
	}
	inAddItems(url) {
		let itemList = document.querySelector("div.container.inventoryWrapper");
		if (itemList === null) return;

		const buttonNode = itemList.parentNode.querySelector("div.contentColumn input.btn");
		const buttonHTML = buttonNode.outerHTML;

		const totalContainer = document.createElement("div");
		totalContainer.classList.add("card-body", "mb-4");
		totalContainer.innerHTML = `<p class="card-text">Total item value: <span id="totalValue" class="fw-bold">\u00a30</span>.${buttonHTML}</p>`;
		buttonNode.remove();
		itemList.parentNode.appendChild(totalContainer);

		const totalText = itemList.parentNode.querySelector("span#totalValue");
		const totalVals = {};

		const items = itemList.querySelectorAll('div.inventoryItemWrapper');
		for (const item of items) {
			if (item.children.length < 2) continue;

			const itemName = item.children[1].textContent.split(' ').slice(0, -1).join(' ');
			const currentBest = this.getValue(itemName);

			const value = document.createElement("span");
			value.classList.add("itemValue", "text-muted", "float-end");
			value.innerText = `(\u00a3${currentBest === null ? "???" : currentBest.toLocaleString("en-US")})`;
			item.children[1].appendChild(value);

			const input = item.querySelector("input.form-control");
			input.addEventListener("input", e => {
				const value = e.target.parentNode.parentNode.querySelector("span.itemValue");
				const currentBest = this.getValue(itemName);
				const inputVal = e.target.value;
				let totalValue = 0;

				if (inputVal === "" || inputVal.trim()[0] === '-' || parseInt(inputVal) === 0) {
					this.resetInputDisplay(value, currentBest, totalVals);
				} else {
					const count = parseInt(inputVal);
					this.updateInputDisplay(value, currentBest, totalVals, count);
				}
				for (const val in totalVals)
						totalValue += val * totalVals[val];
				totalText.innerText = `\u00a3${totalValue.toLocaleString("en-US")}`;
			});
		}
	}
	resetInputDisplay(valueElem, currentBest, totalVals) {
		valueElem.classList.remove("fw-bold");
		valueElem.classList.add("text-muted");
		valueElem.style.color = null;
		valueElem.innerText = `(\u00a3${currentBest === null ? "???" : currentBest.toLocaleString("en-US")})`;
		if (currentBest === null) return;

		totalVals[currentBest] = 0;
	}
	updateInputDisplay(valueElem, currentBest, totalVals, count) {
		valueElem.classList.remove("text-muted");
		valueElem.classList.add("fw-bold");
		valueElem.style.color = this.bestColor;
		valueElem.innerText = `(\u00a3${currentBest === null ? "???" : (currentBest * count).toLocaleString("en-US")})`;
		if (!currentBest) return;

		totalVals[currentBest] = count;
	}
	inCartelArmory(url) {
		const container = document.querySelector("#mainBackground > div.container > div.row > div.col-12");
		if (!container) {
			console.error("Container not found");
			return; // Exit the function early if the container doesn't exist
		}

		const cards = container.querySelectorAll("div.card.mb-4");
		const itemList = container.querySelectorAll("div.container.inventoryWrapper > div.inventoryItemWrapper");
		let totalVal = 0;
		let haveAll = true;

		for (const item of itemList) {
			if (item.children.length < 2) continue;

			const itemText = item.children[1];
			const itemName = itemText.textContent.split(' ').slice(0, -1).join(' ');
			const countOf = parseInt(itemText.querySelector('span.itemQuantity').textContent);
			const currentBest = this.getValue(itemName);

			const value = document.createElement("span");
			value.classList.add("itemValue", "text-muted", "float-end");
			value.innerText = `(\u00a3${currentBest === null ? "???" : (currentBest * countOf).toLocaleString("en-US")})`;
			itemText.appendChild(value);

			if (currentBest === null) haveAll = false;
			else totalVal += currentBest * countOf;

			this.colorArmoryItems(item, itemName);
		}
		
		const pointVal = this.getValue(this.pointName);
		if (pointVal !== null) {
			const pointsText = cards[cards.length - 2].querySelector("div.header-section > h2");
			const pointsTextSplit = pointsText.innerText.split(' ');
			const points = parseInt(pointsTextSplit[pointsTextSplit.length - 1].replaceAll(',', ""));
			totalVal += points * pointVal;
		}

		let totalValCard = document.createElement("div");
		totalValCard.classList.add("mb-4", "card");
		totalValCard.innerHTML = `<div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Total Armory Value</h2></div></div></div><div class="card-body"><p class="card-text">The value of this armory is ${haveAll ? "" : "at least "}<span class="fw-bold">\u00a3${totalVal.toLocaleString("en-US")}</span>.</p></div>`;
		container.insertBefore(totalValCard, cards[cards.length - 2]);
	}
	colorArmoryItems(item, itemName) {
		if (this.alwaysColorNames.includes(itemName)) {
			item.children[1].style.color = this.bestColor;
			return;
		}
		if (itemName in this.poundPerEnergy) {
			if (this.poundPerEnergy[itemName] === this.minPpe)
				item.children[1].style.color = this.bestColor;
			return;
		}
		if (itemName in this.poundPerHospitalTime)
			if (this.poundPerHospitalTime[itemName] === this.minPpht)
				item.children[1].style.color = this.bestColor;
	}
	inEvents(url) {
		const urlParams = new URLSearchParams(window.location.search);
		const category = urlParams.get("filter");
		if (!["All", "Production", "Jobs", "Casino", "Item Sending", "Expedition", "", null].includes(category))
			return;

		const eventList = document.querySelectorAll("div.container.eventWrapper > div.eventItemWrapper");

		let profit = [];
		let maxProfit = 0;
		let minProfit = Infinity;

		for (const ev of eventList) {
			const eventType = ev.children[0].textContent;
			const eventDescription = ev.children[1].textContent;
			const eventSplit = eventDescription.split(' ');

			if (eventType === "Casino") {
				const spinProfit = this.handleCasinoEvents(ev);

				if (spinProfit !== null) {
					profit.push(spinProfit);
					maxProfit = Math.max(maxProfit, spinProfit);
					minProfit = Math.min(minProfit, spinProfit);
				} else {
					profit.push('???');
				}
				continue;
			} else if (eventType === "Item Sending") {
				const itemSendingProfit = this.handleItemSendingEvents(eventDescription);

				profit.push(itemSendingProfit || '???');
				continue;
			}

			if (!["Production", "Jobs", "Expedition"].includes(eventType) || eventSplit[0] === "Prestiged" || eventSplit[0] === "More" || eventSplit[1] === "were" || eventSplit[1] === "failed" || eventSplit[2] === "failed") {
				profit.push("---");
				continue;
			}
			let haveAll = true;
			let totalVal = 0;
			let countOf = 0;

			totalVal += this.getMoneyFromEvent(eventDescription) || 0;
			const itemVal = this.getItemValFromEvent(eventDescription);

			if (itemVal !== null) {
				totalVal += itemVal;
			} else haveAll = false;

			profit.push(haveAll ? totalVal : "???");
			if (haveAll) {
				maxProfit = Math.max(maxProfit, totalVal);
				minProfit = Math.min(minProfit, totalVal);
			}
		}

		const header = eventList[0].previousSibling;
		this.adjustEventHeader(header);


		this.updateEventUI(eventList, profit, minProfit, maxProfit, category);
	}
	handleCasinoEvents(evt) {
		const evtDesc = evt.children[1].textContent;

		const rewardRegex = new RegExp('(?:won )(?<reward>.*)(?:\.$)', 'g');
		const reward = rewardRegex.exec(evtDesc).groups?.reward || '';

		const spinProfit = this.spinnerValues.get(reward) || null;

		return spinProfit;
	}
	handleItemSendingEvents(eventDescription) {
		// NAME sent you x<amount> <item>('s. Message - ...)
		// Only handles received items
		const itemRegex = new RegExp(/^\w+ sent you x(?<amount>\d+) (?<item>[^'.]+)/, 'g');
		const regexResult = itemRegex.exec(eventDescription);
		const itemName = regexResult?.groups?.item;
		const countOf = regexResult?.groups?.amount || 0;

		return itemName ? this.getValue(itemName) * parseInt(countOf): null;
	}
	getMoneyFromEvent(eventDescription) {
		const moneyRegex = new RegExp(/\u00a3\d+(,\d+)*/, 'g');
		const moneyRegexResult = moneyRegex.exec(eventDescription);

		if (!moneyRegexResult?.[0]) return null
		return parseInt(moneyRegexResult?.[0].slice(1).replaceAll(',', ""));
	}
	getItemValFromEvent(eventDescription) {
		const items = this.getItemsFromEvent(eventDescription);
		let totalValue = 0;
		for (const [item, amount] of items) {
			const itemValue = this.getValue(item);
			if (itemValue === null) return itemValue;

			totalValue += amount * itemValue;
		}
		return totalValue;
	}
	getItemsFromEvent(eventDescription) {
		const allItems = Object.keys(this.defaultVals);
		const foundItems = [];

		const amountRegex = new RegExp(/(?<amount>\d+)x? $/, 'g');

		for (const item of allItems) {
			const itemPosition = eventDescription.indexOf(item);
			if (itemPosition === -1) continue;

			const searchSpace = eventDescription.slice(0, itemPosition);
			
			const amtRegexRes = amountRegex.exec(searchSpace);
			const amountCandidate = amtRegexRes?.groups?.amount;
			if (amountCandidate === undefined) continue;

			foundItems.push([item, parseInt(amountCandidate)]);
		}
		return foundItems;
	}
	adjustEventHeader(header) {
		// Adjust width of log to fit the new column
		header.children[0].classList = "col-2 col-lg-2 col-md-3 col-sm-2";
		header.children[1].classList = "col-5 col-lg-6 col-md-6 col-sm-7";
		header.children[2].classList = "col-3 col-lg-2 d-none d-lg-inline";

		// Add new header element for value
		let valueHeader = document.createElement("div");
		valueHeader.classList = "col-2 col-lg-2 d-none d-lg-inline";
		valueHeader.textContent = 'Value'
		header.insertBefore(valueHeader, header.children[2]);
	}
	updateEventUI(eventList, profit, minProfit, maxProfit, category) {
		for (let i = 0; i < eventList.length; i++) {
			const ev = eventList[i];
			ev.children[0].classList.value = "col-2 col-lg-2 col-md-3 col-sm-2"; //"col-2 col-lg-2 col-md-2 col-sm-2";
			ev.children[1].classList.value = "col-5 col-lg-6 col-md-6 col-sm-7"; //"col-6 col-lg-7 col-md-6 col-sm-7";
			ev.children[2].classList.value = "col-3 col-lg-2 d-none d-lg-inline"; //"col-3 col-lg-2 col-md-3 col-sm-2";
			let valueCol = document.createElement("div");
			let mergedCol = document.createElement("div");
			valueCol.classList.value = "col-2 col-lg-2 d-none d-lg-inline"; //"col-1 col-lg-1 col-md-1 col-sm-1";
			mergedCol.classList.value = "col-3 col-md-3 col-sm-3 d-lg-none"; // new

			const prof = profit[i];
			if (prof === "---") {
				mergedCol.innerHTML = ev.children[2].innerHTML;
				ev.insertBefore(valueCol, ev.children[2]);
				ev.appendChild(mergedCol);
				continue;
			}
			if (prof === "???")
				valueCol.innerHTML = `<span class="text-muted">\u00a3???</span>`;
			else if (["Production", "Jobs", "Casino", "Expedition"].includes(category)) {
				const colorVal = (prof - minProfit) / (maxProfit - minProfit);
				valueCol.innerHTML = `<span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">\u00a3${prof.toLocaleString("en-US")}</span>`;
			}
			else
				valueCol.innerHTML = `<span class="text-muted">\u00a3${prof.toLocaleString("en-US")}</span>`;

			mergedCol.innerHTML = `${ev.children[2].innerHTML}<br>${valueCol.innerHTML}`;
			ev.insertBefore(valueCol, ev.children[2]);
			ev.appendChild(mergedCol);
		}
	}
	inProduction() {
		// Get all production containers
		const containers = document.querySelectorAll("div.row.g-0.align-items-center.h-100.flex-column");
		if (containers.length === 0) {
			console.warn("No production containers found!");
			return;
		}

		console.debug("Found", containers.length, "production containers.");

		const cokeVal = this.getValue("Cocaine");
		const assigned = [];
		const profit = [];
		let maxProfit = -Infinity;
		let minProfit = Infinity;
		for (let i = 0; i !== containers.length; ++i) {
			profit[i] = calcProfit.call(this, i, containers[i]);
			if (profit[i] === null) continue;
			maxProfit = Math.max(maxProfit, profit[i]);
			minProfit = Math.min(minProfit, profit[i]);
		}

		for (let i = 0; i !== containers.length; ++i) {
			const container = containers[i];
			const expectedProfit = document.createElement("p");
			expectedProfit.classList.add("card-text", "text-center");
			if (profit[i] !== null) {
				const colorVal = (profit[i] - minProfit) / (maxProfit - minProfit);
				expectedProfit.innerHTML = `Profit: <span class="fw-bold" style="color: hsl(${profit[i] >= 0 ? colorVal * 120 : 0}, 67%, ${this.brightness}%)">\u00a3${Math.floor(profit[i]).toLocaleString("en-US")}/narco</span>`;
			}
			else
				expectedProfit.innerHTML = `Profit: <span class="text-muted">\u00a3???/narco</span>`;
			container.insertBefore(expectedProfit, container.querySelectorAll("hr")[1]);

			let narcoInput = containers[i].querySelector("input.assignNarcoInput");
			assigned[i] = parseInt(narcoInput.value.replaceAll(',', ""));
			narcoInput.id = `inputNum${i}`;
			narcoInput.addEventListener("input", assignedNarcosChange.bind(this));
		}

		// Calculate Expected Daily Profit
		const prodHeader = document.querySelector("#mainBackground > div > div > div.col-12 > div.productionsContainer.rounded > div.row.mb-0");
		const dailyProfit = calcDailyProfit(profit, assigned, containers);

		const flexContainer = constructProdHeader.call(this, dailyProfit, cokeVal);

		// Insert the flex container at the top of the target section
		prodHeader.parentNode.insertBefore(flexContainer, prodHeader);

		for (let i = 2; i < containers.length; i++) { // Start from index 2 to skip the first two
			const container = containers[i];

			// Get the "Narcos Assigned" input field
			const narcoInput = container.querySelector("input.assignNarcoInput");
			if (!narcoInput) {
				console.warn(`No narco input found for container ${i}`);
				continue;
			}

			// Get production ID if needed
			const productionIdElement = container.querySelector(".productionId");
			const productionId = productionIdElement ? productionIdElement.innerText.trim() : "Unknown";

			// Get supply items
			const requiredElement = container.querySelector("p.card-text.text-center.mb-0");
			const ownedElement = container.querySelector("p.card-text.text-center.fst-italic");

			const requiredText = requiredElement ? requiredElement.innerText.replace(/\D/g, "") : "N/A"; // Extract numbers only
			const ownedText = ownedElement ? ownedElement.innerText.replace(/\D/g, "") : "N/A"; // Extract numbers only

			const required = parseInt(requiredText);
			const owned = parseInt(ownedText);

			// Log extracted values
			console.info(`Production ID: ${productionId}`);
			console.info(`Required: ${requiredText}`);
			console.info(`Owned: ${ownedText}`);
			console.info(`Assigned Narcos: ${narcoInput.value}`);

			// Calculate days left
			const daysLeftElement = document.createElement("p");
			daysLeftElement.classList.add("card-text", "text-center");

			if (!isNaN(required) && !isNaN(owned) && required > 0) {
				const daysLeft = Math.floor(owned / required);

				const colorClass = "text-success";
				if (daysLeft <= 3) colorClass = "text-danger";
				else if (daysLeft <= 10) colorClass = "text-warning";

				daysLeftElement.innerHTML = `Days Left: <span class="fw-bold ${colorClass}">${daysLeft}</span>`;
			} else {
				daysLeftElement.innerHTML = `Days Left: <span class="fw-bold text-muted">N/A</span>`;
			}

			// Append days left under supply items
			if (requiredElement) {
				requiredElement.parentElement.insertBefore(daysLeftElement, requiredElement.nextSibling);
			}
		}

		function getPrestigeLevels(prestigeTable) {
			const prestigeLevels = { productionBoost: 0, efficiency: 0, premiumProduction: 0 };
			if (!prestigeTable) return prestigeLevels;

			for (const tr of prestigeTable.querySelectorAll('tr')) {
				switch (tr.querySelector('td').textContent) {
					case 'Production Boost':
						prestigeLevels.productionBoost = parseInt(tr.querySelector('th')?.textContent.charAt(0) || '0');
						break;
					case 'Efficiency':
						prestigeLevels.efficiency = parseInt(tr.querySelector('th')?.textContent.charAt(0) || '0');
						break;
					case 'Premium Production':
						prestigeLevels.premiumProduction = parseInt(tr.querySelector('th')?.textContent.charAt(0) || '0');
						break;
					default:
						break;
				}
			}
			return prestigeLevels;
		}

		function calcProfit(id, container) {
			const narcoInput = container.querySelector("input.assignNarcoInput");
			assigned[id] = parseInt(narcoInput.value.replaceAll(',', ""));
			if (assigned[id] === 0) return 0;

			const prestigeTable = container.querySelector('div.table-responsive.production-table.mt-1');
			const prestigeLevels = getPrestigeLevels(prestigeTable);

			// Each level of 'Production Boost' prestige increases profit by 20%
			const profitBoost = 1 + prestigeLevels.productionBoost * 0.2;

			let profit = this.prodMoney[id] * profitBoost;
			const itemProfit = calcItemProfits.call(this, id) * profitBoost;
			if (itemProfit === null) return null;

			profit += itemProfit;

			let prodCount = getProdCount(container);

			profit *= calcProfitScalar.call(this, id, prodCount);

			// Each level of 'Efficiency' prestige reduces required supply by 10%
			const efficiency = 1 - prestigeLevels.efficiency * 0.1;

			const supplyCost = calcSupplyCost.call(this, id, prodCount, container) * efficiency;
			if (supplyCost === null) return null;

			profit -= supplyCost;

			profit *= this.prodProfitFactor;
			if (id === 0) profit *= this.streetProfitFactor;
			profit /= this.narcoCounts[id] * (id === 4 ? prodCount : 1); // Also dealing with coke custom scaling
			return profit;
		}

		function getProdCount(container) {
			const prodCountText = container.querySelectorAll("tbody tr.align-middle th");
			if (prodCountText.length === 0) return 1;
			return parseInt(prodCountText[1].innerText) || 1;
		}

		function calcProfitScalar(id, prodCount) {
			if (id === 4)
				return this.prodCokeScaling[prodCount - 1]; // Coke has custom scaling
			else
				return Math.pow(1 - this.prodDepreciation / 100, prodCount - 1); // Maybe should instead be *= (1 - prodCount * this.prodDepreciation / 100)
		}

		function calcItemProfits(id) {
			let itemProfit = 0;
			for (const itemName of Object.keys(this.itemCounts[id])) {
				const itemVal = this.getValue(itemName);
				if (itemVal === null) return null;
				itemProfit += itemVal * this.itemCounts[id][itemName];
			}
			return itemProfit;
		}

		function calcSupplyCost(id, prodCount, container) {
			const prodReqsText = container.querySelector("p.card-text.text-center.mb-0");
			const prodReqs = prodReqsText.innerText.split(' ').filter(w => w.startsWith('x'));
			let supplyCost = 0;
			let j = 0;
			for (let itemName of Object.keys(this.prodReqs[id])) {
				const itemVal = this.getValue(itemName);
				if (itemVal === null) return null;
				supplyCost += itemVal * parseInt(prodReqs[j].slice(1).replaceAll(',', "")) / (id === 4 ? 1 : prodCount);
				++j;
			}
			return supplyCost;
		}

		function assignedNarcosChange(e) {
			assigned[parseInt(e.target.id.slice(8))] = parseInt(e.target.value.replaceAll(',', ""));
			const dailyProfitText = document.querySelector("span#dailyProfit");
			const dailyProfitCokeText = document.querySelector("span#dailyProfitMinusCoke");
			const dailyProfit = calcDailyProfit(profit, assigned, containers);

			dailyProfitText.innerText = `\u00a3${dailyProfit === null ? "???" : Math.round(dailyProfit).toLocaleString("en-US")}`;
			if (dailyProfit === null) return;

			adjustColors(dailyProfitText, dailyProfit);

			const dailyProfitCoke = dailyProfit - this.maxCokeDaily * cokeVal;
			dailyProfitCokeText.innerText = `\u00a3${cokeVal === null ? "???" : Math.round(dailyProfitCoke).toLocaleString("en-US")}`;
			if (cokeVal === null) return;

			adjustColors(dailyProfitCokeText, dailyProfitCoke);
		}

		function calcDailyProfit(profit, assigned, containers) {
			let dailyProfit = 0;
			for (var j = 0; j !== containers.length; ++j) {
				if (profit[j] === null && assigned[j]) return null;

				dailyProfit += profit[j] * assigned[j];
			}
			return dailyProfit;
		}


		function adjustColors(elem, value) {
			elem.classList.remove("text-danger", "text-warning", "text-success");
			const className = value > 0 ? "text-success" : value < 0 ? "text-danger" : "text-warning";
			elem.classList.add(className);
		}

		function constructProdHeader(dailyProfit, cokeVal) {
			// Create Expected Daily Profit card
			const expectedProfit = document.createElement("div");
			expectedProfit.classList.add("mb-4", "card");
			expectedProfit.innerHTML = `<div class="header-section"><h2>Expected Daily Profit</h2></div><div class="card-body"><p class="card-text text-center">Each day your narcos will produce roughly <span id="dailyProfit" class="fw-bold ${dailyProfit === null ? "text-muted" : dailyProfit > 0 ? "text-success" : dailyProfit < 0 ? "text-danger" : "text-warning"}">\u00a3${dailyProfit === null ? "???" : Math.round(dailyProfit).toLocaleString("en-US")}</span> in profit.<br>If you take ${this.maxCokeDaily} cocaine daily, your net profit is <span id="dailyProfitMinusCoke" class="fw-bold ${cokeVal === null || dailyProfit === null ? "text-muted" : dailyProfit - this.maxCokeDaily * cokeVal > 0 ? "text-success" : dailyProfit - this.maxCokeDaily * cokeVal < 0 ? "text-danger" : "text-warning"}">\u00a3${cokeVal === null || dailyProfit === null ? "???" : Math.round(dailyProfit - this.maxCokeDaily * cokeVal).toLocaleString("en-US")}</span> per day.</p></div>`;

			// Create Buy Production card
			const linkCard = document.createElement("div");
			linkCard.classList.add("mb-4", "card");
			linkCard.innerHTML = `<div class="header-section"><h2>Buy Production</h2></div><div class="card-body"><p class="card-text">Go to the <a class="text-white" href="/market?p=Production">Item Market</a> to buy production.</p><p></p></div>`;

			// Create a flex container to hold both cards
			const flexContainer = document.createElement("div");
			flexContainer.classList.add("d-flex", "align-items-stretch", "mb-4");
			flexContainer.style.justifyContent = "space-between";

			// Wrap each card with a flex item that can grow
			const leftFlexItem = document.createElement("div");
			leftFlexItem.classList.add("flex-grow-1", "me-2");
			leftFlexItem.appendChild(linkCard);

			const rightFlexItem = document.createElement("div");
			rightFlexItem.classList.add("flex-grow-1", "ms-2");
			rightFlexItem.appendChild(expectedProfit);

			// Add both flex items to the container
			flexContainer.appendChild(leftFlexItem);
			flexContainer.appendChild(rightFlexItem);
			return flexContainer;
		}
	}

	inJobs(url) {
		const jobPanels = document.querySelectorAll("div.equipmentModule div.flex-column");
		const buttons = document.querySelectorAll("div.equipmentModule form > .btn.w-100:not(#upgradeTimeButton):not(#upgradeRewardButton)");
		if (jobPanels === null || buttons.length <= 1) return;

		this.jobTimes = [];
		this.maxJobRep = 0;
		this.minJobRep = Infinity;
		this.jobValue = [];
		this.maxJobValue = 0;
		this.minJobValue = Infinity;
		for (let i = 0; i !== this.jobMoney.length; ++i) {
			const jobPanel = jobPanels[i];
			this.setJobTime(jobPanel);

			this.jobValue[i] = this.jobMoney[i];
			this.setJobBaseItemReward();

			if (this.jobValue[i] !== "???") this.setJobPrestigeReward(jobPanel);

			const standardJobRepBonus = GM_getValue('perk_Standard Job Rep');
			// Apply only to standard jobs
			if (i <= 4) this.jobRep[i] * (1 + (standardJobRepBonus / 100));

			this.maxJobRep = Math.max(this.maxJobRep, this.jobRep[i] / this.jobTimes[i]);
			this.minJobRep = Math.min(this.minJobRep, this.jobRep[i] / this.jobTimes[i]);
		}
		this.updateJobUI(jobPanels);
	}
	updateJobUI(jobPanels) {
		for (let i = 0; i !== this.jobValue.length; ++i) {
			const jobPanel = jobPanels[i];
			let append = `<hr class="mt-4 w-75"><p class="text-center">`;
			const gain = this.jobValue[i];
			const repPerTime = this.jobRep[i] / this.jobTimes[i];
			append += gain === "???"
				? `Expected gain: <span class="text-muted">\u00a3???/h</span>`
				: `Expected gain: <span class="fw-bold" style="color: hsl(${(gain - this.minJobValue) / (this.maxJobValue - this.minJobValue) * 120}, 67%, ${this.brightness}%)">\u00a3${Math.round(gain * 60).toLocaleString("en-US")}/h</span>`;
			append += `<br>Expected rep: <span class="fw-bold" style="color: hsl(${(repPerTime - this.minJobRep) / (this.maxJobRep - this.minJobRep) * 120}, 67%, ${this.brightness}%)">${(repPerTime * 60).toLocaleString("en-US")}/h</span>`;
			append += "</p>";
			jobPanel.innerHTML += append;
		}
	}
	setJobTime(jobPanel) {
		const jobTime = jobPanel.querySelector("p.card-text.fw-bold.text-muted");
		const jobTimeSplit = jobTime.textContent.split(' ');
		this.jobTimes[i] = parseFloat(jobTimeSplit[0].slice(1));
		if (jobTimeSplit[1].startsWith("hour")) {
			this.jobTimes[i] *= 60;
			if (jobTimeSplit.length > 2)
				this.jobTimes[i] += parseFloat(jobTimeSplit[2]);
		}
	}
	setJobBaseItemReward() {
		for (const item in this.jobItems[i]) {
			const price = this.getValue(item);
			if (price !== null)
				this.jobValue[i] += price * this.jobItems[i][item];
			else {
				this.jobValue[i] = "???";
				break;
			}
		}
	}
	setJobPrestigeReward(jobPanel) {
		const prestigeText = jobPanel.querySelector("p.prestigeText");
		const incrReward = prestigeText !== null && /\+\d+%/.test(prestigeText.innerText) ? parseInt(prestigeText.innerText.match(/\+\d+%/)[0].slice(1, -1)) : 0;
		this.jobValue[i] *= 1 + incrReward / 100;
		this.jobRep[i] *= 1 + incrReward / 100;

		this.jobValue[i] *= this.jobProfitFactor;
		this.jobValue[i] /= this.jobTimes[i];
		this.maxJobValue = Math.max(this.maxJobValue, this.jobValue[i]);
		this.minJobValue = Math.min(this.minJobValue, this.jobValue[i]);
	}
	inInventory(url) {
		const itemList = document.querySelector("div.container.inventoryWrapper.pt-2");
		const header = itemList.querySelector("div.row.row-cols-3.row-header");
		const items = itemList.querySelectorAll('div.inventoryItemWrapper');
		let totalVal = 0;
		let haveAll = true;

		for (const item of items) {
			if (item.children.length < 7) continue;
			
			const nameElem =  item.querySelector('div.inventoryItemWrapper > div:nth-of-type(2)');
			const itemName = nameElem.children[0].childNodes[0].textContent.slice(0, -1);

			if (this.alwaysColorNames.includes(itemName))
				item.children[1].style.color = this.bestColor;

			const countElem = nameElem.querySelector('span.itemQuantity');
			const countOf = parseInt(countElem.textContent);
			const currentBest = this.getValue(itemName);
			if (currentBest === null) {
				totalVal += parseInt(item.children[3].innerText.slice(1).replaceAll(',', "")) * countOf;
				haveAll = false;
				continue;
			}

			let val = null;
			let colorVal = null;
			let append = null;
			if (itemName in this.poundPerEnergy) {
				val = this.poundPerEnergy[itemName];
				colorVal = (1 - (val - this.minPpe) / (this.maxPpe - this.minPpe)) * 120;
				append = 'E';
				if (val === this.minPpe)
					item.children[1].style.color = this.bestColor;
			} else if (itemName in this.poundPerHospitalTime) {
				val = this.poundPerHospitalTime[itemName];
				colorVal = (1 - (val - this.minPpht) / (this.maxPpht - this.minPpht)) * 120;
				append = "min";
				if (val === this.minPpht)
					item.children[1].style.color = this.bestColor;
			}

			const valueTexts = [item.children[3], item.children[6].querySelectorAll("div.card-text > div.card-text")[2]];
			for (var valueText of valueTexts) {
				valueText.innerHTML = this.strikethrough ? `<del>${valueText.innerText}</del><br><span class="fw-bold">` : "<span>";
				valueText.innerHTML += `\u00a3${currentBest.toLocaleString("en-US")}</span>`;
				if (val !== null)
					valueText.innerHTML += ` <span style="color: hsl(${colorVal}, 67%, ${this.brightness}%)">(\u00a3${Math.round(val).toLocaleString("en-US")}/${append})</span>`;
			}
			totalVal += currentBest * countOf;
		}

		const totalValCard = document.createElement("div");
		totalValCard.classList.add("card-body", "mb-2");
		totalValCard.innerHTML = `<p class="card-text">The value of these items is ${haveAll ? "" : "roughly "}<span class="fw-bold">\u00a3${totalVal.toLocaleString("en-US")}</span>.</p>`;
		itemList.insertBefore(totalValCard, header);
	}
	inGym(url) {
		this.updateCokeDisplay();
	}
	inUniversity(url) {
		this.updateCokeDisplay();
	}
	updateCokeDisplay() {
		const item = document.getElementById(`item-${GM_getValue("itemID_Cocaine")}`);
		if (item === null) return;

		const val = this.poundPerEnergy["Cocaine"];
		const colorVal = (1 - (val - this.minPpe) / (this.maxPpe - this.minPpe)) * 120;
		const valueTexts = [item.children[3], item.children[5].querySelectorAll("div.card-text > div.card-text")[2]];
		for (var valueText of valueTexts)
			if (valueText !== undefined && valueText !== null)
				valueText.innerHTML = `<span>${valueText.innerText}</span> <span style="color: hsl(${colorVal}, 67%, ${this.brightness}%)">(\u00a3${Math.round(val).toLocaleString("en-US")}/E)</span>`;
	}
}
