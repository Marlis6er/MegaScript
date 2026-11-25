class TownCache {

	/**
	 * A cache object that stores data about the displayed link and the cache
	 * 
	 * @param {string} cacheID - The cache identifier in the extension storage
	 * @param {string} name - The name to be displayed below the link
	 * @param {string} altName - The name to be displayed instead of the icon; Also acts as the identifier in the settings
	 * @param {string} link - The (relative) link to the target page
	 * @param {string} path - The svg elements of the icon
	 * @param {number} viewBox - The viewbox size of the icon
	 * @param {(...args) => boolean} isDone - A function that evaluates whether or not a cache should be displayed
	 */
	constructor(cacheID, name, altName, link, path, viewBox, isDone) {
		this.cacheID = cacheID;
		this.name = name;
		this.altName = altName;
		this.link = link;
		this.path = path;
		this.viewBox = viewBox;
		this.isDone = isDone;
	}
}


class DisplayTownCaches {

	static metadata = {
		displayName: 'Display Town Caches',
		description: 'Display links to locations to visit once a day',
		settings: {
			active: {
				inPetshop: {
					description: 'Update cache when visited'
				},
				inSicarios: {
					description: 'Update cache when visited'
				},
				inCasinoSpinner: {
					description: 'Update cache when all spins are used'
				},
				inSupporter: {
					description: 'Update cache when energy refill is used'
				},
				inMateos: {
					description: 'Update cache when all points are bought'
				},
				inTown: {
					description: 'Display remaining spins for the casino and cached dogs for the pet shop'
				},
				inCasino: {
					description: 'Display remaining spins for the spinner'
				},
				inAnywhere: {
					description: 'Display links to relevant locations in the top nav bar'
				}
			},
			custom: {
				caches: {
					displayName: 'Daily Caches',
					description: 'Links to pages you wanna visit once per day',
					type: SettingType.LIST,
					defaultValue: [
						'Refill',
						'Spins',
						'Sicarios',
						'Pets',
						'Points'
					],
					extra: {
						unique: true,
						availableElements: [
							'Refill',
							'Spins',
							'Sicarios',
							'Pets',
							'Points',
							'Police Auction',
							'Armed Surplus',
							'Pharmacy',
							'Underground Weapons',
							'Car Dealership',
							'Premium Antiques'
						]
					}
				}
			}
		}
	}

	constructor() {
		const configManager = ConfigManager.getInstance();
		this.hoursLate = 0;
		this.brightness = configManager.darkmode ? 50 : 45;
		this.incompleteColor = `hsl(60, 67%, ${this.brightness}%)`;

		this.casinoIdx = 4;
		this.petsIdx = 5;
		this.spinsIdx = 1;

		this.stores = ['armedsurplus', 'pharmacy', 'diablos', 'dealership', 'mateos'];
		this.CANT_PURCHASE_MORE = 'Can\'t purchase more items today';

		this.petAbbrevs = {
			"Common": "C",
			"Uncommon": "UC",
			"Rare": "R",
			"Epic": "E",
			"Legendary": "L"
		};
		this.links = [
			new TownCache(
				'EnergyRefill',
				"REFILL",
				"Refill",
				"/Supporter",
				`<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"></path>`,
				16,
				(refillDone) => refillDone
			),
			new TownCache(
				'Spins',
				"WHEEL SPIN",
				"Spins",
				"/Casino/Spinner",
				`<path fill-rule="evenodd" clip-rule="evenodd" d="M0.877075 7.49985C0.877075 3.84216 3.84222 0.877014 7.49991 0.877014C11.1576 0.877014 14.1227 3.84216 14.1227 7.49985C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49985ZM3.78135 3.21565C4.68298 2.43239 5.83429 1.92904 7.09998 1.84089V6.53429L3.78135 3.21565ZM3.21567 3.78134C2.43242 4.68298 1.92909 5.83428 1.84095 7.09997H6.5343L3.21567 3.78134ZM6.5343 7.89997H1.84097C1.92916 9.16562 2.43253 10.3169 3.21579 11.2185L6.5343 7.89997ZM3.78149 11.7842C4.6831 12.5673 5.83435 13.0707 7.09998 13.1588V8.46566L3.78149 11.7842ZM7.89998 8.46566V13.1588C9.16559 13.0706 10.3168 12.5673 11.2184 11.7841L7.89998 8.46566ZM11.7841 11.2184C12.5673 10.3168 13.0707 9.16558 13.1588 7.89997H8.46567L11.7841 11.2184ZM8.46567 7.09997H13.1589C13.0707 5.83432 12.5674 4.68305 11.7842 3.78143L8.46567 7.09997ZM11.2185 3.21573C10.3169 2.43246 9.16565 1.92909 7.89998 1.8409V6.53429L11.2185 3.21573Z"></path>`,
				16,
				(spinsLeft) => spinsLeft === 0
			),
			new TownCache(
				'Sicarios',
				"SICARIOS",
				"Sicarios",
				"/Town/Club",
				`<path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path> <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"></path>`,
				16,
				() => true
			),
			new TownCache(
				'Pets',
				"PET SHOP",
				"Pets",
				"/PetShop",
				`<path d="M104,140a12,12,0,1,1-12-12A12,12,0,0,1,104,140Zm60-12a12,12,0,1,0,12,12A12,12,0,0,0,164,128Zm68.7,16a16.1,16.1,0,0,1-6.7,1.4,15.6,15.6,0,0,1-10-3.6V184a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V141.8a15.6,15.6,0,0,1-10,3.6,16.1,16.1,0,0,1-6.7-1.4,15.8,15.8,0,0,1-9.1-17.6L30.6,38.9A16.1,16.1,0,0,1,50.2,26.3L105,40h46l54.8-13.7a16.1,16.1,0,0,1,19.6,12.6l16.4,87.5A15.8,15.8,0,0,1,232.7,144ZM200,184V122L148.1,56H107.9L56,122v62a24.1,24.1,0,0,0,24,24h40V195.3l-13.7-13.6a8.1,8.1,0,0,1,11.4-11.4L128,180.7l10.3-10.4a8.1,8.1,0,0,1,11.4,11.4L136,195.3V208h40A24.1,24.1,0,0,0,200,184Z"></path>`,
				256,
				() => true
			),
			new TownCache(
				'MateosPoints',
				"POINTS",
				"Points",
				"/Town/Mateos",
				`<path d="M13,7H10A1,1,0,0,0,9,8v8a1,1,0,0,0,2,0V14h2a3,3,0,0,0,3-3V10A3,3,0,0,0,13,7Zm1,4a1,1,0,0,1-1,1H11V9h2a1,1,0,0,1,1,1ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"></path>`,
				24,
				(pointsDepleted) => pointsDepleted
			),
			new TownCache(
				'PoliceAuction',
				"AUCTION",
				"Police Auction",
				"/Town/PoliceAuction",
				`<path xmlns="http://www.w3.org/2000/svg" d="M11.623 7.603l6.062 3.5c0.479 0.276 1.090 0.112 1.365-0.366 0.277-0.478 0.113-1.090-0.365-1.365l-6.062-3.5c-0.479-0.276-1.090-0.112-1.366 0.365s-0.112 1.089 0.366 1.366zM17.186 11.969l-6.062-3.5-3.5 6.062 6.062 3.5 3.5-6.062zM6.123 17.129l6.062 3.5c0.478 0.276 1.090 0.112 1.365-0.366s0.112-1.090-0.365-1.365l-6.062-3.5c-0.479-0.276-1.090-0.112-1.366 0.365-0.277 0.478-0.112 1.090 0.366 1.366zM27.012 19.951l-11.076-5.817-1 1.732 10.576 6.683c0.717 0.414 1.635 0.169 2.049-0.549s0.168-1.635-0.549-2.049zM16.033 25c0-0.553-0.448-1-1-1h-9c-0.553 0-1 0.447-1 1 0 0.552 0 1 0 1l-1.033-0.021 0.033 1.021h13l0.047-0.958-0.984-0.042c0 0-0.063-0.448-0.063-1z"/>`,
				32,
				() => true
			),
			new TownCache(
				'BuyItems',
				"ARMED SURPLUS",
				"Armed Surplus",
				"/Town/ArmedSurplus",
				`<path d="M47.9818192,11.6695557h-3.0493774c0.0388794-0.1068115,0.0683594-0.218811,0.0683594-0.3391113v-2   c0-0.5522461-0.4472656-1-1-1s-1,0.4477539-1,1v2c0,0.1203003,0.029541,0.2322998,0.0684204,0.3391113H11.9324408   c0.0388794-0.1068115,0.0683594-0.218811,0.0683594-0.3391113v-2c0-0.5522461-0.4472656-1-1-1s-1,0.4477539-1,1v2   c0,0.1203003,0.029541,0.2322998,0.0684204,0.3391113h-1.517395c-1.9100337,0-3.6400142,1.0700073-4.4199824,2.7299805   l-1.6600344,3.5599976c-0.4899902,1.0300293-0.5299683,2.1900024-0.1199951,3.2600098   c0.4199829,1.1199951,1.2800293,2,2.4000247,2.4799805l0.2399902,0.1100464   c0.7099609,0.2999878,1.0800171,1.0199585,0.8800049,1.6999512L2.1618111,38.3595581   c-0.3599854,1.2199707-0.1199951,2.5200195,0.6600342,3.5499878c0.8199463,1.0999756,2.1499636,1.7600098,3.5599978,1.7600098   h5.269958c1.960022,0,3.6900024-1.2700195,4.210022-3.0700073l2.8727427-9.9317017h2.1968994   c4.4492188,0,8.0693359-3.6201172,8.0693359-8.0698242v-0.1884766h16.6409912c2.4000244,0,4.3600464-1.8699951,4.3600464-4.1699829   v-4.6099854C50.0018387,12.5495605,49.0918045,11.6695557,47.9818192,11.6695557z M20.9314651,28.6678467h-1.6184082   l1.3387451-4.6282959c0.0857544-0.2940674,0.2401733-0.5561523,0.4358521-0.7848511l2.163147,2.163147   c0.1953125,0.1953125,0.4511719,0.2929688,0.7070313,0.2929688s0.5117188-0.0976563,0.7070313-0.2929688   c0.390625-0.390625,0.390625-1.0234375,0-1.4140625l-1.3359375-1.3359375h3.671875   C26.9627151,25.9827881,24.2547073,28.6678467,20.9314651,28.6678467z"></path>`,
				52,
				() => true
			),
			new TownCache(
				'BuyItems',
				"PHARMACY",
				"Pharmacy",
				"/Town/Pharmacy",
				`<path d="m2.68 7.676 6.49-6.504a4 4 0 0 1 5.66 5.653l-1.477 1.529-5.006 5.006-1.523 1.472a4 4 0 0 1-5.653-5.66l.001-.002 1.505-1.492.001-.002Zm5.71-2.858a.5.5 0 1 0-.708.707.5.5 0 0 0 .707-.707ZM6.974 6.939a.5.5 0 1 0-.707-.707.5.5 0 0 0 .707.707ZM5.56 8.354a.5.5 0 1 0-.707-.708.5.5 0 0 0 .707.708Zm2.828 2.828a.5.5 0 1 0-.707-.707.5.5 0 0 0 .707.707Zm1.414-2.121a.5.5 0 1 0-.707.707.5.5 0 0 0 .707-.707Zm1.414-.707a.5.5 0 1 0-.706-.708.5.5 0 0 0 .707.708Zm-4.242.707a.5.5 0 1 0-.707.707.5.5 0 0 0 .707-.707Zm1.414-.707a.5.5 0 1 0-.707-.708.5.5 0 0 0 .707.708Zm1.414-2.122a.5.5 0 1 0-.707.707.5.5 0 0 0 .707-.707ZM8.646 3.354l4 4 .708-.708-4-4-.708.708Zm-1.292 9.292-4-4-.708.708 4 4 .708-.708Z"></path>`,
				16,
				() => true
			),
			new TownCache(
				'BuyItems',
				"UNDERGROUND WEAPONS",
				"Underground Weapons",
				"/Town/diablos",
				`<path xmlns="http://www.w3.org/2000/svg" d="M403.906,208.568l21.462-21.462l-20.005-20.005l77.408-57.691l-80.174-80.174l-57.691,77.407L324.901,86.64    l-21.462,21.462l21.685,21.685L81.336,373.573l57.097,57.097l49.193-49.192l62.543,62.543l51.691-51.69l-26.687-26.687    c13.672-21.853,13.672-49.861,0-71.712l20.598-20.598l62.543,62.543l51.69-51.691l-62.543-62.543l34.759-34.759L403.906,208.568z     M252.654,343.126l-6.669-6.669l-6.669-6.669l13.339-13.339C255.923,325.017,255.923,334.556,252.654,343.126z"/>`,
				512.004,
				() => true
			),
			new TownCache(
				'BuyItems',
				"CAR DEALERSHIP",
				"Car Dealership",
				"/Town/dealership",
				`<path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679c.033.161.049.325.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.807.807 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2H6ZM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17 1.247 0 3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"></path>`,
				16,
				() => true
			),
			new TownCache(
				'BuyItems',
				"PREMIUM ANTIQUES",
				"Premium Antiques",
				"/Town/mateos",
				`<path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702 1.509.229z"></path><path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z"></path>`,
				16,
				() => true
			)
		];

		const activeCaches = configManager.getCustomSetting(this, 'caches');
		if (activeCaches !== null) this.links = this.links.filter(link => activeCaches.includes(link.altName));
	}
	getCache(type) {
		return getValue('cache', type);
	}
	setCache(type, cache) {
		setValue('cache', type, cache);
		console.debug(`Set cache_${type} to ${cache}`);
		return cache;
	}
	timeFunc(now) {
		return new Date(now).toLocaleDateString("en-GB", { timeZone: "UTC" });
	}
	inPetshop(url) {
		const rarities = document.querySelectorAll(".equipmentModule div.fw-bold > span:not(.fw-normal)");

		if (rarities.length !== 3) return;

		const curCache = this.getCache("Pets");
		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;
		if (curCache === null || this.timeFunc(now) !== this.timeFunc(curCache[0])) // New day
			this.setCache("Pets", [now, rarities[0].textContent, rarities[1].textContent, rarities[2].textContent]);
	}
	inSicarios(url) {
		this._setVisited('Sicarios');
	}
	inCasinoSpinner(url) {
		const spinsLeft = document.querySelector("span#tokenCount");
		if (!spinsLeft) return;

		const spinsLeftNum = parseInt(spinsLeft.textContent);
		const curCache = this.getCache("Spins");
		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;
		if (curCache === null || parseInt(spinsLeftNum) !== curCache[1] || this.timeFunc(now) !== this.timeFunc(curCache[0])) // New day
			this.setCache("Spins", [now, spinsLeftNum]);
		observeDOM(spinsLeft, e => {
			const spinsLeftNum = parseInt(e[0].target.textContent);
			const now = Date.now();
			this.setCache("Spins", [now, spinsLeftNum]);
		});
	}
	inSupporter(url) {
		const refillButton = document.querySelector("a#refillEnergy");
		if (!refillButton) return;

		const refillDone = refillButton.classList.contains("disabled");

		const curCache = this.getCache("EnergyRefill");
		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;
		if (curCache === null || refillDone !== curCache[1] || this.timeFunc(now) !== this.timeFunc(curCache[0])) // New day
			this.setCache("EnergyRefill", [now, refillDone]);
	}
	inMateos(url) {
		const headerSections = document.querySelectorAll('.header-section');
		if (headerSections?.length < 2) return;
		
		const pointsHeader = headerSections[2].querySelector('h2').textContent;
		const pointsDepleted = pointsHeader.includes("(0/25)");
		console.debug(pointsHeader);
		console.debug(pointsDepleted);

		const curCache = this.getCache("MateosPoints");
		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;

		if (curCache === null || pointsDepleted !== curCache[1] || this.timeFunc(now) !== this.timeFunc(curCache[0]))
			this.setCache("MateosPoints", [now, pointsDepleted]);
	}
	inTown(url) {
		const places = document.querySelectorAll("div.equipmentModule");
		if (places.length === 0) return;

		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;

		const petShop = places[this.petsIdx].children[0];
		const curPetsCache = this.getCache("Pets");
		let button = petShop.querySelector("a.btn.btn-block");

		const hrBreak = document.createElement("hr");
		hrBreak.classList.add("w-75");
		petShop.insertBefore(hrBreak.cloneNode(), button);

		const cacheText = document.createElement("p");
		cacheText.classList.add("text-center");

		if (curPetsCache !== null && this.timeFunc(now) === this.timeFunc(curPetsCache[0]))
			cacheText.innerHTML = `(Today: <span class="${curPetsCache[1]}">${this.petAbbrevs[curPetsCache[1]]}</span>, <span class="${curPetsCache[2]}">${this.petAbbrevs[curPetsCache[2]]}</span>, <span class="${curPetsCache[3]}">${this.petAbbrevs[curPetsCache[3]]}</span>)`;
		else
			cacheText.innerHTML = `(Today: <span class="text-muted">???</span>)`;
		petShop.insertBefore(cacheText.cloneNode(true), button);

		const casino = places[this.casinoIdx].children[0];
		const curSpinsCache = this.getCache("Spins");
		button = casino.querySelector("a.btn.btn-block");

		casino.insertBefore(hrBreak.cloneNode(), button);
		if (curSpinsCache !== null && this.timeFunc(now) === this.timeFunc(curSpinsCache[0])) {
			if (curSpinsCache[1] === 0)
				cacheText.innerHTML = `(Today: <span class="text-muted">done</span>)`;
			else
				cacheText.innerHTML = `(Today: <span class="fw-bold text-warning">${curSpinsCache[1]} left</span>)`;
		} else
			cacheText.innerHTML = `(Today: <span class="fw-bold text-warning">2 left</span>)`;
		casino.insertBefore(cacheText.cloneNode(true), button);
	}
	inTownStore(url) {
		const storeRegex = new RegExp('(?:^town\/)(?<store>.+)\/?$');
		const store = storeRegex.exec(url)?.groups?.store;
		if (!this.stores.includes(store)) return;

		const firstItem = document.querySelector(".inventoryItemWrapper > div:nth-child(6) > div > button");
		if (!firstItem) return;

		if (firstItem.textContent === this.CANT_PURCHASE_MORE)
			this._setVisited('BuyItems');
	}
	inCasino(url) {
		const places = document.querySelectorAll("div.card-group div.card");
		if (places.length === 0) return;

		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;

		const spins = places[this.spinsIdx].children[0];
		const curSpinsCache = this.getCache("Spins");
		const button = spins.querySelector("a.btn.btn-block");

		const hrBreak = document.createElement("hr");
		hrBreak.classList.add("w-75");
		spins.insertBefore(hrBreak, button);

		const cacheText = document.createElement("p");
		cacheText.classList.add("text-center");
		if (curSpinsCache !== null && this.timeFunc(now) === this.timeFunc(curSpinsCache[0])) {
			if (curSpinsCache[1] === 0)
				cacheText.innerHTML = `(Today: <span class="text-muted">done</span>)`;
			else
				cacheText.innerHTML = `(Today: <span class="fw-bold text-warning">${curSpinsCache[1]} left</span>)`;
		}
		else
			cacheText.innerHTML = `(Today: <span class="fw-bold text-warning">2 left</span>)`;
		spins.insertBefore(cacheText, button);
	}
	inPoliceAuction(url) {
		this._setVisited('PoliceAuction')
	}
	inAnywhere() {
		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;
		const mobileMenu = document.querySelector("ul#menu");
		const desktopMenu = document.querySelector("ul#desktopMenu");

		for (const linkObj of this.links) {
			const cache = this.getCache(linkObj.cacheID);
			const done = cache && this.timeFunc(now) === this.timeFunc(cache[0]) && linkObj.isDone(...cache.slice(1))
			if (done) continue;
			
			const listItem = document.createElement("li");
			listItem.classList = 'flex-fill'
			listItem.innerHTML = `
				<a class="nav-link d-flex flex-column align-items-center px-md-0 px-2 leftNavLink" href="${linkObj.link}">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
							fill="hsl(60, 67%, ${this.brightness}%)"
							viewBox="0 0 ${linkObj.viewBox} ${linkObj.viewBox}">
						${linkObj.path}
					</svg>
					<span class="text-warning mt-1">${linkObj.name}</span>
				</a>
			`;
			if (mobileMenu)
				mobileMenu.appendChild(listItem.cloneNode(true));
			if (desktopMenu)
				desktopMenu.appendChild(listItem);
		}
	}
	_setVisited(cacheName) {
		const curCache = this.getCache(cacheName);
		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;
		if (curCache === null || this.timeFunc(now) !== this.timeFunc(curCache[0])) // New day
			this.setCache(cacheName, [now]);
	}
}
