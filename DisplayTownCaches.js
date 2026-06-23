class DisplayTownCaches {
	constructor(darkMode) {
		this.hoursLate = 0;
		this.brightness = darkMode ? 50 : 45;
		this.incompleteColor = `hsl(60, 67%, ${this.brightness}%)`;

		this.casinoIdx = 4;
		this.petsIdx = 5;
		this.spinsIdx = 1;

		this.petAbbrevs = {
			"Common": "C",
			"Uncommon": "UC",
			"Rare": "R",
			"Epic": "E",
			"Legendary": "L"
		};
		this.links = [
			// TODO: drug CD takes a while to load
			/*{
				name: "Take Cocaine",
				altName: "Cocaine",
				link: "/Inventory",
				path: `<path d="M213.7,42.3a53.4,53.4,0,0,0-75.4,0l-96,96a53.3,53.3,0,0,0,75.4,75.4l96-96A53.5,53.5,0,0,0,213.7,42.3Zm-11.4,64L160,148.7,107.3,96l42.4-42.3a36.9,36.9,0,0,1,52.6,0A37.1,37.1,0,0,1,202.3,106.3ZM190.2,82.9a7.9,7.9,0,0,1-.2,11.3l-24.4,23.6a7.9,7.9,0,0,1-11.3-.2,7.9,7.9,0,0,1,.2-11.3l24.4-23.6A8,8,0,0,1,190.2,82.9Z"></path>`,
				viewBox: 256
			},*/
			{
				name: "REFILL",
				altName: "Refill",
				link: "/Supporter",
				path: `<path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"></path>`,
				viewBox: 16
			},
			{
				name: "WHEEL SPIN",
				altName: "Spins",
				link: "/Casino/Spinner",
				path: `<path fill-rule="evenodd" clip-rule="evenodd" d="M0.877075 7.49985C0.877075 3.84216 3.84222 0.877014 7.49991 0.877014C11.1576 0.877014 14.1227 3.84216 14.1227 7.49985C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49985ZM3.78135 3.21565C4.68298 2.43239 5.83429 1.92904 7.09998 1.84089V6.53429L3.78135 3.21565ZM3.21567 3.78134C2.43242 4.68298 1.92909 5.83428 1.84095 7.09997H6.5343L3.21567 3.78134ZM6.5343 7.89997H1.84097C1.92916 9.16562 2.43253 10.3169 3.21579 11.2185L6.5343 7.89997ZM3.78149 11.7842C4.6831 12.5673 5.83435 13.0707 7.09998 13.1588V8.46566L3.78149 11.7842ZM7.89998 8.46566V13.1588C9.16559 13.0706 10.3168 12.5673 11.2184 11.7841L7.89998 8.46566ZM11.7841 11.2184C12.5673 10.3168 13.0707 9.16558 13.1588 7.89997H8.46567L11.7841 11.2184ZM8.46567 7.09997H13.1589C13.0707 5.83432 12.5674 4.68305 11.7842 3.78143L8.46567 7.09997ZM11.2185 3.21573C10.3169 2.43246 9.16565 1.92909 7.89998 1.8409V6.53429L11.2185 3.21573Z"></path>`,
				viewBox: 16
			},
			{
				name: "SICARIOS",
				altName: "Sicarios",
				link: "/Town/Club",
				path: `<path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path> <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"></path>`,
				viewBox: 16
			},
			{
				name: "PET SHOP",
				altName: "Pets",
				link: "/PetShop",
				path: `<path d="M104,140a12,12,0,1,1-12-12A12,12,0,0,1,104,140Zm60-12a12,12,0,1,0,12,12A12,12,0,0,0,164,128Zm68.7,16a16.1,16.1,0,0,1-6.7,1.4,15.6,15.6,0,0,1-10-3.6V184a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V141.8a15.6,15.6,0,0,1-10,3.6,16.1,16.1,0,0,1-6.7-1.4,15.8,15.8,0,0,1-9.1-17.6L30.6,38.9A16.1,16.1,0,0,1,50.2,26.3L105,40h46l54.8-13.7a16.1,16.1,0,0,1,19.6,12.6l16.4,87.5A15.8,15.8,0,0,1,232.7,144ZM200,184V122L148.1,56H107.9L56,122v62a24.1,24.1,0,0,0,24,24h40V195.3l-13.7-13.6a8.1,8.1,0,0,1,11.4-11.4L128,180.7l10.3-10.4a8.1,8.1,0,0,1,11.4,11.4L136,195.3V208h40A24.1,24.1,0,0,0,200,184Z"></path>`,
				viewBox: 256
			},
			{
				name: "POINTS",
				altName: "Points",
				link: "/Town/Mateos",
				path: `<path d="M13,7H10A1,1,0,0,0,9,8v8a1,1,0,0,0,2,0V14h2a3,3,0,0,0,3-3V10A3,3,0,0,0,13,7Zm1,4a1,1,0,0,1-1,1H11V9h2a1,1,0,0,1,1,1ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"></path>`,
				viewBox: 24
			}
		];
	}
	getCache(type) {
		const cache = GM_getValue(`cache_${type}`);
		return cache === undefined ? null : cache;
	}
	setCache(type, cache) {
		GM_setValue(`cache_${type}`, cache);
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
		const curCache = this.getCache("Sicarios");
		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;
		if (curCache === null || this.timeFunc(now) !== this.timeFunc(curCache[0])) // New day
			this.setCache("Sicarios", [now]);
	}
	inCasinoSpinner(url) {
		const spinsLeft = document.querySelector("span#tokenCount");
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
		const refillDone = refillButton.classList.contains("disabled");

		const curCache = this.getCache("EnergyRefill");
		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;
		if (curCache === null || refillDone !== curCache[1] || this.timeFunc(now) !== this.timeFunc(curCache[0])) // New day
			this.setCache("EnergyRefill", [now, refillDone]);
	}
	inMateos(url) {
		const headerSections = document.querySelectorAll('.header-section');
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
	inAnywhere() {
		const now = Date.now() - this.hoursLate * 1000 * 60 * 60;
		const curRefillCache = this.getCache("EnergyRefill");
		const curSpinsCache = this.getCache("Spins");
		const curSicariosCache = this.getCache("Sicarios");
		const curPetsCache = this.getCache("Pets");
		const curMateosCache = this.getCache("MateosPoints");

		const done = [
			curRefillCache && this.timeFunc(now) === this.timeFunc(curRefillCache[0]) && curRefillCache[1],
			curSpinsCache && this.timeFunc(now) === this.timeFunc(curSpinsCache[0]) && curSpinsCache[1] === 0,
			curSicariosCache && this.timeFunc(now) === this.timeFunc(curSicariosCache[0]),
			curPetsCache && this.timeFunc(now) === this.timeFunc(curPetsCache[0]),
			curMateosCache && this.timeFunc(now) === this.timeFunc(curMateosCache[0]) && curMateosCache[1]
		];

		const mobileMenu = document.querySelector("ul#menu");
		const desktopMenu = document.querySelector("ul#desktopMenu");

		for (let i = 0; i < this.links.length; ++i) {
			const linkObj = this.links[i];
			if (done[i]) continue;
			
			const listItem = document.createElement("li");
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
}
