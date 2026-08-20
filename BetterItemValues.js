class BetterItemValues {

	static metadata = {
		displayName: 'Better Itemvalues',
		description: 'Use the player market value for item value',
		settings: {
			active: {
				inGym: {
					description: 'Update the coke item button from the Add Item Buttons module'
				},
				inUniversity: {
					description: 'Update the coke item button from the Add Item Buttons module'
				},
				inMarket: {
					description: 'Set the item values for this module and use these prices for the default input value'
				},
				inSupporter: {
					description: 'Display the energy refill price'
				},
				inEstateAgent: {
					description: 'Display the material- and total cost of the properties'
				},
				inPharmacy: {
					description: 'Display the market value next to the store value for each item'
				},
				inTownStore: {
					description: 'Display the market value next to the store value for each item'
				},
				inPetStore: {
					description: 'Display the market value next to the store value for each item'
				},
				inTradeView: {
					description: 'Automatically calculate accurate total value for each player'
				},
				inAddItems: {
					description: 'Display the total value of the selected items'
				},
				inCartelArmory: {
					description: 'Display the market value of each item'
				},
				inEvents: {
					description: 'Display the total value of each event log (if applicable)'
				},
				inProduction: {
					description: 'Calculate the total daily profits'
				},
				inJobs: {
					description: 'Calculate the hourly rep- and money profits for each job'
				},
				inInventory: {
					description: 'Display the market value of each item'
				}
			},
			custom: {
				strikethrough: {
					displayName: 'Strikethrough',
					description: 'Whether or not to display and strike through the original value of items',
					type: SettingType.TOGGLE,
					defaultValue: false
				},
				always_color_names: {
					displayName: 'Always Color Names',
					description: 'Whether or not to display and strike through the original value of items',
					type: SettingType.LIST,
					defaultValue:  [ 'FN SCAR-H', 'Desert Eagle', 'Full-Body Armour' ],
					extra: {
						availableElements: ITEMS,
						unique: true
					}
				}
			}
		}
	}


	// Container for the best point price in market
	pointCurrentBest;
	// Container for the best item price in market
	priceCurrentBest;

	constructor() {
		const configManager = ConfigManager.getInstance();
		
		this.brightness = configManager.darkmode ? 50 : 45;
		this.bestColor = `hsl(60, 100%, ${configManager.darkmode ? 70 : 40}%)`;
		this.strikethrough = configManager.getCustomSetting(this, 'strikethrough') || false;
		this.alwaysColorNames = configManager.getCustomSetting(this, 'always_color_names') || [];

		this.pointName = "Supporter Points";

		this.defaultVals = {
			// Primary Weapons
			'AK-47': 5_000,
			'MG34': 200_000,
			'G36': 375_000,
			'L86 LSW': 1_000_000,
			'Steyr AUG': 2_250_000,
			'SIG SG 550': 3_750_000,
			'MG5': 4_500_000,
			'FN SCAR-H': 6_250_000, 
			'Bazooka': 12_500_000,

			// Secondary Weapons
			'Baseball Bat': 125,
			'Walther P38': 1_000,
			'M16A2 Rifle': 6_250,
			'M1911': 6_250,
			'S&W Magnum Revolver': 50_000,
			'Glock 18': 250_000,
			'Desert Eagle': 12_000_000, // TODO: Update this price

			// Thrown
			'Illuminating Grenade': 3_750,
			'Tear Gas Grenade': 3_750,
			'Stun Grenade': 3_750,
			'Flash Bang Grenade': 3_750,
			'Fragmentation Grenade': 7_500,

			// Armour
			'Trench Coat': 2_000,
			'Covert Stab Vest': 2_500,
			'Ballistic Vest': 5_000,
			'Kevlar Weave Vest': 12_500,
			'Carbon Fiber Vest': 20_000,
			'Armoured Suit': 25_000,
			'Ceramic Plate Carrier Vest': 50_000,
			'Riot Suit': 250_000,
			'Tactical Plate Armour': 375_000,
			'Blast Suit': 500_000,
			'New-Age Combat Fatigues': 750_000,
			'Full-Body Armour': 2_500_000,

			// Special
			'Green Surprise Gift': 0,
			'Velvet Mystery Gift': 0,
			'Rustic Charm Gift': 0,
			'Golden Treasure Gift': 0,
			'Mini-Supporter Pack': 0,
			'Personal Favour': 325_000,
			'Supporter Pack': 4_750_000,

			// Alcohol
			'Corana Beer': 55_000,
			'Mexcal Beer': 105_000,
			'Blancoda Tequila': 280_000,
			'Repose Tequila': 530_000,
			'Anejo Tequila': 830_000,
			'Raicilla': 1_100_000,

			// Medical
			'Bandage': 2_500,
			'Small Medical Kit': 5_000,
			'Tainted Cannabis': 9_000,
			'Large Medical Kit': 10_000,
			'Tainted Cocaine': 13_500,
			'Basic Trauma Kit': 15_000,
			'Large Trauma Kit': 25_000,

			// Drugs
			'Glittering Gift': 0,
			'Cannabis': 5_000,
			'Cocaine': 140_000,

			// Production
			'Bag of Fertiliser': 1_000,
			'Agave Heart': 2_500,
			'Coca Paste': 4_500,

			// Construction
			'Nails': 3_000,
			'Bricks': 11_250,
			'Concrete Bags': 17_250,
			'Steel': 37_500,

			// Food
			'Dog Food': 5_000,
			'Black Market Treat': 50_000,

			// Collectible
			'El Chapo\'s Head': 0,
			'Pablo\'s Hat': 0,
			'Quecheu Troll Doll': 0,
			'The Easter Fuggly': 0,
			'Elf on a Shelf - Green': 0,
			'Elf on a Shelf - Red': 0,
			'Padrino\'s Egg': 0,
			'The Crimson Star': 0,
			'La Cara Roja Mask': 0,

			// Luxury
			'Diablo Tattoo': 1_750,
			'Italian Shoes': 2_000,
			'Cuban Cigar Set': 3_750,
			'Eagle Cabernet': 4_750,
			'Whiskey Decanter': 12_500,
			'Gold Grooming Kit': 17_500,
			'Gemstone Cufflinks': 22_500,
			'Lapis-Encrusted Lighter': 37_500,
			'Satellite Phone': 75_000,
			'Club VIP Lounge Membership': 125_000,
			'Pearl-Encrusted Lighter': 150_000,
			'Diamond Watch': 225_000,
			'Diamond-Encrusted Lighter': 350_000,
			'Bulletproof Suit': 425_000,
			'Pet Jaguar': 625_000,
			'Gold-Plated Pistol': 675_000,
			'Platinum Credit Card': 1_375_000,
			'Personal Helicopter': 1_600_000,

			// Cars
			'Renault Espace': 1_500,
			'Fiat Panda': 2_250,
			'Austin Metro': 3_250,
			'Peugeot 205 GTI': 4_500,
			'Ford Sierra': 10_000,
			'Vauxhall Cavalier': 15_000,
			'Ford Escord': 23_500,
			'Honda CRX': 32_500,
			'Saab 900 Turbo': 85_000,
			'Lancia Delta Integrale': 137_000,
			'Toyota MR2': 187_500,
			'Audi Quattro': 0, // TODO: Get market value
			'Ford Capri 2.8i': 325_000,
			'Volkswagen Golf GTI': 425_000,
			'BMW M5': 500_000,
			'Porsche 959': 625_000,
			'Ferrari F40': 1_075_000,
			'Lamborghini Countach': 1_500_000,

			// Enhancement
			'Street-Quality Enhancement': 10_000,
			'Syndicate-Issued Enhancement': 200_000,
			'Blacksite Prototype Enhancement': 500_000,

			// Smuggling Enhancement
			'Weapons & Armor Specialist Contact': 0,
			'Alcohol Specialist Contact': 0,
			'Tech Specialist Contact': 0,
			'Leadership Specialist Contact': 0,
		}; // Players should go to the market to load up-to-date values, these are presets probably over half a year old

		const values = GM_listValues().filter(name => name.startsWith('value_')); // Prefill values first use
		if (values.length === 0) {
			for (const name in this.defaultVals)
				this.setItemValue(name, this.defaultVals[name]);
		}

		this.maxCokeDaily = 8;
		this.cokeODChance = 1; // percent
		this.taintedChance = [10, 20]; // percent
		this.energyItems = {
			'Corana Beer': 5,
			'Mexcal Beer': 10,
			'Blancoda Tequila': 15,
			'Repose Tequila': 20,
			'Anejo Tequila': 25,
			"Raicilla": 30,
			"Cocaine": 50 * (1 - this.cokeODChance / 100),
			'Glittering Gift': 100
		};
		this.hospitalItems = {
			Bandage: 10,
			'Small Medical Kit': 15,
			'Large Medical Kit': 60,
			'Basic Trauma Kit': 80,
			'Large Trauma Kit': 120
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
				"Bandage": this.doctorsOfficePerProd * 50 / 100,
				"Small Medical Kit": this.doctorsOfficePerProd * 30 / 100,
				"Large Medical Kit": this.doctorsOfficePerProd * 12.5 / 100,
				"Basic Trauma Kit": this.doctorsOfficePerProd * 5 / 100,
				"Large Trauma Kit": this.doctorsOfficePerProd * 2.5 / 100
			},
			{
				"Cannabis": this.maxCannabis / 2 * (1 - this.taintedChance[0] / 100),
				"Tainted Cannabis": this.maxCannabis / 2 * this.taintedChance[0] / 100
			},
			{
				"Corana Beer": this.alcoholPerProd * 25.9 / 100,
				"Mexcal Beer": this.alcoholPerProd * 8.5 / 100,
				"Blancoda Tequila": this.alcoholPerProd * 30.3 / 100,
				"Repose Tequila": this.alcoholPerProd * 14.1 / 100,
				"Anejo Tequila": this.alcoholPerProd * 9.5 / 100,
				"Raicilla": this.alcoholPerProd * 3.1 / 100
			},
			{
				"Cocaine": this.maxCoke / 2 * (1 - this.taintedChance[1] / 100),
				"Tainted Cocaine": this.maxCoke / 2 * this.taintedChance[1] / 100
			}
		];
		// Fallback values, since time doesn't show when working
		this.jobTimes = [ 5, 30, 60, 180, 15, 30, 60, 90, 360, 720 ];
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

		const prodProfit = this.getPerk('Production Profit') || 0; // percentage;
		this.prodProfitFactor = 1 + prodProfit / 100;
		const streetProfit = this.getPerk('Street Crime Profit') || 0; // percentage;
		this.streetProfitFactor = 1 + streetProfit / 100;
		const jobProfit = this.getPerk('Job Profits') || 0; // percentage;
		this.jobProfitFactor = 1 + jobProfit / 100;
		const medEffectivenessBoost = this.getPerk('Med Effectiveness') || 0; // percentage;
		this.medEffectivenessFactor = 1 + medEffectivenessBoost / 100;

		this.poundPerEnergy = {};
		this.maxPpe = 0;
		this.minPpe = Infinity;
		this.poundPerHospitalTime = {};
		this.maxPpht = 0;
		this.minPpht = Infinity;

		for (const item in this.energyItems) {
			const price = this.getItemValue(item);
			if (price === null) continue;

			const ppe = price / this.energyItems[item];
			this.poundPerEnergy[item] = ppe;
			this.maxPpe = Math.max(this.maxPpe, ppe);
			this.minPpe = Math.min(this.minPpe, ppe);
		}
		for (const item in this.hospitalItems) {
			const price = this.getItemValue(item);
			if (price === null) continue;

			let time = this.hospitalItems[item];
			time *= this.medEffectivenessFactor;
			const ppht = price / time;
			this.poundPerHospitalTime[item] = ppht;
			this.maxPpht = Math.max(this.maxPpht, ppht);
			this.minPpht = Math.min(this.minPpht, ppht);
		}
		// NOTE: calculate job values inJob since it's only used there and we need prestige levels

		const pointVal = this.getItemValue(this.pointName);
		// To avoid multiplication with null
		const calcPointVal = amount => pointVal !== null ? amount * pointVal : pointVal;

		this.spinnerValues = new Map([
			['nothing', 0],
			['a Free Spin', 0],
			[`${POUND}10,000`, 10_000],
			[`${POUND}50,000`, 50_000],
			[`${POUND}100,000`, 100_000],
			[`${POUND}250,000`, 250_000],
			['a Personal Favour', this.getItemValue('Personal Favor')],
			['5 Points', calcPointVal(5)],
			['25 Points', calcPointVal(25)],
			['50 Points', calcPointVal(50)],
			['a Supporter Pack', this.getItemValue('Supporter Pack')],
			['500 Points', calcPointVal(500)]
		]);

		// Production-related values
		this.assigned = [];
	}
	getPerk(perkName) {
		return getNumericValue('perks', perkName);
	}
	getItemValue(itemName) {
		return getNumericValue('value', itemName);
	}
	setItemValue(itemName, value) {
		setValue('value', itemName, value);
		console.debug(`Set value_${itemName} to ${POUND}${value.toLocaleString("en-US")}`);
		return value;
	}
	inPharmacy(url) {
		this.inTownStore(url);
	}
	inPetshop(url) {
		this.inTownStore(url);
	}
	inMarket(url) {
		const itemSelector = document.querySelector("#itemSelector");
		if (itemSelector === null) return;

		const options = itemSelector.options;
		const pointPriceLabel = document.querySelector("#pricePerPointsLabel");

		let price = this.getItemValue(this.pointName);
		this.pointCurrentBest = this._createPointPriceContainer(price);

		pointPriceLabel.textContent += ' ';
		pointPriceLabel.appendChild(this.pointCurrentBest);

		const pricePerLabel = document.querySelector("#pricePerLabel");

		let itemName = options[0].textContent;
		let currentBest = this.getItemValue(itemName);
		this.priceCurrentBest = this._createItemPriceContainer(itemName, currentBest);

		pricePerLabel.textContent += ' ';
		pricePerLabel.appendChild(this.priceCurrentBest);

		itemSelector.addEventListener("change", e => {
			for (const option of options) {
				if (option.value !== e.target.value) continue;

				itemName = option.textContent.trim().replace(/\s+-\s+\d+(?:\.\d+)?%$/, "");
				price = this.getItemValue(itemName);
				this.priceCurrentBest.value = itemName;
				this.priceCurrentBest.textContent = `(${POUND}${price === null ? "???" : price.toLocaleString("en-US")})`;
				break;
			}
		});

		const container = document.querySelector("nav#itemMarketNav > div.tab-content");

		// Initial run to process any already loaded items
		this._processItems();

		// Start observing for dynamic changes
		this._observeMarketChanges();


		// Handle event card updates (unchanged)
		this._handleItemListing();

	}
	_processItems() {
		const offerListWrappers = document.querySelectorAll("div.offerListWrapper");

		offerListWrappers.forEach(wrapper => {
			const itemCards = wrapper.querySelectorAll("div.col-xl-2.col-md-3.col-sm-4.col-6");

			itemCards.forEach(card => this._handleItemCard(card));
		});
	}
	_observeMarketChanges() {
		const targetNode = document.querySelector("#itemMarketNav"); // Adjust the selector as needed
		if (!targetNode) return;

		observeDOM(targetNode, (mutationsList) => {
			for (const mutation of mutationsList) {
				if (mutation.type !== "childList" || mutation.addedNodes.length <= 0)
					continue;
				console.info("Detected new nodes in market area, re-running item processing...");
				this._processItems(); // Re-run the script to process newly added items
			}
		});
	}
	_handleItemCard(card) {
		const itemName = card.querySelector("h5.card-title")?.textContent.trim();
		if (!itemName) {
			console.warn('No itemname found in ', card);
			return;
		}

		const itemPriceText = card.querySelector("p.card-text.fst-italic").textContent.trim();
		const itemPrice = parseInt(itemPriceText.slice(1).split(' ')[0].replaceAll(',', ""));

		// Format key to match required format
		const key = `${itemName.replace(/\s+/g, '_')}`;

		// Use getNumericValue to retrieve the current best value
		const currentBest = this.getItemValue(key);

		if (currentBest === itemPrice) return;

		console.debug(`Updating value for ${itemName} from ${currentBest} to ${itemPrice}`); // Debugging log
		this.setItemValue(key, itemPrice); // Store value with formatted key

		const newStoredValue = this.getItemValue(key);


		// Ensure pointName and priceCurrentBest are defined
		if (typeof this.pointName !== 'undefined' && itemName === this.pointName) {
			this.pointCurrentBest.textContent = `(${POUND}${itemPrice.toLocaleString("en-US")})`;
		} else if (this.priceCurrentBest && this.priceCurrentBest.value === itemName) {
			this.priceCurrentBest.textContent = `(${POUND}${itemPrice.toLocaleString("en-US")})`;
		}
	}
	_handleItemListing() {
		const eventCard = document.querySelector("div.contentColumn p.card-text.fw-bold.text-white");
		if (eventCard === null) return;

		const eventText = eventCard.textContent.split(" - ")[1];
		const textSplit = eventText.split(' ');
		if (textSplit[1] !== "listed") return;

		let i = 3;
		let itemName = textSplit[i];
		while (textSplit[++i] !== "for") itemName += ` ${textSplit[i]}`;

		const val = parseInt(textSplit.at(-1).slice(1).replace(',', ""));
		const curVal = this.getItemValue(itemName);

		if (curVal === null || val < curVal) this.setItemValue(itemName, val);
	}
	_createPointPriceContainer(price) {
		const pointCurrentBest = document.createElement("span");
		pointCurrentBest.id = "pricePerPointsLabelCurrentBest";
		pointCurrentBest.classList.add("text-muted");

		pointCurrentBest.innerText = `(${POUND}${price === null ? "???" : price.toLocaleString("en-US")})`;

		return pointCurrentBest;
	}
	_createItemPriceContainer(itemName, price) {
		const priceCurrentBest = document.createElement("span");
		priceCurrentBest.id = "pricePerLabelCurrentBest";
		priceCurrentBest.classList.add("text-muted");
		priceCurrentBest.value = itemName;

		priceCurrentBest.innerText = `(${POUND}${price === null ? "???" : price.toLocaleString("en-US")})`;

		return priceCurrentBest;
	}
	inSupporter(url) {
		const refillText = document.querySelector("div.card-body p.card-text:not(.fw-bold)");
		const pointPrice = this.getItemValue(this.pointName);
		if (pointPrice === null || refillText === null) return;

		refillText.innerHTML = `${refillText.innerText.slice(0, -1)} <span class="text-muted">(${POUND}${(pointPrice * 25).toLocaleString("en-US")})</span>.`;
	}
	inEstateAgent(url) {
		const buildReqs = document.querySelectorAll("div.row.pb-2");
		if (buildReqs?.length <= 0) return;

		for (const buildReq of buildReqs) {
			const matList = buildReq.querySelector('div.col-6.d-flex.flex-column > p');

			let totalCost = 0;
			matList.innerHTML = matList
				.innerHTML
				.split("<br>")
				.map(mat => {
					const count = parseInt(mat.split(' ')[0].slice(1).replaceAll(',', ""));
					const val = this.getItemValue(mat.split(' ').slice(1).join(' ').trim());

					if (val === null) totalCost = "???";
					else if (totalCost !== "???") totalCost += count * val;

					return `${mat.trim()} <span class="text-muted">(${POUND}${val === null ? "???" : (count * val).toLocaleString("en-US")})</span>`;
				})
				.join('<br>');

			if (totalCost !== "???") {
				const cash = buildReq.querySelector('div:nth-child(2) > p.form-data-inset.p-2.mb-2.rounded');
				totalCost += parseInt(cash.textContent.slice(1).replaceAll(',', ""));
			}
			buildReq.innerHTML += `<div class="col-6"><p class="fw-bold mb-0">Total Value:</p><p class="fw-bold text-muted">${POUND}${totalCost === "???" ? "???" : totalCost.toLocaleString("en-US")}</p></div>`;
		}

		const buildModal = document.querySelector("div#buildModal");
		if (!buildModal) return;

		observeDOM(buildModal, e => {
			const modal = e[1].target;
			const matList = modal.querySelectorAll("ul > li");

			let changed = false;
			let totalCost = 0;
			for (const matDesc of matList) {
				if (matDesc.children.length > 0) continue;

				const mat = matDesc.textContent;
				// Build cost
				if (mat[0] === POUND) {
					totalCost += parseInt(mat.slice(1).replaceAll(',', ""));
					continue;
				}

				changed = true;
				const count = parseInt(mat.split(' ')[0].slice(0, -1).replaceAll(',', ""));
				const matName = mat.split(' ').slice(1).join(' ').trim();
				const val = this.getItemValue(matName === "Concrete" ? "Concrete Bags" : matName);
				matDesc.innerHTML = `${mat.trim()} <span class="text-muted">(${POUND}${val === null ? "???" : (count * val).toLocaleString("en-US")})</span>`;

				if (val === null) totalCost = "???";
				else if (totalCost !== "???") totalCost += count * val;
			}
			if (changed)
				modal.innerHTML += `<p class="fw-bold text-center mt-3">Total value: <span class="text-muted">${POUND}${totalCost === "???" ? "???" : totalCost.toLocaleString("en-US")}</span></p>`;
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

			this._updateStoreUI(item, itemName, selling);
		}
	}
	_updateStoreUI(item, itemName, inSellingUI) {
		const currentBest = this.getItemValue(itemName);
		if (currentBest === null) return;

		const priceElem = item.children[4];
		const currentVal = parseInt(priceElem.textContent.slice(1).replaceAll(',', ""));

		let shopHTML = priceElem.innerHTML;
		if (currentVal > currentBest)
			shopHTML = `<span class="text-${inSellingUI ? "success" : "danger"}">${priceElem.textContent}</span>`;
		else if (currentVal === currentBest && inSellingUI)
			shopHTML = `<span class="text-warning">${priceElem.textContent}</span>`;

		const marketHTML = `<br><span class="text-muted">(${POUND}${currentBest.toLocaleString("en-US")})</span>`;

		priceElem.innerHTML = shopHTML + marketHTML;
		const otherValueText = item.children[6].querySelector("div.col-6");
		otherValueText.innerHTML = `<div class="card-text"><div class="fw-bold">Value</div>${shopHTML}${marketHTML}</div>`;
	}
	inTradeView(url) {
		const tradeTabs = document.querySelectorAll("div.card-body:not(.text-center)");
		if (tradeTabs?.length <= 0) return;

		const totalVal = [0, 0];

		for (let i = 0; i !== 2; ++i) {
			const tradeTab = tradeTabs[i + 1];
			const itemList = tradeTab.querySelector("div.table-responsive tbody");
			if (itemList !== null) {
				totalVal[i] += this._handleTradeItemList(itemList);
			}

			const inputs = tradeTab.querySelectorAll("input.form-control");
			const pointVal = this.getItemValue(this.pointName);

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
		this._updateTradeUI(tradeTabs, totalVal);
	}
	_handleTradeItemList(itemList) {
		itemList.children[0].innerHTML += "<th>Value</th>";

		let value = 0;
		const items = itemList.querySelectorAll("tr.align-middle");
		for (const item of items) {
			const itemName = item.children[0].textContent;
			const val = this.getItemValue(itemName);
			const itemCount = parseInt(item.children[1].textContent.replaceAll(',', ""));
			item.innerHTML += `<td class="text-muted">${POUND}${val === null ? "???" : (val * itemCount).toLocaleString("en-US")}</td>`;
			if (val === null) {
				value = "???";
				break;
			}
			value += val * itemCount;
		}
		return value;
	}
	_updateTradeUI(tradeTabs, totalVal) {
		for (let i = 0; i !== 2; ++i) {
			const nameHeader = tradeTabs[i + 1].parentNode.querySelector("h2");
			const templateStart = `<h2 class="row"><div class="col">${nameHeader.textContent}</div><div class="col text-end`
			let styles;
			const templateEnd = `${POUND}${totalVal[i] === "???" ? "???" : totalVal[i].toLocaleString("en-US")}</div></h2>`;

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
		const itemList = document.querySelector("div.container.inventoryWrapper");
		if (itemList === null) return;

		const buttonNode = itemList.parentNode.querySelector("div.contentColumn input.btn");
		const buttonHTML = buttonNode.outerHTML;

		const totalContainer = document.createElement("div");
		totalContainer.classList.add("card-body", "mb-4");
		totalContainer.innerHTML = `<p class="card-text">Total item value: <span id="totalValue" class="fw-bold">${POUND}0</span>.${buttonHTML}</p>`;
		buttonNode.remove();
		itemList.parentNode.appendChild(totalContainer);

		const totalText = itemList.parentNode.querySelector("span#totalValue");
		const totalVals = {};

		const items = itemList.querySelectorAll('div.inventoryItemWrapper');
		for (const item of items) {
			if (item.children.length < 2) continue;

			const itemName = item.children[1].textContent.split(' ').slice(0, -1).join(' ');
			const currentBest = this.getItemValue(itemName);

			const value = document.createElement("span");
			value.classList.add("itemValue", "text-muted", "float-end");
			value.innerText = `(${POUND}${currentBest === null ? "???" : currentBest.toLocaleString("en-US")})`;
			item.children[1].appendChild(value);

			const input = item.querySelector("input.form-control");
			input.addEventListener("input", e => {
				const value = e.target.parentNode.parentNode.querySelector("span.itemValue");
				const currentBest = this.getItemValue(itemName);
				const inputVal = e.target.value;
				let totalValue = 0;

				if (inputVal === "" || inputVal.trim()[0] === '-' || parseInt(inputVal) === 0) {
					this._resetInputDisplay(value, currentBest, totalVals);
				} else {
					const count = parseInt(inputVal);
					this._updateInputDisplay(value, currentBest, totalVals, count);
				}
				for (const val in totalVals)
						totalValue += val * totalVals[val];
				totalText.innerText = `${POUND}${totalValue.toLocaleString("en-US")}`;
			});
		}
	}
	_resetInputDisplay(valueElem, currentBest, totalVals) {
		valueElem.classList.remove("fw-bold");
		valueElem.classList.add("text-muted");
		valueElem.style.color = null;
		valueElem.innerText = `(${POUND}${currentBest === null ? "???" : currentBest.toLocaleString("en-US")})`;
		if (currentBest === null) return;

		totalVals[currentBest] = 0;
	}
	_updateInputDisplay(valueElem, currentBest, totalVals, count) {
		valueElem.classList.remove("text-muted");
		valueElem.classList.add("fw-bold");
		valueElem.style.color = this.bestColor;
		valueElem.innerText = `(${POUND}${currentBest === null ? "???" : (currentBest * count).toLocaleString("en-US")})`;
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
			const currentBest = this.getItemValue(itemName);

			const value = document.createElement("span");
			value.classList.add("itemValue", "text-muted", "float-end");
			value.innerText = `(${POUND}${currentBest === null ? "???" : (currentBest * countOf).toLocaleString("en-US")})`;
			itemText.appendChild(value);

			if (currentBest === null) haveAll = false;
			else totalVal += currentBest * countOf;

			this._colorArmoryItems(item, itemName);
		}
		
		const pointVal = this.getItemValue(this.pointName);
		if (pointVal !== null) {
			const pointsText = cards[cards.length - 2].querySelector("div.header-section > h2");
			const pointsTextSplit = pointsText.innerText.split(' ');
			const points = parseInt(pointsTextSplit[pointsTextSplit.length - 1].replaceAll(',', ""));
			totalVal += points * pointVal;
		}

		let totalValCard = document.createElement("div");
		totalValCard.classList.add("mb-4", "card");
		totalValCard.innerHTML = `<div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Total Armory Value</h2></div></div></div><div class="card-body"><p class="card-text">The value of this armory is ${haveAll ? "" : "at least "}<span class="fw-bold">${POUND}${totalVal.toLocaleString("en-US")}</span>.</p></div>`;
		container.insertBefore(totalValCard, cards[cards.length - 2]);
	}
	_colorArmoryItems(item, itemName) {
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
		if (eventList?.length <= 0) return;

		let profit = [];
		let maxProfit = 0;
		let minProfit = Infinity;

		for (const ev of eventList) {
			const eventType = ev.children[0].textContent;
			const eventDescription = ev.children[1].textContent;
			const eventSplit = eventDescription.split(' ');

			if (eventType === "Casino") {
				const spinProfit = this._handleCasinoEvents(ev);

				if (spinProfit !== null) {
					profit.push(spinProfit);
					maxProfit = Math.max(maxProfit, spinProfit);
					minProfit = Math.min(minProfit, spinProfit);
				} else {
					profit.push('???');
				}
				continue;
			} else if (eventType === "Item Sending") {
				const itemSendingProfit = this._handleItemSendingEvents(eventDescription);

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

			totalVal += this._getMoneyFromEvent(eventDescription) || 0;
			const itemVal = this._getItemValFromEvent(eventDescription);

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
		this._adjustEventHeader(header);


		this._updateEventUI(eventList, profit, minProfit, maxProfit, category);
	}
	_handleCasinoEvents(evt) {
		const evtDesc = evt.children[1].textContent;

		const rewardRegex = new RegExp('(?:won )(?<reward>.*)(?:\.$)', 'g');
		const reward = rewardRegex.exec(evtDesc).groups?.reward || '';

		const spinProfit = this.spinnerValues.get(reward) || null;

		return spinProfit;
	}
	_handleItemSendingEvents(eventDescription) {
		// NAME sent you x<amount> <item>('s. Message - ...)
		// Only handles received items
		const itemRegex = new RegExp(/^\w+ sent you x(?<amount>\d+) (?<item>[^'.]+)/, 'g');
		const regexResult = itemRegex.exec(eventDescription);
		const itemName = regexResult?.groups?.item;
		const countOf = regexResult?.groups?.amount || 0;

		return itemName ? this.getItemValue(itemName) * parseInt(countOf): null;
	}
	_getMoneyFromEvent(eventDescription) {
		const moneyRegex = new RegExp(/\u00a3\d+(,\d+)*/, 'g');
		const moneyRegexResult = moneyRegex.exec(eventDescription);

		if (!moneyRegexResult?.[0]) return null
		return parseInt(moneyRegexResult?.[0].slice(1).replaceAll(',', ""));
	}
	_getItemValFromEvent(eventDescription) {
		const items = this._getItemsFromEvent(eventDescription);
		let totalValue = 0;
		for (const [item, amount] of items) {
			const itemValue = this.getItemValue(item);
			if (itemValue === null) return itemValue;

			totalValue += amount * itemValue;
		}
		return totalValue;
	}
	_getItemsFromEvent(eventDescription) {
		const allItems = Object
		  	.keys(this.defaultVals)
		  	.map(item => RegExp.escape(item))
			.join('|');
		const foundItems = [];

		const amountRegex = new RegExp('(?<amount>\\d+)x? (?<item>' + allItems + ')', 'g');

		return eventDescription.matchAll(amountRegex).map(result => {
			const groups = result?.groups;
			if (!(groups?.item || groups?.amount)) return;

			const item = groups.item;
			const amount = parseInt(groups.amount);
			return [item, amount];
		});
	}
	_adjustEventHeader(header) {
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
	_updateEventUI(eventList, profit, minProfit, maxProfit, category) {
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
				valueCol.innerHTML = `<span class="text-muted">${POUND}???</span>`;
			else if (["Production", "Jobs", "Casino", "Expedition"].includes(category)) {
				const colorVal = (prof - minProfit) / (maxProfit - minProfit);
				valueCol.innerHTML = `<span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">${POUND}${prof.toLocaleString("en-US")}</span>`;
			}
			else
				valueCol.innerHTML = `<span class="text-muted">${POUND}${prof.toLocaleString("en-US")}</span>`;

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

		const cokeVal = this.getItemValue("Cocaine");
		const profit = [];
		let maxProfit = -Infinity;
		let minProfit = Infinity;
		for (let i = 0; i !== containers.length; ++i) {
			profit[i] = this._calcProfit(i, containers[i]);
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
				expectedProfit.innerHTML = `Profit: <span class="fw-bold" style="color: hsl(${profit[i] >= 0 ? colorVal * 120 : 0}, 67%, ${this.brightness}%)">${POUND}${Math.floor(profit[i]).toLocaleString("en-US")}/narco</span>`;
			}
			else
				expectedProfit.innerHTML = `Profit: <span class="text-muted">${POUND}???/narco</span>`;
			container.insertBefore(expectedProfit, container.querySelectorAll("hr")[1]);

			let narcoInput = containers[i].querySelector("input.assignNarcoInput");
			this.assigned[i] = parseInt(narcoInput.value.replaceAll(',', ""));
			narcoInput.id = `inputNum${i}`;
			narcoInput.addEventListener("input", this._assignedNarcosChange.bind(this));
		}

		// Calculate Expected Daily Profit
		const prodHeader = document.querySelector("#mainBackground > div > div > div.col-12 > div.productionsContainer.rounded > div.row.mb-0");
		const dailyProfit = this._calcDailyProfit(profit, containers);

		const flexContainer = this._constructProdHeader(dailyProfit, cokeVal);

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

				let colorClass = "text-success";
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
	}
	_getPrestigeLevels(prestigeTable) {
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
	_calcProfit(id, container) {
		const narcoInput = container.querySelector("input.assignNarcoInput");
		this.assigned[id] = parseInt(narcoInput.value.replaceAll(',', ""));
		if (this.assigned[id] === 0) return 0;

		const prestigeTable = container.querySelector('div.table-responsive.production-table.mt-1');
		const prestigeLevels = this._getPrestigeLevels(prestigeTable);

		// Each level of 'Production Boost' prestige increases profit by 20%
		const profitBoost = 1 + prestigeLevels.productionBoost * 0.2;

		let profit = this.prodMoney[id] * profitBoost;
		const itemProfit = this._calcItemProfits(id) * profitBoost;
		if (itemProfit === null) return null;

		profit += itemProfit;

		const prodCount = this._getProdCount(container);

		profit *= this._calcProfitScalar(id, prodCount);

		// Each level of 'Efficiency' prestige reduces required supply by 10%
		const efficiency = 1 - prestigeLevels.efficiency * 0.1;

		const supplyCost = this._calcSupplyCost(id, prodCount, container) * efficiency;
		if (supplyCost === null) return null;

		profit -= supplyCost;

		profit *= this.prodProfitFactor;
		if (id === 0) profit *= this.streetProfitFactor;
		profit /= this.narcoCounts[id] * (id === 4 ? prodCount : 1); // Also dealing with coke custom scaling
		return profit;
	}
	_getProdCount(container) {
		const prodCountText = container.querySelectorAll("tbody tr.align-middle th");
		if (prodCountText.length === 0) return 1;
		return parseInt(prodCountText[1].innerText) || 1;
	}
	_calcProfitScalar(id, prodCount) {
		if (id === 4)
			return this.prodCokeScaling[prodCount - 1]; // Coke has custom scaling
		else
			return Math.pow(1 - this.prodDepreciation / 100, prodCount - 1); // Maybe should instead be *= (1 - prodCount * this.prodDepreciation / 100)
	}
	_calcItemProfits(id) {
		let itemProfit = 0;
		for (const itemName of Object.keys(this.itemCounts[id])) {
			const itemVal = this.getItemValue(itemName);
			if (itemVal === null) continue;
			itemProfit += itemVal * this.itemCounts[id][itemName];
		}
		return itemProfit;
	}
	_calcSupplyCost(id, prodCount, container) {
		const prodReqsText = container.querySelector("p.card-text.text-center.mb-0");
		const prodReqs = prodReqsText.innerText.split(' ').filter(w => w.startsWith('x'));
		let supplyCost = 0;
		let j = 0;
		for (let itemName of Object.keys(this.prodReqs[id])) {
			const itemVal = this.getItemValue(itemName);
			if (itemVal === null) return null;
			supplyCost += itemVal * parseInt(prodReqs[j].slice(1).replaceAll(',', "")) / (id === 4 ? 1 : prodCount);
			++j;
		}
		return supplyCost;
	}
	_assignedNarcosChange(e) {
		this.assigned[parseInt(e.target.id.slice(8))] = parseInt(e.target.value.replaceAll(',', ""));
		const dailyProfitText = document.querySelector("span#dailyProfit");
		const dailyProfitCokeText = document.querySelector("span#dailyProfitMinusCoke");
		const dailyProfit = this._calcDailyProfit(profit, containers);

		dailyProfitText.innerText = `${POUND}${dailyProfit === null ? "???" : Math.round(dailyProfit).toLocaleString("en-US")}`;
		if (dailyProfit === null) return;

		this._adjustColors(dailyProfitText, dailyProfit);

		const dailyProfitCoke = dailyProfit - this.maxCokeDaily * cokeVal;
		dailyProfitCokeText.innerText = `${POUND}${cokeVal === null ? "???" : Math.round(dailyProfitCoke).toLocaleString("en-US")}`;
		if (cokeVal === null) return;

		this._adjustColors(dailyProfitCokeText, dailyProfitCoke);
	}
	_calcDailyProfit(profit, containers) {
		let dailyProfit = 0;
		for (var j = 0; j !== containers.length; ++j) {
			if (profit[j] === null && this.assigned[j]) return null;

			dailyProfit += profit[j] * this.assigned[j];
		}
		return dailyProfit;
	}
	_adjustColors(elem, value) {
		elem.classList.remove("text-danger", "text-warning", "text-success");
		const className = value > 0 ? "text-success" : value < 0 ? "text-danger" : "text-warning";
		elem.classList.add(className);
	}
	_constructProdHeader(dailyProfit, cokeVal) {
		// Create Expected Daily Profit card
		const expectedProfit = document.createElement("div");
		expectedProfit.classList.add("mb-4", "card");
		expectedProfit.innerHTML = `<div class="header-section"><h2>Expected Daily Profit</h2></div><div class="card-body"><p class="card-text text-center">Each day your narcos will produce roughly <span id="dailyProfit" class="fw-bold ${dailyProfit === null ? "text-muted" : dailyProfit > 0 ? "text-success" : dailyProfit < 0 ? "text-danger" : "text-warning"}">${POUND}${dailyProfit === null ? "???" : Math.round(dailyProfit).toLocaleString("en-US")}</span> in profit.<br>If you take ${this.maxCokeDaily} cocaine daily, your net profit is <span id="dailyProfitMinusCoke" class="fw-bold ${cokeVal === null || dailyProfit === null ? "text-muted" : dailyProfit - this.maxCokeDaily * cokeVal > 0 ? "text-success" : dailyProfit - this.maxCokeDaily * cokeVal < 0 ? "text-danger" : "text-warning"}">${POUND}${cokeVal === null || dailyProfit === null ? "???" : Math.round(dailyProfit - this.maxCokeDaily * cokeVal).toLocaleString("en-US")}</span> per day.</p></div>`;

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
	inJobs(url) {
		const jobPanels = document.querySelectorAll("div.equipmentModule div.flex-column");
		if (jobPanels?.length <= 0) return;

		this.maxJobRep = 0;
		this.minJobRep = Infinity;
		this.jobValue = [];
		this.maxJobValue = 0;
		this.minJobValue = Infinity;
		for (let i = 0; i !== this.jobMoney.length; ++i) {
			const jobPanel = jobPanels[i];
			this._setJobTime(jobPanel, i);

			this.jobValue[i] = this.jobMoney[i];
			this._setJobBaseItemReward(i);

			if (this.jobValue[i] !== "???") this._setJobPrestigeReward(jobPanel, i);

			const standardJobRepBonus = getNumericValue('perk', 'Standard Job Rep');
			// Apply only to standard jobs
			if (i <= 4) this.jobRep[i] * (1 + (standardJobRepBonus / 100));

			this.maxJobRep = Math.max(this.maxJobRep, this.jobRep[i] / this.jobTimes[i]);
			this.minJobRep = Math.min(this.minJobRep, this.jobRep[i] / this.jobTimes[i]);
		}
		this._updateJobUI(jobPanels);
	}
	getJobTime(jobName) {
		const jobTime = getNumericValue('job_time', jobName);

		console.debug(`Fetching job duration; Job name: ${jobName}, Result: ${jobTime}`);
		return jobTime;
	}
	setJobTime(jobName, value) {
		setValue('job_time', jobName, value);
		console.debug(`Set job_time_${jobName} to ${value.toLocaleString("en-US")}`);
		return value;
	}
	_updateJobUI(jobPanels) {
		for (let i = 0; i !== this.jobValue.length; ++i) {
			const jobPanel = jobPanels[i];

			const divider = document.createElement('hr');
			divider.classList = 'mt-4 w-75';

			const pElem = document.createElement('p');
			pElem.classList = 'text-center';
			pElem.textContent = 'Expected gain: ';

			const gain = this.jobValue[i];
			const repPerTime = this.jobRep[i] / this.jobTimes[i];
			const spanElem = document.createElement('span');
			
			if (gain === '???') {
				spanElem.classList = 'text-muted';
				spanElem.textContent = `${POUND}???/h`;
			} else {
				spanElem.classList = 'fw-bold';
				spanElem.style.color = `hsl(${(gain - this.minJobValue) / (this.maxJobValue - this.minJobValue) * 120}, 67%, ${this.brightness}%)`;
				spanElem.textContent = `${POUND}${Math.round(gain * 60).toLocaleString("en-US")}/h`;
			}
			pElem.appendChild(spanElem.cloneNode(true));
			pElem.appendChild(document.createElement('br'));
			pElem.append('Expected rep: ');

			const spanElem2 = document.createElement('span');
			spanElem2.classList = 'fw-bold';
			spanElem2.style.color = `hsl(${(repPerTime - this.minJobRep) / (this.maxJobRep - this.minJobRep) * 120}, 67%, ${this.brightness}%)`;
			spanElem2.textContent = `${(repPerTime * 60).toLocaleString("en-US")}/h`;

			pElem.appendChild(spanElem2);

			jobPanel.appendChild(pElem);
		}
	}
	_setJobTime(jobPanel, index) {
		const jobTime = jobPanel.querySelector("p.card-text.fw-bold.text-muted");
		const jobName = jobPanel.querySelector('h5').firstChild.textContent;

		// Fallback, while doing a job; Use cached value
		if (!jobTime) {
			this.jobTimes[index] = this.getJobTime(jobName) || this.jobTimes[index];
			return;
		}

		const jobTimeSplit = jobTime?.textContent.split(' ');
		this.jobTimes[index] = parseFloat(jobTimeSplit[0].slice(1));
		if (jobTimeSplit[1].startsWith("hour")) {
			this.jobTimes[index] *= 60;
			if (jobTimeSplit.length > 2)
				this.jobTimes[index] += parseFloat(jobTimeSplit[2]);
		}
		this.setJobTime(jobName, this.jobTimes[index]);
	}
	_setJobBaseItemReward(index) {
		for (const item in this.jobItems[index]) {
			const price = this.getItemValue(item);
			if (price !== null)
				this.jobValue[index] += price * this.jobItems[index][item];
			else {
				this.jobValue[index] = "???";
				break;
			}
		}
	}
	_setJobPrestigeReward(jobPanel, index) {
		const prestigeText = jobPanel.querySelector("p.prestigeText");
		const incrReward = prestigeText !== null && /\+\d+%/.test(prestigeText.innerText) ? parseInt(prestigeText.innerText.match(/\+\d+%/)[0].slice(1, -1)) : 0;
		this.jobValue[index] *= 1 + incrReward / 100;
		this.jobRep[index] *= 1 + incrReward / 100;

		this.jobValue[index] *= this.jobProfitFactor;
		this.jobValue[index] /= this.jobTimes[index];
		this.maxJobValue = Math.max(this.maxJobValue, this.jobValue[index]);
		this.minJobValue = Math.min(this.minJobValue, this.jobValue[index]);
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
			const currentBest = this.getItemValue(itemName);
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
				valueText.innerHTML += `${POUND}${currentBest.toLocaleString("en-US")}</span>`;
				if (val !== null)
					valueText.innerHTML += ` <span style="color: hsl(${colorVal}, 67%, ${this.brightness}%)">(${POUND}${Math.round(val).toLocaleString("en-US")}/${append})</span>`;
			}
			totalVal += currentBest * countOf;
		}

		const totalValCard = document.createElement("div");
		totalValCard.classList.add("card-body", "mb-2");
		totalValCard.innerHTML = `<p class="card-text">The value of these items is ${haveAll ? "" : "roughly "}<span class="fw-bold">${POUND}${totalVal.toLocaleString("en-US")}</span>.</p>`;
		itemList.insertBefore(totalValCard, header);
	}
	inGym(url) {
		this._updateCokeDisplay();
	}
	inUniversity(url) {
		this._updateCokeDisplay();
	}
	_updateCokeDisplay() {
		const item = document.getElementById(`item-${getValue('itemID', 'Cocaine')}`);
		if (item === null) return;

		const val = this.poundPerEnergy["Cocaine"];
		const colorVal = (1 - (val - this.minPpe) / (this.maxPpe - this.minPpe)) * 120;
		const valueTexts = [item.children[3], item.children[5].querySelectorAll("div.card-text > div.card-text")[2]];
		for (var valueText of valueTexts)
			if (valueText !== undefined && valueText !== null)
				valueText.innerHTML = `<span>${valueText.innerText}</span> <span style="color: hsl(${colorVal}, 67%, ${this.brightness}%)">(${POUND}${Math.round(val).toLocaleString("en-US")}/E)</span>`;
	}
}
