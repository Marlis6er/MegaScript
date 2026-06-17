// ==UserScript==
// @name         AP Megascript Public
// @namespace    Cartel Empire
// @version      1.0.27
// @description  A combination of multiple scripts, originally created by K9ER.
// @author       K9ER [781]
// @include      /https:\/\/cartelempire\.online\/?.*$/
// @icon         https://i.imgur.com/Zh7LX39.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==
 
// === Installation ===
// PC: just get Tampermonkey browser add-on
// Android: Violentmonkey browser add-on
// iOS: Userscripts
 
 
// === Some basic user options ===
const LINKS = [
	{
		name: "ITEM MARKET",
		altName: "Market",
		link: "/Market",
		path: `<path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z"></path>`,
		viewBox: "16"
	},
	{
		name: "STAT EST",
		altName: "Stat Ests",
		link: "/StatEstimates",
		path: `<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"></path>`,
		viewBox: "16"
	},
	{
		name: "HOSPITAL",
		altName: "Hospital",
		link: "/Hospital",
		path: `<path d="M6 0h4v4h4v4h-4v4h-4v-4H2V4h4V0z"/>`,
		viewBox: "16"
	},
	{
		name: "HIGHSCORES",
		altName: "Highscores",
		link: "/Highscores",
		path: `<path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"/>
  		<path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635z"/>`,
		viewBox: "16"
	}
];
const STRIKETHROUGH = false; // Display the normally-displayed price as well, striked-through
const ALWAYS_COLOR_NAMES = [ "FN SCAR-H", "Desert Eagle", "Full-Body Armour" ];
const DAYS = 7; // Number of days of production materials to stock up
// === End user options ===
 
let user_name = "";
let user_id = 0;
 
// Try to get user info from localStorage
let userInfo = getUserInfoFromStorage();
 
// If not found in localStorage, extract it from the page
if (!userInfo) {
    ({ user_name, user_id } = extractUserInfo()); // Extract and store
    userInfo = getUserInfoFromStorage(); // Try again after extraction
}
 
// Use extracted info in the script
if (userInfo) {
    user_name = userInfo.user_name;
    user_id = userInfo.user_id;
 
    const userInfoElement = document.querySelector("#user-info-display");
    if (userInfoElement) {
        userInfoElement.textContent = `Name: ${user_name}, ID: ${user_id}`;
    }
 
    console.info(`Final Name: ${user_name}, Final ID: ${user_id}`);
}
 
user_name = localStorage.getItem('user_name') || "";
user_id = localStorage.getItem('user_id') || 0;
 
 
class AddLinks {
	constructor(links) {
		this.links = links;
	}
 
	inAnywhere(url) {
		const mobileMenu = document.querySelector("ul#menu");
		const desktopMenu = document.querySelector("ul#desktopMenu");
 
		for (const linkObj of this.links) {
			const listItem = document.createElement("li");
			listItem.className = "flex-fill"; // Ensures proper desktop spacing
 
			listItem.innerHTML = this.svgTemplate(linkObj);
 
			if (mobileMenu) mobileMenu.appendChild(listItem.cloneNode(true));
			if (desktopMenu) desktopMenu.appendChild(listItem);
		}
	}

	svgTemplate(linkObj) {
		return `
				<a class="nav-link d-flex flex-column align-items-center px-md-0 px-2 leftNavLink" href="${linkObj.link}">
					<svg class="mb-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 ${linkObj.viewBox} ${linkObj.viewBox}">
						${linkObj.path}
					</svg>
					<span class="text-center">${linkObj.name}</span>
				</a>
			`;
	}
}
 
 
 
class BankDepositTax {
	constructor() {
		this.taxRate = 2.5;
		this.ID = "taxOnDeposit";
	}
	calc(val) {
		return `Deposit tax: \u00a3${Math.round(val / 100 * this.taxRate).toLocaleString("en-US")}`;
	}
	inBank(url) {
		const container = document.querySelector("div.text-center.d-flex.flex-column.align-items-center");
		if(container === null) return;

		const depositInput = container.querySelector("input#depositInput");
		let value = Math.floor(parseFloat(depositInput.value.replaceAll(',', "")));
 
		const row = container.querySelector("div.row");
		const breakHr = document.createElement("hr");
		breakHr.classList.add("w-75");
		container.insertBefore(breakHr, row);
 
		const tax = document.createElement("p");
		tax.id = this.ID;
		tax.classList.add("card-text", "text-muted", "mt-2");
		tax.innerHTML = this.calc(value);
		container.appendChild(tax);
 
		[ "autoNumeric:formatted", "input" ].forEach(eventType => {
			depositInput.addEventListener(eventType, e => {
				value = e.target.value === "" ? 0 : Math.floor(parseFloat(e.target.value.replaceAll(',', "")));
				tax.innerHTML = this.calc(value);
			});
		});
	}
}
 
 
class BetterItemValues {
	constructor(darkMode, strikethrough, alwaysColorNames) {
		this.brightness = darkMode ? 50 : 45;
		this.bestColor = `hsl(60, 100%, ${darkMode ? 70 : 40}%)`;
		this.strikethrough = strikethrough;
		this.alwaysColorNames = alwaysColorNames;
 
		this.pointName = "Supporter Points";
 
		const values = GM_listValues().filter(name => name.startsWith("value_")); // Prefill values first use
		if(values.length === 0) {
			const defaultVals = {
				"Walther P38": 2_200,
				"AK-47": 13_000,
				"M1911": 13_000,
				"M16A2 Rifle": 13_000,
				"S&W Magnum Revolver": 120_000,
				"MG34": 400_000,
				"Fragmentation Grenade": 24_999,
				"Stun Grenade": 18_000,
				"Illuminating Grenade": 9_999,
				"Flash Bang Grenade": 9_999,
				"Tear Gas Grenade": 18_000,
				"Covert Stab Vest": 75_000,
				"Tactical Plate Armour": 3_000_000,
				"Personal Favour": 170_000,
				"Supporter Pack": 9_500_000,
				"Corana Beer": 150_000,
				"Mexcal Beer": 438_000,
				"Blancoda Tequila": 847_000,
				"Repose Tequila": 1_850_000,
				"Anejo Tequila": 1_720_000,
				"Raicilla": 2_000_000,
				"Bandage": 3_999,
				"Small Medical Kit": 6_999,
				"Tainted Cannabis": 9_999,
				"Large Medical Kit": 16_000,
				"Basic Trauma Kit": 25_000,
				"Large Trauma Kit": 40_000,
				"Tainted Cocaine": 15_000,
				"Cannabis": 24_998,
				"Cocaine": 610_000,
				"Bag of Fertiliser": 19_000,
				"Coca Paste": 26_000,
				"Agave Heart": 53_000,
				"Concrete Bags": 89_000,
				"Nails": 124_900,
				"Bricks": 99_999,
				"Steel": 94_000,
				"Dog Food": 7_398,
				"Supporter Points": 34_899,
				"El Chapo's Head": 10_000_000,
				"Glock 18": 500_000,
				"Ballistic Vest": 100_000,
				"G36": 750_000,
				"Desert Eagle": 8_000_000
			}; // Players should go to the market to load up-to-date values, these are presets probably over half a year old
			for(var name in defaultVals)
				this.setValue(name, defaultVals[name]);
		}
 
		this.maxCokeDaily = 8;
		this.cokeODChance = 1; // percent
		this.taintedChance = [ 10, 20 ]; // percent
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
		this.narcoCounts = [ 1, 5, 25, 10, 60 ];
		this.prodMoney = [ 1_000, 0, 105_000, 70_000, 800000 ]; // Accurate
		this.prodCokeScaling = [ 1, 1.75, 2.3125, 2.734375 ]; // Source: screenshot in the Coke suggestions thread
		this.prodReqs = [ // NOTE: values no longer used, since courses can reduce requirements
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
			{ // Very likely accurate
				Bandage: this.doctorsOfficePerProd * 50 / 100,
				"Small Medical Kit": this.doctorsOfficePerProd * 30 / 100,
				"Large Medical Kit": this.doctorsOfficePerProd * 12.5 / 100,
				"Basic Trauma Kit": this.doctorsOfficePerProd * 5 / 100,
				"Large Trauma Kit": this.doctorsOfficePerProd * 2.5 / 100
			},
			{ // Accurate
				Cannabis: this.maxCannabis / 2 * (1 - this.taintedChance[0] / 100),
				"Tainted Cannabis": this.maxCannabis / 2 * this.taintedChance[0] / 100
			},
			{ // Distribution from 35 days with 14 stills
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
		this.jobMoney = [ 1_650, 14_000, 55_000, 250_000, 111, 111, 111, 260, 700_000, 2250000 ];
		// Base rep for standard jobs doubled with https://cartelempire.online/Forum/1/7289
		this.jobRep = [ 20, 150, 320, 980, 21, 50, 82, 165, 2_260, 4640 ];
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
 
		for(var item in this.energyItems) {
			const price = this.getValue(item);
			if (price === null) continue;

			const ppe = price / this.energyItems[item];
			this.poundPerEnergy[item] = ppe;
			this.maxPpe = Math.max(this.maxPpe, ppe);
			this.minPpe = Math.min(this.minPpe, ppe);
		}
		for(var item in this.hospitalItems) {
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
	}
    getValue(itemName) {
        let formattedName = `value_${itemName.replaceAll(' ', '_')}`;
        let val = GM_getValue(formattedName, null);
 
        // Fallback to old format if new format returns null
        if (val === null) {
            formattedName = `value_${itemName}`; // Try without replacing spaces
            val = GM_getValue(formattedName, null);
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
        if(itemSelector === null) return;
        const options = itemSelector.options;
 
        const pointPriceLabel = document.querySelector("#pricePerPointsLabel");
        const pointCurrentBest = document.createElement("span");
        pointCurrentBest.id = "pricePerPointsLabelCurrentBest";
        pointCurrentBest.classList.add("text-muted");
        let currentBest = this.getValue(this.pointName);
        pointCurrentBest.innerText = `(\u00a3${currentBest === null ? "???" : currentBest.toLocaleString("en-US")})`;
        pointPriceLabel.innerText += ' ';
        pointPriceLabel.appendChild(pointCurrentBest);
 
        const pricePerLabel = document.querySelector("#pricePerLabel");
        const priceCurrentBest = document.createElement("span");
        priceCurrentBest.id = "pricePerLabelCurrentBest";
        priceCurrentBest.classList.add("text-muted");
        let itemName = options[0].innerText;
        currentBest = this.getValue(itemName);
        priceCurrentBest.value = itemName;
        priceCurrentBest.innerText = `(\u00a3${currentBest === null ? "???" : currentBest.toLocaleString("en-US")})`;
        pricePerLabel.innerText += ' ';
        pricePerLabel.appendChild(priceCurrentBest);
 
        itemSelector.addEventListener("change", e => {
            for(var option of options) {
                if(option.value !== e.target.value) continue;

				itemName = option.innerText.trim().replace(/\s+-\s+\d+(?:\.\d+)?%$/, "");
				currentBest = this.getValue(itemName);
				priceCurrentBest.value = itemName;
				priceCurrentBest.innerText = `(\u00a3${currentBest === null ? "???" : currentBest.toLocaleString("en-US")})`;
				break;
			}
        });
 
        const container = document.querySelector("nav#itemMarketNav > div.tab-content");
 
        // Function to handle item processing
        function processItems() {
            const offerListWrappers = document.querySelectorAll(".offerListWrapper.mb-3");
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
				console.debug(`Found item: ${itemName}`);  // Debugging log

				const itemPriceText = card.querySelector("p.card-text.fst-italic").textContent.trim();
				const itemPrice = parseInt(itemPriceText.slice(1).split(' ')[0].replaceAll(',', ""));

				// Format key to match required format
				const key = `value_${itemName.replace(/\s+/g, '_')}`;

				// Use GM_getValue to retrieve the current best value
				const currentBest = GM_getValue(key, null);
				console.debug(`Current stored value for ${itemName}: ${currentBest}`);  // Debugging log

				if (currentBest === itemPrice) {
					console.debug(`No update needed for ${itemName}. Current: £${currentBest}, New: £${itemPrice}`);  // Debugging log
					return;
				}

				console.debug(`Updating value for ${itemName} from ${currentBest} to ${itemPrice}`);  // Debugging log
				GM_setValue(key, itemPrice);  // Store value with formatted key
				const newStoredValue = GM_getValue(key);
				console.debug(`New stored value for ${itemName}: ${newStoredValue}`);  // Debugging log

				// Ensure pointName and priceCurrentBest are defined
				if (typeof pointName !== 'undefined' && itemName === pointName) {
					pointCurrentBest.innerText = `(\u00a3${itemPrice.toLocaleString("en-US")})`;
				} else if (priceCurrentBest && priceCurrentBest.value === itemName) {
					priceCurrentBest.innerText = `(\u00a3${itemPrice.toLocaleString("en-US")})`;
				}
			} catch (error) {
				console.error(`Error processing card: ${error}`);
			}
		}
 
        // Observer to watch for changes in the market area and re-run the script
        function observeMarketChanges() {
            const targetNode = document.querySelector("#itemMarketNav");  // Adjust the selector as needed
            if (!targetNode) return;
 
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type !== "childList" || mutation.addedNodes.length <= 0)
						continue;
					console.info("Detected new nodes in market area, re-running item processing...");
					processItems();  // Re-run the script to process newly added items
                }
            });
 
            // Observe the target node for changes in children
            observer.observe(targetNode, { childList: true, subtree: true });
        }
 
        // Initial run to process any already loaded items
        processItems();
 
        // Start observing for dynamic changes
        observeMarketChanges();
 
 
        // Handle event card updates (unchanged)
        const eventCard = document.querySelector("div.contentColumn p.card-text.fw-bold.text-white");
        if (eventCard === null) return;
 
        const eventText = eventCard.innerText.split(" - ")[1];
        const textSplit = eventText.split(' ');
 
        if (textSplit[1] !== "listed") return;
		
		let i = 3;
		itemName = textSplit[i];
		while (textSplit[++i] !== "for") itemName += ` ${textSplit[i]}`;

		const val = parseInt(textSplit[textSplit.length - 1].slice(1).replace(',', ""));
		const curVal = this.getValue(itemName);

		if (curVal === null || val < curVal) this.setValue(itemName, val);
 
    }
	inSupporter(url) {
		const refillText = document.querySelector("div.card-body p.card-text:not(.fw-bold)");
		const pointPrice = this.getValue(this.pointName);
		if(pointPrice === null) return;

		refillText.innerHTML = `${refillText.innerText.slice(0, -1)} <span class="text-muted">(\u00a3${(pointPrice * 25).toLocaleString("en-US")})</span>.`;
	}
	inEstateAgent(url) {
		const buildReqs = document.querySelectorAll("div.row.pb-2");
 
		for(var i = 0; i < buildReqs.length; i += 2) {
			const buildReq = buildReqs[i];
			const matList = buildReq.children[1].children[1];
			const mats = matList.innerHTML.split("<br>");
			let totalCost = 0;
			for(let j = 0; j !== mats.length; ++j) {
				const mat = mats[j];
				const count = parseInt(mat.split(' ')[0].slice(1).replaceAll(',', ""));
				const val = this.getValue(mat.split(' ').slice(1).join(' ').trim());
				mats[j] = `${mat.trim()} <span class="text-muted">(\u00a3${val === null ? "???" : (count * val).toLocaleString("en-US")})</span>`;

				if(val === null) totalCost = "???";
				else if(totalCost !== "???") totalCost += count * val;
			}
			matList.innerHTML = mats.join("<br>");
			if(totalCost !== "???") {
				const cash = buildReq.children[2].children[1];
				totalCost += parseInt(cash.innerText.slice(1).replaceAll(',', ""));
			}
			buildReq.innerHTML += `<div class="col-6"><p class="fw-bold mb-0">Total Value:</p><p class="fw-bold text-muted">\u00a3${totalCost === "???" ? "???" : totalCost.toLocaleString("en-US")}</p></div>`;
		}
 
		const buildModal = document.querySelector("div#buildModal");
 
		observeDOM(buildModal, e => {
			const modal = e[1].target;
			const matList = modal.querySelectorAll("ul li");
 
			let changed = false;
			let totalCost = 0;
			for(var matDesc of matList) {
				const mat = matDesc.innerText;
				if(matDesc.children.length) continue;
				else if(mat[0] === '\u00a3') {
					totalCost += parseInt(mat.slice(1).replaceAll(',', ""));
					continue;
				}
				changed = true;
				const count = parseInt(mat.split(' ')[0].slice(0, -1).replaceAll(',', ""));
				const matName = mat.split(' ').slice(1).join(' ').trim();
				const val = this.getValue(matName === "Concrete" ? "Concrete Bags" : matName);
				matDesc.innerHTML = `${mat.trim()} <span class="text-muted">(\u00a3${val === null ? "???" : (count * val).toLocaleString("en-US")})</span>`;

				if(val === null) totalCost = "???";
				else if(totalCost !== "???") totalCost += count * val;
			}
			if(changed)
				modal.innerHTML += `<p class="fw-bold text-center mt-3">Total value: <span class="text-muted">\u00a3${totalCost === "???" ? "???" : totalCost.toLocaleString("en-US")}</span></p>`;
		});
	}
	inTownStore(url) {
		const itemLists = document.querySelectorAll("div.container.inventoryWrapper.mb-4");
 
		for(var il = 0; il !== itemLists.length; ++il) {
			const itemList = itemLists[il];
			for(var i = 1; i !== itemList.children.length; ++i) {
				const item = itemList.children[i];
				if(item.children.length < 2) continue;

				let selling = false;
				let itemName = "";
				if(item.children[1].children.length) {
					itemName = item.children[1].innerText.split(' ').slice(0, -1).join(' ');
					selling = true;
				} else
					itemName = item.children[1].innerText;
 
				const currentBest = this.getValue(itemName);
				if(currentBest === null) continue;

				const currentVal = parseInt(item.children[4].innerText.slice(1).replaceAll(',', ""));
				let shopHTML = item.children[4].innerHTML;
				if(currentVal > currentBest)
					shopHTML = `<span class="text-${selling ? "success" : "danger"}">${item.children[4].innerText}</span>`;
				else if(currentVal === currentBest && selling)
					shopHTML = `<span class="text-warning">${item.children[4].innerText}</span>`;
				const marketHTML = `<br><span class="text-muted">(\u00a3${currentBest.toLocaleString("en-US")})</span>`;

				item.children[4].innerHTML = shopHTML + marketHTML;
				const otherValueText = item.children[6].querySelector("div.col-6");
				otherValueText.innerHTML = `<div class="card-text"><div class="fw-bold">Value</div>${shopHTML}${marketHTML}</div>`;
			}
		}
	}
	inTradeView(url) {
		const tradeTabs = document.querySelectorAll("div.card-body:not(.text-center)");
		const totalVal = [ 0, 0 ];
 
		for(var i = 0; i !== 2; ++i) {
			const itemList = tradeTabs[i + 1].querySelector("div.table-responsive tbody");
			if(itemList !== null) {
				itemList.children[0].innerHTML += "<th>Value</th>";
 
				const items = itemList.querySelectorAll("tr.align-middle");
				for(var item of items) {
					const itemName = item.children[0].innerText;
					const val = this.getValue(itemName);
					const itemCount = parseInt(item.children[1].innerText.replaceAll(',', ""));
					item.innerHTML += `<td class="text-muted">\u00a3${val === null ? "???" : (val * itemCount).toLocaleString("en-US")}</td>`;
					if(val === null) {
						totalVal[i] = "???";
						break;
					}
					totalVal[i] += val * itemCount;
				}
				if(totalVal[i] === "???") continue;
			}
			const inputs = tradeTabs[i + 1].querySelectorAll("input.form-control");
			const pointVal = this.getValue(this.pointName);
			if(pointVal !== null) {
				totalVal[i] += pointVal * parseInt(inputs[1].value.replaceAll(',', ""));
				totalVal[i] += parseInt(inputs[0].value.replaceAll(',', ""));
			} else {
				totalVal[i] = "???";
				continue;
			}
			const properties = tradeTabs[i + 1].querySelectorAll("div.card.equipmentModule");
			for(var property of properties) {
				const propertyVal = property.querySelector("div.card-text");
				totalVal[i] += parseInt(propertyVal.innerText.slice(1).replaceAll(',', ""));
			}
		}
		if(totalVal[0] === "???" || totalVal[1] === "???")
			for(var i = 0; i !== 2; ++i) {
				const nameHeader = tradeTabs[i + 1].parentNode.querySelector("h2");
				nameHeader.outerHTML = `<h2 class="row"><div class="col">${nameHeader.innerText}</div><div class="col text-end text-muted">\u00a3${totalVal[i] === "???" ? "???" : totalVal[i].toLocaleString("en-US")}</div></h2>`;
			}
		else {
			const totalValSum = totalVal[0] + totalVal[1];
			for(var i = 0; i !== 2; ++i) {
				const nameHeader = tradeTabs[i + 1].parentNode.querySelector("h2");
				const colorVal = totalValSum === 0 ? 0.5 : totalVal[1 - i] / totalValSum;
				nameHeader.outerHTML = `<h2 class="row"><div class="col">${nameHeader.innerText}</div><div class="col text-end" style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">\u00a3${totalVal[i].toLocaleString("en-US")}</div></h2>`;
			}
		}
	}
	inAddItems(url) {
		let itemList = document.querySelector("div.container.inventoryWrapper");
		if(itemList === null) return;
 
		let buttonNode = itemList.parentNode.querySelector("div.contentColumn input.btn");
		const buttonHTML = buttonNode.outerHTML;
		let totalContainer = document.createElement("div");
		totalContainer.classList.add("card-body", "mb-4");
		totalContainer.innerHTML = `<p class="card-text">Total item value: <span id="totalValue" class="fw-bold">\u00a30</span>.${buttonHTML}</p>`;
		buttonNode.remove();
		itemList.parentNode.appendChild(totalContainer);
		let totalText = itemList.parentNode.querySelector("span#totalValue");
		let totalVals = {};
 
		itemList = itemList.children;
		for(var i = 1; i !== itemList.length; ++i) {
			let item = itemList[i];
			if(item.children.length < 2) continue;

			const itemName = item.children[1].innerText.split(' ').slice(0, -1).join(' ');
			const currentBest = this.getValue(itemName);
 
			let value = document.createElement("span");
			value.classList.add("itemValue", "text-muted", "float-end");
			value.innerText = `(\u00a3${currentBest === null ? "???" : currentBest.toLocaleString("en-US")})`;
			item.children[1].appendChild(value);
 
			let input = item.querySelector("input.form-control");
			input.addEventListener("input", e => {
				let value = e.target.parentNode.parentNode.querySelector("span.itemValue");
				const currentBest = this.getValue(itemName);
				const inputVal = e.target.value;
				let totalValue = 0;
				if(inputVal === "" || inputVal.trim()[0] === '-' || parseInt(inputVal) === 0) {
					value.classList.remove("fw-bold");
					value.classList.add("text-muted");
					value.style.color = null;
					value.innerText = `(\u00a3${currentBest === null ? "???" : currentBest.toLocaleString("en-US")})`;
					if(currentBest === null) return;

					totalVals[currentBest] = 0;
					for(var val in totalVals)
						totalValue += val * totalVals[val];
				} else {
					const count = parseInt(inputVal);
					value.classList.remove("text-muted");
					value.classList.add("fw-bold");
					value.style.color = this.bestColor;
					value.innerText = `(\u00a3${currentBest === null ? "???" : (currentBest * count).toLocaleString("en-US")})`;
					if(!currentBest) return;

					totalVals[currentBest] = count;
					for(var val in totalVals)
						totalValue += val * totalVals[val];
				}
				totalText.innerText = `\u00a3${totalValue.toLocaleString("en-US")}`;
			});
		}
	}
	inCartelArmory(url) {
		const container = document.querySelector("div.contentColumn > div.col-12");
 
 
        if (!container) {
            console.error("Container not found");
            return; // Exit the function early if the container doesn't exist
        }
		const cards = container.querySelectorAll("div.card.mb-4");
		const itemList = container.querySelector("div.container.inventoryWrapper").children;
		let totalVal = 0;
		let haveAll = true;
 
		for(var i = 2; i !== itemList.length; ++i) {
			let item = itemList[i];
			if(item.children.length < 2)
				continue;
			const itemText = item.children[1];
			const itemName = itemText.innerText.split(' ').slice(0, -1).join(' ');
			const countOf = parseInt(itemText.children[0].innerText.slice(2));
			const currentBest = this.getValue(itemName);
 
			let value = document.createElement("span");
			value.classList.add("itemValue", "text-muted", "float-end");
			value.innerText = `(\u00a3${currentBest === null ? "???" : (currentBest * countOf).toLocaleString("en-US")})`;
			itemText.appendChild(value);

			if(currentBest === null) haveAll = false;
			else totalVal += currentBest * countOf;
 
			if(this.alwaysColorNames.includes(itemName))
				item.children[1].style.color = this.bestColor;
			else if(itemName in this.poundPerEnergy) {
				if(this.poundPerEnergy[itemName] === this.minPpe)
					item.children[1].style.color = this.bestColor;
			} else if(itemName in this.poundPerHospitalTime)
				if(this.poundPerHospitalTime[itemName] === this.minPpht)
					item.children[1].style.color = this.bestColor;
		}
		const pointVal = this.getValue(this.pointName);
		if(pointVal !== null) {
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
	inEvents(url) {
		const urlParams = new URLSearchParams(window.location.search);
		const category = urlParams.get("filter");
		if(![ "All", "Production", "Jobs", "Casino", "Item Sending", "Expedition", "", null ].includes(category))
			return;
 
		const eventList = document.querySelector("div.container.eventWrapper").children;
 
		let profit = [];
		let maxProfit = 0;
		let minProfit = Infinity;
 
		for(var i = 2; i !== eventList.length; ++i) {
			const ev = eventList[i];
			const eventType = ev.children[0].innerText;
			const eventSplit = ev.children[1].innerText.split(' ');
 
			if(eventType === "Casino") {
				const finalWord = eventSplit[eventSplit.length - 1];
				let spinProfit = "---";
				let haveAll = true;
				if(finalWord === "nothing.")
					spinProfit = 0;
				else if(finalWord.endsWith("000."))
					spinProfit = parseInt(finalWord.slice(1, -1).replaceAll(',', ""));
				else if(finalWord === "Points.") {
					const countOf = parseInt(eventSplit[eventSplit.length - 2]);
					const pointVal = this.getValue(this.pointName);
					if(pointVal === null)
						haveAll = false;
					else
						spinProfit = countOf * pointVal;
				} else if(finalWord === "Pack.") {
					const pointVal = this.getValue("Supporter Pack");
					if(pointVal === null)
						haveAll = false;
					else
						spinProfit = pointVal;
				} else if(finalWord === "Favour.") {
					const pointVal = this.getValue("Personal Favour");
					if(pointVal === null)
						haveAll = false;
					else
						spinProfit = pointVal;
				}
				profit.push(haveAll ? spinProfit : "???");
				if(haveAll && spinProfit !== "---") {
					maxProfit = Math.max(maxProfit, spinProfit);
					minProfit = Math.min(minProfit, spinProfit);
				}
				continue;
			} else if(eventType === "Item Sending") {
				let itemsVal = "???";
				let j = eventSplit.length - 1;
				let accumulate = eventSplit[j].replace(/('s)?\.$/, "");
				while(!/\d$/.test(eventSplit[--j]))
					accumulate = `${eventSplit[j]} ${accumulate}`;
				const val = this.getValue(accumulate);
				const countOf = parseInt(eventSplit[j].slice(1).replaceAll(',', ""));
				if(val !== null)
					itemsVal = countOf * val;
				profit.push(itemsVal);
				continue;
			}
 
			if(![ "Production", "Jobs", "Expedition" ].includes(eventType) || eventSplit[0] === "Prestiged" || eventSplit[0] === "More" || eventSplit[1] === "were" || eventSplit[1] === "failed" || eventSplit[2] === "failed") {
				profit.push("---");
				continue;
			}
			let haveAll = true;
			let totalVal = 0;
			let countOf = 0;
			for(var j = 0; j < eventSplit.length; ++j) {
				const word = eventSplit[j];
				if(word.startsWith('\u00a3'))
					totalVal += parseInt(word.slice(1).replaceAll(',', ""));
				else if(eventType === "Expedition" ? word.endsWith('x') : word.startsWith('x')) {
					countOf = parseInt((eventType === "Expedition" ? word.slice(0, -1) : word.slice(1)).replaceAll(',', ""));
					let accumulate = eventSplit[++j];
					while(++j < eventSplit.length && !accumulate.endsWith(',') && !accumulate.endsWith('.') && !accumulate.endsWith(" and"))
						accumulate += ` ${eventSplit[j]}`;
					--j;
					if(accumulate.endsWith(',') || accumulate.endsWith('.'))
						accumulate = accumulate.slice(0, -1);
					else if(accumulate.endsWith(" and"))
						accumulate = accumulate.slice(0, -4);
					const val = this.getValue(accumulate);
					if(val === null) {
						haveAll = false;
						break;
					}
					totalVal += countOf * val;
				}
			}
			profit.push(haveAll ? totalVal : "???");
			if(haveAll) {
				maxProfit = Math.max(maxProfit, totalVal);
				minProfit = Math.min(minProfit, totalVal);
			}
		}
		for(var i = 1; i !== eventList.length; ++i) {
			const ev = eventList[i];
			ev.children[0].classList.value = "col-2 col-lg-2 col-md-3 col-sm-2"; //"col-2 col-lg-2 col-md-2 col-sm-2";
			ev.children[1].classList.value = "col-5 col-lg-6 col-md-6 col-sm-7"; //"col-6 col-lg-7 col-md-6 col-sm-7";
			ev.children[2].classList.value = "col-3 col-lg-2 d-none d-lg-inline"; //"col-3 col-lg-2 col-md-3 col-sm-2";
			let valueCol = document.createElement("div");
			let mergedCol = document.createElement("div");
			valueCol.classList.value = "col-2 col-lg-2 d-none d-lg-inline"; //"col-1 col-lg-1 col-md-1 col-sm-1";
			mergedCol.classList.value = "col-3 col-md-3 col-sm-3 d-lg-none"; // new
 
			if(i === 1) {
				valueCol.innerText = "Value";
				mergedCol.innerText = "Date/Value";
				ev.insertBefore(valueCol, ev.children[2]);
				ev.appendChild(mergedCol);
				continue;
			}
			const prof = profit[i - 2];
			if(prof === "---") {
				mergedCol.innerHTML = ev.children[2].innerHTML;
				ev.insertBefore(valueCol, ev.children[2]);
				ev.appendChild(mergedCol);
				continue;
			} else if(prof === "???")
				valueCol.innerHTML = `<span class="text-muted">\u00a3???</span>`;
			else if([ "Production", "Jobs", "Casino", "Expedition" ].includes(category)) {
				const colorVal = (prof - minProfit) / (maxProfit - minProfit);
				valueCol.innerHTML = `<span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">\u00a3${prof.toLocaleString("en-US")}</span>`;
			} else
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
        let assigned = [];
        let profit = [];
        let maxProfit = -Infinity;
        let minProfit = Infinity;
        for(let i = 0; i !== containers.length; ++i) {
            profit[i] = calcProfit.call(this, i, containers[i]);
            if(profit[i] === null) continue;
            maxProfit = Math.max(maxProfit, profit[i]);
            minProfit = Math.min(minProfit, profit[i]);
        }
 
        for(let i=0; i !== containers.length; ++i) {
            let container = containers[i];
            let expectedProfit = document.createElement("p");
            expectedProfit.classList.add("card-text", "text-center");
            if(profit[i] !== null) {
                const colorVal = (profit[i] - minProfit) / (maxProfit - minProfit);
                expectedProfit.innerHTML = `Profit: <span class="fw-bold" style="color: hsl(${profit[i] >= 0 ? colorVal * 120 : 0}, 67%, ${this.brightness}%)">\u00a3${Math.floor(profit[i]).toLocaleString("en-US")}/narco</span>`;
            } else
                expectedProfit.innerHTML = `Profit: <span class="text-muted">\u00a3???/narco</span>`;
            container.insertBefore(expectedProfit, container.querySelectorAll("hr")[1]);
 
            let narcoInput = containers[i].querySelector("input.assignNarcoInput");
            assigned[i] = parseInt(narcoInput.value.replaceAll(',', ""));
            narcoInput.id = `inputNum${i}`;
            narcoInput.addEventListener("input", assignedNarcosChange.bind(this));
        }
 
        // Calculate Expected Daily Profit
        const prodHeader = document.querySelector("#mainBackground > div > div > div.col-12 > div.productionsContainer.rounded > div.row.mb-0");
        let dailyProfit = calcDailyProfit(profit, assigned, containers);
 
        const flexContainer = constructProdHeader.call(this, dailyProfit, cokeVal);
 
        // Insert the flex container at the top of the target section
        prodHeader.parentNode.insertBefore(flexContainer, prodHeader);
 
        for (let i = 2; i < containers.length; i++) { // Start from index 2 to skip the first two
            let container = containers[i];
 
            // Get the "Narcos Assigned" input field
            let narcoInput = container.querySelector("input.assignNarcoInput");
            if (!narcoInput) {
                console.warn(`No narco input found for container ${i}`);
                continue;
            }
 
            // Get production ID if needed
            let productionIdElement = container.querySelector(".productionId");
            let productionId = productionIdElement ? productionIdElement.innerText.trim() : "Unknown";
 
            // Get supply items
            let requiredElement = container.querySelector("p.card-text.text-center.mb-0");
            let ownedElement = container.querySelector("p.card-text.text-center.fst-italic");
 
            let requiredText = requiredElement ? requiredElement.innerText.replace(/\D/g, "") : "N/A"; // Extract numbers only
            let ownedText = ownedElement ? ownedElement.innerText.replace(/\D/g, "") : "N/A"; // Extract numbers only
 
            let required = parseInt(requiredText);
            let owned = parseInt(ownedText);
 
            // Log extracted values
            console.info(`Production ID: ${productionId}`);
            console.info(`Required: ${requiredText}`);
            console.info(`Owned: ${ownedText}`);
            console.info(`Assigned Narcos: ${narcoInput.value}`);
 
            // Calculate days left
            let daysLeftElement = document.createElement("p");
            daysLeftElement.classList.add("card-text", "text-center");
 
            if (!isNaN(required) && !isNaN(owned) && required > 0) {
                let daysLeft = Math.floor(owned / required);
 
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

        function getPrestigeLevels(prestigeTable){
            const prestigeLevels = {productionBoost: 0, efficiency: 0, premiumProduction: 0};
            if(!prestigeTable) return prestigeLevels;

            for(const tr of prestigeTable.querySelectorAll('tr')){
                switch(tr.querySelector('td').textContent){
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
 
        function calcProfit(id, container){
            let narcoInput = container.querySelector("input.assignNarcoInput");
            assigned[id] = parseInt(narcoInput.value.replaceAll(',', ""));
            if(assigned[id] === 0) return 0;

            const prestigeTable = container.querySelector('div.table-responsive.production-table.mt-1');
            const prestigeLevels = getPrestigeLevels(prestigeTable);

            // Each level of 'Production Boost' prestige increases profit by 20%
            const profitBoost = 1 + prestigeLevels.productionBoost * 0.2;
 
            let profit = this.prodMoney[id] * profitBoost;
            const itemProfit = calcItemProfits.call(this, id) * profitBoost;
            if(itemProfit === null) return null;
            profit += itemProfit;
 
            let prodCount = getProdCount(container);
 
            profit *= calcProfitScalar.call(this, id, prodCount);

            // Each level of 'Efficiency' prestige reduces required supply by 10%
            const efficiency = 1 - prestigeLevels.efficiency * 0.1;
 
            const supplyCost = calcSupplyCost.call(this, id, prodCount, container) * efficiency;
            if(supplyCost === null) return null;
            profit -= supplyCost;
 
            profit *= this.prodProfitFactor;
            if(id === 0) profit *= this.streetProfitFactor;
            profit /= this.narcoCounts[id] * (id === 4 ? prodCount : 1); // Also dealing with coke custom scaling
            return profit;
        }
 
        function getProdCount(container){
            const prodCountText = container.querySelectorAll("tbody tr.align-middle th");
            if(prodCountText.length === 0) return 1;
            return parseInt(prodCountText[1].innerText) || 1;
        }
 
        function calcProfitScalar(id, prodCount){
            if(id === 4)
                return this.prodCokeScaling[prodCount - 1]; // Coke has custom scaling
            else
                return Math.pow(1 - this.prodDepreciation / 100, prodCount - 1); // Maybe should instead be *= (1 - prodCount * this.prodDepreciation / 100)
        }
 
        function calcItemProfits(id){
            let itemProfit = 0;
            for(const itemName of Object.keys(this.itemCounts[id])) {
                const itemVal = this.getValue(itemName);
                if(itemVal === null) return null;
                itemProfit += itemVal * this.itemCounts[id][itemName];
            }
            return itemProfit;
        }
 
        function calcSupplyCost(id, prodCount, container){
            const prodReqsText = container.querySelector("p.card-text.text-center.mb-0");
            const prodReqs = prodReqsText.innerText.split(' ').filter(w => w.startsWith('x'));
            let supplyCost = 0;
            let j = 0;
            for(let itemName of Object.keys(this.prodReqs[id])) {
                const itemVal = this.getValue(itemName);
                if(itemVal === null) return null;
                supplyCost += itemVal * parseInt(prodReqs[j].slice(1).replaceAll(',', "")) / (id === 4 ? 1 : prodCount);
                ++j;
            }
            return supplyCost;
        }
 
        function assignedNarcosChange(e){
            assigned[parseInt(e.target.id.slice(8))] = parseInt(e.target.value.replaceAll(',', ""));
            let dailyProfitText = document.querySelector("span#dailyProfit");
            let dailyProfitCokeText = document.querySelector("span#dailyProfitMinusCoke");
            let dailyProfit = calcDailyProfit(profit, assigned, containers);
 
            dailyProfitText.innerText = `\u00a3${dailyProfit === null ? "???" : Math.round(dailyProfit).toLocaleString("en-US")}`;
            if(dailyProfit === null) return;
            adjustColors(dailyProfitText, dailyProfit);
 
            const dailyProfitCoke = dailyProfit - this.maxCokeDaily * cokeVal;
            dailyProfitCokeText.innerText = `\u00a3${cokeVal === null ? "???" : Math.round(dailyProfitCoke).toLocaleString("en-US")}`;
            if(cokeVal === null) return;
            adjustColors(dailyProfitCokeText, dailyProfitCoke);
        }
 
        function calcDailyProfit(profit, assigned, containers){
            let dailyProfit = 0;
            for(var j = 0; j !== containers.length; ++j) {
                if(profit[j] === null && assigned[j]) return null;

                dailyProfit += profit[j] * assigned[j];
            }
            return dailyProfit;
        }
 
 
        function adjustColors(elem, value){
            elem.classList.remove("text-danger", "text-warning", "text-success");
            const className = value > 0 ? "text-success" : value < 0 ? "text-danger" : "text-warning";
            elem.classList.add(className);
        }
 
        function constructProdHeader(dailyProfit, cokeVal){
            // Create Expected Daily Profit card
            let expectedProfit = document.createElement("div");
            expectedProfit.classList.add("mb-4", "card");
            expectedProfit.innerHTML = `<div class="header-section"><h2>Expected Daily Profit</h2></div><div class="card-body"><p class="card-text text-center">Each day your narcos will produce roughly <span id="dailyProfit" class="fw-bold ${dailyProfit === null ? "text-muted" : dailyProfit > 0 ? "text-success" : dailyProfit < 0 ? "text-danger" : "text-warning"}">\u00a3${dailyProfit === null ? "???" : Math.round(dailyProfit).toLocaleString("en-US")}</span> in profit.<br>If you take ${this.maxCokeDaily} cocaine daily, your net profit is <span id="dailyProfitMinusCoke" class="fw-bold ${cokeVal === null || dailyProfit === null ? "text-muted" : dailyProfit - this.maxCokeDaily * cokeVal > 0 ? "text-success" : dailyProfit - this.maxCokeDaily * cokeVal < 0 ? "text-danger" : "text-warning"}">\u00a3${cokeVal === null || dailyProfit === null ? "???" : Math.round(dailyProfit - this.maxCokeDaily * cokeVal).toLocaleString("en-US")}</span> per day.</p></div>`;
 
            // Create Buy Production card
            let linkCard = document.createElement("div");
            linkCard.classList.add("mb-4", "card");
            linkCard.innerHTML = `<div class="header-section"><h2>Buy Production</h2></div><div class="card-body"><p class="card-text">Go to the <a class="text-white" href="/market?p=Production">Item Market</a> to buy production.</p><p></p></div>`;
 
            // Create a flex container to hold both cards
            let flexContainer = document.createElement("div");
            flexContainer.classList.add("d-flex", "align-items-stretch", "mb-4");
            flexContainer.style.justifyContent = "space-between";
 
            // Wrap each card with a flex item that can grow
            let leftFlexItem = document.createElement("div");
            leftFlexItem.classList.add("flex-grow-1", "me-2");
            leftFlexItem.appendChild(linkCard);
 
            let rightFlexItem = document.createElement("div");
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
		if(jobPanels === null || buttons.length <= 1) return;
 
		this.jobTimes = [];
		this.maxJobRep = 0;
		this.minJobRep = Infinity;
		this.jobValue = [];
		this.maxJobValue = 0;
		this.minJobValue = Infinity;
		for(var i = 0; i !== this.jobMoney.length; ++i) {
			const jobPanel = jobPanels[i];
			const jobTime = jobPanel.querySelector("p.card-text.fw-bold.text-muted");
			const jobTimeSplit = jobTime.innerText.split(' ');
			this.jobTimes[i] = parseFloat(jobTimeSplit[0].slice(1));
			if(jobTimeSplit[1].startsWith("hour")) {
				this.jobTimes[i] *= 60;
				if(jobTimeSplit.length > 2)
					this.jobTimes[i] += parseFloat(jobTimeSplit[2]);
			}
 
			this.jobValue[i] = this.jobMoney[i];
			for(var item in this.jobItems[i]) {
				const price = this.getValue(item);
				if(price !== null)
					this.jobValue[i] += price * this.jobItems[i][item];
				else {
					this.jobValue[i] = "???";
					break;
				}
			}

			// Apply only to standard jobs
			const standardJobRepBonus = i < 4 ? GM_getValue('perks_Standard Job Rep') || 0 : 0;
			if(this.jobValue[i] !== "???") {
				const prestigeText = jobPanel.querySelector("p.prestigeText");
				const incrReward = prestigeText !== null && /\+\d+%/.test(prestigeText.innerText) ? parseInt(prestigeText.innerText.match(/\+\d+%/)[0].slice(1, -1)) : 0;
				this.jobValue[i] *= 1 + incrReward / 100;
				this.jobRep[i] *= (1 + incrReward + standardJobRepBonus)  / 100;
 
				this.jobValue[i] *= this.jobProfitFactor;
				this.jobValue[i] /= this.jobTimes[i];
				this.maxJobValue = Math.max(this.maxJobValue, this.jobValue[i]);
				this.minJobValue = Math.min(this.minJobValue, this.jobValue[i]);
			}

			const standardJobRepBonus = GM_getValue('perk_Standard Job Rep');
			// Apply only to standard jobs
			if (i <= 4) this.jobRep[i] * (1 + (standardJobRepBonus / 100));

			this.maxJobRep = Math.max(this.maxJobRep, this.jobRep[i] / this.jobTimes[i]);
			this.minJobRep = Math.min(this.minJobRep, this.jobRep[i] / this.jobTimes[i]);
		}
 
		for(var i = 0; i !== this.jobValue.length; ++i) {
			let jobPanel = jobPanels[i];
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
	inInventory(url) {
		const itemList = document.querySelector("div.container.inventoryWrapper.pt-2");
		const header = itemList.querySelector("div.row.row-cols-3.row-header");
		let totalVal = 0;
		let haveAll = true;
 
		for(var i = 2; i < itemList.children.length; ++i) {
			const item = itemList.children[i];
			if(item.children.length < 7) continue;
			const nameSplit = item.children[1].innerText.split(' ');
			const itemName = nameSplit.slice(0, -1).join(' ');
 
			if(this.alwaysColorNames.includes(itemName))
				item.children[1].style.color = this.bestColor;
 
			const countOf = parseInt(nameSplit[nameSplit.length - 1].slice(1).replaceAll(',', ""));
			const currentBest = this.getValue(itemName);
			if(currentBest !== null) {
				let val = null;
				let colorVal = null;
				let append = null;
				if(itemName in this.poundPerEnergy) {
					val = this.poundPerEnergy[itemName];
					colorVal = (1 - (val - this.minPpe) / (this.maxPpe - this.minPpe)) * 120;
					append = 'E';
					if(val === this.minPpe)
						item.children[1].style.color = this.bestColor;
				} else if(itemName in this.poundPerHospitalTime) {
					val = this.poundPerHospitalTime[itemName];
					colorVal = (1 - (val - this.minPpht) / (this.maxPpht - this.minPpht)) * 120;
					append = "min";
					if(val === this.minPpht)
						item.children[1].style.color = this.bestColor;
				}
 
				const valueTexts = [ item.children[3], item.children[6].querySelectorAll("div.card-text > div.card-text")[2] ];
				for(var valueText of valueTexts) {
					valueText.innerHTML = this.strikethrough ? `<del>${valueText.innerText}</del><br><span class="fw-bold">` : "<span>";
					valueText.innerHTML += `\u00a3${currentBest.toLocaleString("en-US")}</span>`;
					if(val !== null)
						valueText.innerHTML += ` <span style="color: hsl(${colorVal}, 67%, ${this.brightness}%)">(\u00a3${Math.round(val).toLocaleString("en-US")}/${append})</span>`;
				}
				totalVal += currentBest * countOf;
			} else {
				totalVal += parseInt(item.children[3].innerText.slice(1).replaceAll(',', "")) * countOf;
				haveAll = false;
			}
		}
 
		let totalValCard = document.createElement("div");
		totalValCard.classList.add("card-body", "mb-2");
		totalValCard.innerHTML = `<p class="card-text">The value of these items is ${haveAll ? "" : "roughly "}<span class="fw-bold">\u00a3${totalVal.toLocaleString("en-US")}</span>.</p>`;
		itemList.insertBefore(totalValCard, header);
	}
    inGym(url) { // Run after addItemButtons
        const item = document.getElementById(`item-${GM_getValue("itemID_Coke")}`);
        if(item === null)
            return;
        const val = this.poundPerEnergy["Cocaine"];
        const colorVal = (1 - (val - this.minPpe) / (this.maxPpe - this.minPpe)) * 120;
        const valueTexts = [ item.children[3], item.children[5].querySelectorAll("div.card-text > div.card-text")[2] ];
        for(var valueText of valueTexts)
            if(valueText !== undefined && valueText !== null)
                valueText.innerHTML = `<span>${valueText.innerText}</span> <span style="color: hsl(${colorVal}, 67%, ${this.brightness}%)">(\u00a3${Math.round(val).toLocaleString("en-US")}/E)</span>`;
}
    inUniversity(url) { // Run after addItemButtons
        const item = document.getElementById(`item-${GM_getValue("itemID_Coke")}`);
        if(item === null)
            return;
        const val = this.poundPerEnergy["Cocaine"];
        const colorVal = (1 - (val - this.minPpe) / (this.maxPpe - this.minPpe)) * 120;
        const valueTexts = [ item.children[3], item.children[5].querySelectorAll("div.card-text > div.card-text")[2] ];
        for(var valueText of valueTexts)
            if(valueText !== undefined && valueText !== null)
                valueText.innerHTML = `<span>${valueText.innerText}</span> <span style="color: hsl(${colorVal}, 67%, ${this.brightness}%)">(\u00a3${Math.round(val).toLocaleString("en-US")}/E)</span>`;
}
}
 
 
class BetterMoneyInputs {
	constructor() {}
	_changeAutonumeric(input) {
		let elem = AutoNumeric.getAutoNumericElement(input);
		elem.update({
			decimalPlaces: 3,
			decimalPlacesRawValue: 0,
			decimalPlacesShownOnBlur: 0,
			allowDecimalPadding: false,
			alwaysAllowDecimalCharacter: true
		});
	}
	changeAutonumeric(input) {
		if(AutoNumeric.isManagedByAutoNumeric(input))
			this._changeAutonumeric(input);
		else
			input.addEventListener("autoNumeric:initialized", () => this._changeAutonumeric(input));
	}
	_listener(e, input, max) {
		let elem = AutoNumeric.getAutoNumericElement(input);
		const curVal = parseFloat(elem.get().replaceAll(',', ""));
		if(e.ctrlKey)
			return;
		if(e.key === 'k')
			elem.set(Math.min(max, Math.floor(curVal * 1000)));
		else if(e.key === 'm')
			elem.set(Math.min(max, Math.floor(curVal * 1000000)));
		else if(e.key === 'b')
			elem.set(Math.min(max, Math.floor(curVal * 1000000000)));
		else if(e.key === 'a')
			elem.set(max);
		else if(e.key === 'h')
			elem.set(Math.floor(max / 2));
	}
	listener(e, input) {
		const max = parseInt(input.max.replaceAll(',', ""));
		if(AutoNumeric.isManagedByAutoNumeric(input))
			this._listener(e, input, max);
		else
			input.addEventListener("autoNumeric:initialized", () => this._listener(e, input, max));
	}
	update(input) {
		this.changeAutonumeric(input);
		input.addEventListener("keydown", e => this.listener(e, input));
	}
	inBank(url) {
		let depositInput = document.querySelector("input#depositInput");
		let withdrawInput = document.querySelector("input#withdrawInput");
		if(depositInput === null) return;

		this.update(depositInput);
		this.update(withdrawInput);
	}
	inCartelArmory(url) {
		let pointsDeposit = document.querySelector("input#pointsdepositquantity");
		if(pointsDeposit === null) return;

		this.update(pointsDeposit);
	}
	inTradeView(url) {
		let cashInput = document.querySelector("input#cashModifier");
		let pointsInput = document.querySelector("input#pointsModifier");
		if(cashInput === null || cashInput.disabled) return;

		this.update(cashInput);
		this.update(pointsInput);
	}
	inMarket(url) {
		let pricePer = document.querySelector("input#priceper");
		let pointsPricePer = document.querySelector("input#pointspriceper");
		let qty = document.querySelector("input#quantity");
		let pointsQty = document.querySelector("input#pointsquantity");
		if(pricePer === null) return;

		this.update(pricePer);
		this.update(pointsPricePer);
		this.update(qty);
		this.update(pointsQty);
 
		pointsPricePer.min = 0; // Make it like pricePer
		if(AutoNumeric.isManagedByAutoNumeric(pointsPricePer)) {
			let elem = AutoNumeric.getAutoNumericElement(pointsPricePer);
			elem.update({ minimumValue: 0 });
		} else
			pointsPricePer.addEventListener("autoNumeric:initialized", () => {
				let elem = AutoNumeric.getAutoNumericElement(pointsPricePer);
				elem.update({ minimumValue: 0 });
			});
	}
	inUserProfile(url) {
		let sendCash = document.querySelector("input#sendCashInput");
		if(sendCash === null) return;

		this.update(sendCash);
	}
}
 
 
class BetterProgressBars {
    constructor() {
        this.healthColor = `hsl(230, 75%, 60%)`;
        this.setReloadInterval();
    }
 
    setReloadInterval() {
        // Get the current time in UTC
        const now = new Date();
        const minutes = now.getUTCMinutes();
        const seconds = now.getUTCSeconds();
 
        // Calculate the minutes remaining until the next 5-minute interval
        const nextInterval = 500 - (minutes % 500);
        const timeToNextInterval = (nextInterval * 60 - seconds) * 1000;
 
        // Set a timeout to reload the page at the next 5-minute interval
        setTimeout(() => {
            window.location.reload();
        }, timeToNextInterval);
    }
 
    inExpeditions(url) {
        const bars = document.querySelectorAll(".progress-bar-striped");
        for (var bar of bars) bar.classList.remove("bg-success");
    }
 
    inJobs(url) {
        const bars = document.querySelectorAll("div.equipmentModule .progress-bar");
        for (var bar of bars) {
            const val = parseFloat(bar.getAttribute("aria-valuenow"));
            bar.classList.remove("bg-success");
            bar.classList.add("progress-bar-striped");
            bar.style.backgroundColor = `hsl(${val / 100 * 120}, 67%, 30%)`;
        }
        const buttons = document.querySelectorAll("div.equipmentModule form > .btn.w-100:not(#upgradeTimeButton):not(#upgradeRewardButton)");
        if (buttons.length === 1) {
            let bar = buttons[0].parentNode.parentNode.querySelector(".progress-bar");
            bar.classList.add("progress-bar-animated");
        }
    }
 
    inBarPage(url) {
        const bars = document.querySelectorAll(".progress-bar.bg-dark");
        for (var bar of bars) {
            bar.classList.remove("bg-dark");
            bar.classList.add("fs-6");
        }
    }
 
    inAnywhere() {
        const healthTimer = document.getElementById("lifeCountdown");
        const energyTimer = document.getElementById("energyCountdown");
 
        let healthBar = document.getElementById("lifeProgress");
        healthBar.classList.add("progress-bar-striped");
        let energyBar = document.getElementById("energyProgress");
        energyBar.classList.add("progress-bar-striped");
 
        observeDOM(healthTimer, e => {
            const text = e[0].addedNodes[0];
            if (text === "")
                healthBar.classList.remove("progress-bar-animated");
            else
                healthBar.classList.add("progress-bar-animated");
        });
 
        observeDOM(energyTimer, e => {
            const text = e[0].addedNodes[0];
            if (text === "")
                energyBar.classList.remove("progress-bar-animated");
            else
                energyBar.classList.add("progress-bar-animated");
        });
 
        const energyPercent = parseFloat(energyBar.style.width.slice(0, -1));
        const energyColor = Math.min(15, 150 / (109 - energyPercent));
        GM_addStyle(`#lifeProgress { background-color: ${this.healthColor} !important }`);
        GM_addStyle(`#energyProgress { background-color: hsl(${50 - energyColor}, 100%, 51.37%) !important }`);
    }
}
 
 
class BlackjackHelper {
	constructor() {
		this.statsRegex = /^casino\/blackjackstats(\/|\/?\?.+)?/;
		this.id = "totalProfit";
		this.statsLink = "/Casino/blackjackStats";
		if(this.getStats() === null)
			this.setStats([ 0, 0, 0, 0, 0, 0, 0, 0 ]);
		if([ null, NaN ].includes(this.getMoneyStat("Profit")))
			this.setMoneyStat("Profit", 0);
		if([ null, NaN ].includes(this.getMoneyStat("Gain")))
			this.setMoneyStat("Gain", 0);
		if([ null, NaN ].includes(this.getMoneyStat("Loss")))
			this.setMoneyStat("Loss", 0);
		this.statIndexes = [ "Blackjack", "Win", "Lose", "Bust", "Surrendered", "Push", "Times split", "Times doubled" ];
		this.cardVals = [ '2', '3', '4', '5', '6', '7', '8', '9', 'K', 'A' ];
		// https://www.beatingbonuses.com/bjstrategy.php?decks2=4&h17=stand&doubleon2=any2cards&peek2=off&surrender2=earlyf&charlie2=no&dsa2=on&resplits2=0&shuffle=0&bj=3to2&opt2=1&btn2=Generate+Strategy
 		this.houseOdds = -0.17; // percent
		this.blackjackBroken = true; // 1.5x payout instead of push when both get blackjack
		this.normalTable = [ // First row is 5-7, last row is 18+
			"HHHHHHHHHR",
			"HHHHHHHHHH",
			"HDDDDHHHHH",
			"DDDDDDDDHH",
			"DDDDDDDDHH",
			"HHSSSHHHHR",
			"SSSSSHHHHR",
			"SSSSSHHHRR",
			"SSSSSHHHRR",
			"SSSSSHHRQR",
			"SSSSSSSSSQ",
			"SSSSSSSSSS"
		];
		this.softTable = [
			"HHHDDHHHHH",
			"HHHDDHHHHH",
			"HHDDDHHHHH",
			"HHDDDHHHHH",
			"HDDDDHHHHH",
			"SEEEESSHHH",
			"SSSSSSSSSS",
			"SSSSSSSSSS",
			"SSSSSSSSSS" // Custom
		];
		this.splitTable = [
			"HHPPPPHHHH",
			"HHPPPPHHHR",
			"HHHHHHHHHH",
			"DDDDDDDDHH",
			"HPPPPHHHHR",
			"PPPPPPHHRR",
			"PPPPPPPPQR",
			"PPPPPSPPSS",
			"SSSSSSSSSS",
			"PPPPPPPPPP"
		];
	}
	getMoneyStat(stat) {
		const money = GM_getValue(`blackjack_${stat}`);
		return money === undefined ? null : money;
	}
	setMoneyStat(stat, money) {
		GM_setValue(`blackjack_${stat}`, money);
		console.debug(`Set blackjack_${stat} to \u00a3${money.toLocaleString("en-US")}`);
		return money;
	}
	getStats() {
		const stats = GM_getValue("blackjack_Stats");
		return stats === undefined ? null : stats;
	}
	setStats(stats) {
		GM_setValue("blackjack_Stats", stats);
		console.debug(`Set blackjack_${stats} to ${JSON.stringify(stats)}`);
		return stats;
	}
	addProfit(val) {
		const setTo = this.getMoneyStat("Profit") + val;
		// Not sure why this is happening
		if(isNaN(setTo)) return;

		this.setMoneyStat("Profit", setTo);
		if(val > 0)
			this.setMoneyStat("Gain", this.getMoneyStat("Gain") + val);
		else
			this.setMoneyStat("Loss", this.getMoneyStat("Loss") - val);
 
		let profitText = document.querySelector(`span#${this.id}`);
		profitText.innerText = `\u00a3${setTo.toLocaleString("en-US")}`;
		if(setTo > 0) {
			profitText.classList.remove("text-warning", "text-danger");
			profitText.classList.add("text-success");
		} else if(setTo < 0) {
			profitText.classList.remove("text-warning", "text-success");
			profitText.classList.add("text-danger");
		} else {
			profitText.classList.remove("text-success", "text-danger");
			profitText.classList.add("text-warning");
		}
	}
	addStat(gameType) {
		if(!this.statIndexes.includes(gameType)) return;

		let curStats = this.getStats();
		curStats[this.statIndexes.indexOf(gameType)] += 1;
		this.setStats(curStats);
	}
	inBlackjack(url) {
		GM_addStyle(".click-this { background-color: #0d6efd !important; border: var(--bs-btn-border-width) solid #0d6efd !important }");
 
		const container = document.querySelector("#mainBackground > div > div > div.col-12");
		let ellen = container.querySelector("div.card.mb-3");
		if(ellen === null)
			return;
		ellen.classList.remove("mb-3");
		ellen.outerHTML = `<div class="row"><div class="col-xl-9 col-12 mb-4">${ellen.outerHTML}</div><div class="col-xl-3 col-12 mb-4"><div class="card h-100"><div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Total Profit</h2></div></div></div><div class="card-body"><p class="card-text text-center">Total running profit: <span id="${this.id}" class="fw-bold text-warning">\u00a3???</span>.</p><p class="card-text text-center"><span class="fs-2 text-${this.houseOdds > 0 ? "danger" : this.houseOdds < 0 ? "success" : "warning"}">${this.houseOdds.toFixed(2)}%</span> house odds</p></div></div></div></div>`;
		this.addProfit(0);
 
		let statsLink = document.createElement("a");
		statsLink.href = this.statsLink;
		statsLink.innerHTML = `<button class="btn btn-sm btn-dark">Stats</button>`;
		const linkContainer = container.querySelector("div.gap-2.flex-wrap");
		const rulesLink = linkContainer.querySelector("a");
		linkContainer.insertBefore(statsLink, rulesLink);
 
		const dealButton = container.querySelector("button#deal");
		const betAmountInput = container.querySelector("input#betAmountInput");
		let hitButton = container.querySelector("button#hit");
		if(hitButton === null)
			return;
		let standButton = container.querySelector("button#stand");
		let doubleButton = container.querySelector("button#double");
		let splitButton = container.querySelector("button#split");
		let surrenderButton = container.querySelector("button#surrender");
		const result = container.querySelector("div#result");
		const bjGame = container.querySelector("div#blackjackGame");
		const dealerCards = bjGame.querySelector("div#dealerCards");
		const playerCards = bjGame.querySelector("div#playerCards");
 
		const removeHighlights = () => {
			for(var button of [ hitButton, standButton, doubleButton, splitButton, surrenderButton ])
				button.classList.remove("click-this");
		};
 
		observeDOM(bjGame, () => {
			removeHighlights();
			const dealerCardText = dealerCards.innerText.replace(/10|J|Q/g, "K");
			if(dealerCardText.length !== 1) return;

			const dealerVal = this.cardVals.indexOf(dealerCardText) + 2;
			let playerCardText = playerCards.innerText.replace(/\s+/g, '').replace(/10|J|Q/g, "K");
			if(playerCardText.length < 2) return;

			let playerVal = 0;
			for(var l of playerCardText)
				playerVal += this.cardVals.indexOf(l) + 2;
 
			let move = "";
			if(playerCardText.length === 2) {
				if(playerCardText[0] === playerCardText[1]) {
					if(!splitButton.disabled)
						move = this.splitTable[playerVal / 2 - 2][dealerVal - 2];
				} else if(playerCardText[0] === 'A' || playerCardText[1] === 'A') {
					if(playerVal === 21) {
						if(!standButton.disabled) move = 'S';
					} else
						move = this.softTable[playerVal - 11 - 2][dealerVal - 2];
				}
			}
			if(move === "" && playerCardText.includes('A') && playerVal <= 21)
				move = this.softTable[playerVal - 11 - 2][dealerVal - 2];
			if(move === "") {
				while(playerCardText.includes('A') && playerVal > 21) {
					playerVal -= 10;
					playerCardText.replace('A', 'a');
				}
				playerCardText.replaceAll('a', 'A');
				move = this.normalTable[Math.min(11, Math.max(0, playerVal - 7))][dealerVal - 2];
			}
 
			const hl = button => button.classList.add("click-this");
			if(move === 'H')
				hl(hitButton);
			else if(move === 'J')
				hl(playerCardText.length === 2 ? hitButton : standButton);
			else if(move === 'S')
				hl(standButton);
			else if(move === 'D')
				hl(doubleButton.disabled ? hitButton : doubleButton);
			else if(move === 'E')
				hl(doubleButton.disabled ? standButton : doubleButton);
			else if(move === 'P')
				hl(splitButton);
			else if(move === 'R')
				hl(surrenderButton.disabled ? hitButton : surrenderButton);
			else if(move === 'Q')
				hl(surrenderButton.disabled ? standButton : surrenderButton);
		});
 
		let doubled = false;
		const applyBet = () => {
			const betAmount = parseInt(betAmountInput.value.replaceAll(',', ""));
			this.addProfit(-betAmount);
		};
		doubleButton.addEventListener("click", () => {
			doubled = true;
			applyBet();
			this.addStat("Times doubled");
		});
		splitButton.addEventListener("click", () => {
			applyBet();
			this.addStat("Times split");
		});
		dealButton.addEventListener("click", applyBet.bind(this));
		observeDOM(result, e => {
			const val = e[0].target.innerText;
			if(val === "") return;

			let betAmount = parseInt(betAmountInput.value.replaceAll(',', ""));
			if(doubled) betAmount *= 2;

			if(val.startsWith("Win") || val.startsWith("Blackjack")) {
				e[0].target.classList.add("text-success");
				e[0].target.classList.remove("text-warning", "text-danger");
				const textSplit = val.split(' ');
				const won = parseInt(textSplit[textSplit.length - 1].slice(1).replaceAll(',', ""));
				this.addProfit(betAmount + won);
			} else if(val === "Push") {
				e[0].target.classList.add("text-warning");
				e[0].target.classList.remove("text-success", "text-danger");
				this.addProfit(betAmount);
			} else if(val === "Surrendered") {
				e[0].target.classList.add("text-warning");
				e[0].target.classList.remove("text-success", "text-danger");
				this.addProfit(Math.floor(betAmount / 2));
			} else {
				e[0].target.classList.add("text-danger");
				e[0].target.classList.remove("text-warning", "text-success");
			}
			doubled = false;
			this.addStat(val.split(' ')[0].replace('!', ""));
		});
	}
	inBlackjackStats(url) {
		document.title = "Blackjack Stats | Cartel Empire";
		let container = document.querySelector("div.content-container.contentColumn");
		let insertHTML = "";
 
		const urlParams = new URLSearchParams(window.location.search);
		const reset = urlParams.get("resetMoney");
		if(reset === "true") {
			this.setMoneyStat("Profit", 0);
			this.setMoneyStat("Gain", 0);
			this.setMoneyStat("Loss", 0);
			window.history.replaceState({}, document.title, this.statsLink); // remove params from URL
		}
 
		let colorClass = "text-warning";
		const curProfit = this.getMoneyStat("Profit");
		const curGain = this.getMoneyStat("Gain");
		const curLoss = this.getMoneyStat("Loss");
		if(curProfit) {
			if(curProfit > 0) colorClass = "text-success";
			else if(curProfit < 0) colorClass = "text-danger";
		}
		const curStats = this.getStats();
		let totalGames = 0;
		for(var gameCount of curStats) totalGames += gameCount;
		for(var i = 0; i !== curStats.length; ++i)
			insertHTML += `<tr class="align-middle"><td>${this.statIndexes[i]}</td><td>${curStats[i]}</td><td>${(curStats[i] / totalGames * 100).toFixed(2)}%</td></tr>`;
		insertHTML += `<tr class="align-middle"><td>Hands played</td><td>${totalGames}</td><td></td></tr><tr class="align-middle"><td>Total gain</td><td>\u00a3${curGain !== null ? curGain.toLocaleString("en-US") : 0}</td><td></td></tr><tr class="align-middle"><td>Total loss</td><td>\u00a3${curLoss !== null ? curLoss.toLocaleString("en-US") : 0}</td><td></td></tr><tr class="align-middle"><th>Net total profit</th><th class="${colorClass}">\u00a3${curProfit ? curProfit.toLocaleString("en-US") : 0}</th><td></td></tr><tr class="align-middle"><td>Reset money stats</td><td></td><td><button onclick="window.location.href += '?resetMoney=true'" title="Reset" aria-label="Reset money stats" class="btn btn-danger action-btn fw-normal">Reset</button></td></tr>`;
 
		const tableHTML = `<div class="mb-4 card"><div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Blackjack Stats</h2></div></div></div><div class="card-body"> <div class="table-responsive"><table class="table align-items-center table-flush dark-tertiary-bg" id="blackjackStatsTable"><thead class="thead-light"><tr><th scope="col">Value</th><th scope="col">Count</th><th scope="col">Chance</th></tr></thead><tbody>${insertHTML}</tbody></div></div></div>`;
		container.innerHTML = `<div class="col-12 col-md-10"><div class="gap-2 d-flex justify-content-md-end mb-2 flex-wrap"><a href="/Casino/Blackjack"><button class="btn btn-sm btn-dark">Back to Blackjack </button></a></div>${tableHTML}</div>`;
	}
}
 
 
class BuyPointsLink {
    constructor() {
        this.add = `<div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Buy Points</h2></div></div></div><div class="card-body"><p class="card-text">Go to the <a class="text-white" href="/market?p=Points">Item Market</a> to buy points.</p></div>`;
    }
 
    inSupporter(url) {
        // Find the container (updated from the previous class names)
        let container = document.querySelector("div.col-12"); // Adjust this selector if needed
 
        // Find the cards in the container (adjust this according to the new structure of your cards)
        const cards = container.querySelectorAll("div.card.mb-4");
 
        // Create a new card to be inserted
        let linkCard = document.createElement("div");
        linkCard.classList.add("mb-4", "card");
        linkCard.innerHTML = this.add;
 
        // Find the third last card (or modify this logic if needed)
        const refillCard = cards[cards.length - 3];
 
        // Insert the new card before the refill card
        container.insertBefore(linkCard, refillCard);
    }
}
 
 
 
class CenterTabs {
	constructor() {}
	inNavTabPlace(URL) {
		let tabs = document.querySelectorAll(".nav-tabs");
		for(const tab of tabs) tab.classList.add("nav-justified");

		GM_addStyle(".nav-tabs .nav-link.active { border-bottom: 3px solid #0d6efd !important }");
	}
}
 
 
class CenterText {
	constructor() {}
	inTown(url) {
		const places = document.querySelectorAll("div.equipmentModule p.card-text.flex-grow-1");
		for(const place of places) place.classList.add("text-center");
	}
	inAnywhere() {
		const chatRows = document.querySelector("div.chats.row");
		const chatObserver = e => {
			for(const ev of e) {
				if(ev.target !== chatRows) continue;

				for(const addedChat of ev.addedNodes) {
					let header = addedChat.querySelector("div.header h6");
					header.classList.add("text-center");
				}
			}
		};
		observeDOM(chatRows, chatObserver);
 
		const headers = chatRows.querySelectorAll("div.header h6");
		for(const header of headers) header.classList.add("text-center");
	}
}
 
 
class DisableThrow {
	constructor() {
		this.throwText = "Throw Away";
	}
	inInventory(url) {
		const buttons = document.querySelectorAll("button.btn.action-btn.ms-1.float-end");
		for (const button of buttons) {
			if(button.title !== this.throwText) continue;

			button.setAttribute("disabled", true);
		}
	}
}
 
 
class DPEnergyRefillReminder {
	constructor() {}
	inSupporter(url) {
		let modalText = document.querySelector("#useRefillConfirm p.card-text.modal-bodyText");

		const modalObserver = e => {
			const textSplit = e[0].target.innerText.split(' ');
			const option = textSplit[textSplit.length - 1];
			if(option !== "Energy?") return;

			if(document.querySelector("#maxEnergy").innerText !== "200")
				modalText.innerHTML += `<br><span class="text-warning">Your max energy isn't 200!</span>`;
			else if(document.querySelector("#currentEnergy").innerText !== "0")
				modalText.innerHTML += `<br><span class="text-danger">Your current energy isn't 0!</span>`;
		};
		observeDOM(modalText, modalObserver);
	}
}
 
 
class EstateLevelInfo {
	constructor(darkMode) {
		this.brightness = darkMode ? 50 : 45;
 
		this.prefixes = [ "", "", '\u00a3', '-', '+', '+', '+' ];
		this.postfixes = [ "", "", 'M', '%', '%', " INT", '%' ];
		this.values = [
			[],                                       // Plot cost, nothing to process here
			[],                                       // Best house type, nothing to process here
			[ 0, 10, 50, 150, 250, 500, 2000, 5000 ], // Max safe, between 0 and 5bil
			[ 0, 1, 2, 4, 6, 8, 10 ],                 // Uni course time reduction, between 0% and 10%
			[ 0, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75 ],    // Gym bonus, between 0% and 0.75%
			[ 0, 50, 100, 150, 200 ],                 // Intelligence cap bonus, between 0 and 200 int
			[ 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.75 ]      // Int gain bonus, between 0% and 0.75%
		];
	}
	inEstateAgent(url) {
		const containers = document.querySelectorAll("#v-content-plots div.accordion-body");
 
		for(let i = 0; i < containers.length; ++i) {
			const container = containers[i];
			const numbers = container.querySelectorAll("div.col-6 p:not(.mb-0)");
			for(let j = 2; j < numbers.length; ++j) {
				let numberP = numbers[j];
				const number = parseInt(numberP.textContent);
				const val = this.values[j][number];
				if(val === undefined) return;

				const colorVal = val / this.values[j][this.values[j].length - 1];
				numberP.innerHTML += ` <span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">(${this.prefixes[j]}${val.toLocaleString("en-US")}${this.postfixes[j]})</span>`;
			}
		}
	}
}
 
 
class ExpeditionChances {
	constructor() {}
	inExpeditions(URL) {
		const teamStats = this.getTeamStats();

		const expeds = document.querySelectorAll(".expeditionButton");
		for(const exped of expeds) {
			// Skip active missions
			if(exped.children.length < 5) continue;

			const teamChances = this.getTeamChances(exped, teamStats);

			teamChances.forEach((c, i) => {
				console.debug(`Success chance of team ${i+1}: ${c * 100}`);
			});
			
			this.updateUI(exped, teamChances);
		}
	}
	getTeamStats() {
		const teamStats = [ [], [], [], [], [] ];
		for(let team_i = 0; team_i < teamStats.length; team_i++) {
			const stats = document.querySelectorAll(`#v-content-team${team_i + 1} > .justify-content-center span:not(.fw-bold)`);
			if(stats.length !== 4) return;

			for(const statElem of stats) {
				const statText = statElem.textContent.replaceAll(',', "");
				const stat = parseInt(statText);
				teamStats[team_i].push(stat);
			}
		}
		return teamStats;
	}
	getTeamChances(exped, teamStats) {
		const chances = [ 1, 1, 1, 1, 1 ];
		const statElements = exped.querySelectorAll(`div.col-5 > div.card-text`);

		// Don't factor in speed (last value) since it only affects expedition time not success rate
		for(let i = 0; i < 3; ++i) {
			const statText = statElements[i].textContent.replaceAll(',', "");
			const stat = parseInt(statText);
			for(const team_i in chances)
				chances[team_i] = Math.min(chances[team_i], teamStats[team_i][i] / stat);
		}
		return chances;
	}
	updateUI(exped, chances) {
		const options = exped.querySelectorAll("select.expeditionTeamSelector option");
		for(const opt of options) {
			const team_i = parseInt(opt.value);
			if(team_i === 0) continue;

			opt.textContent += ` - ${Math.floor(chances[team_i - 1] * 100)}%`;
		}
	}
}
 
 
class GreenMoney {
    constructor() {
        this.color = "hsl(95, 100%, 25%)"; // Default color
        this.inAnywhere(); // Automatically run inAnywhere when the class is defined
    }
 
    inAnywhere() {
        // List of class names to handle
        ["currentCashDesktop", "cashDisplay"].forEach(className => {
            // Find the cash elements
            let cash = document.querySelector(`span.${className}`);
 
            if (cash === null) return;

			// Apply color to the cash amount
			cash.style.color = this.color;

			// Determine the parent element for context
			let parentElement = cash.closest('li') || cash.closest('.row');

			if (!parentElement) return;

			// Case 1: Handle £ in the same element
			if (parentElement.textContent.includes('£')) {
				parentElement.innerHTML = parentElement.innerHTML.replace(/£/, `<span style="color: ${this.color};">£</span>`);
			}

			// Case 2: Handle £ as a sibling element
			let poundSymbol = parentElement.querySelector('span, p')?.previousSibling;
			if (poundSymbol && poundSymbol.nodeType === Node.TEXT_NODE && poundSymbol.textContent.includes('£')) {
				poundSymbol.textContent = poundSymbol.textContent.replace('£', `£`);
				poundSymbol.style.color = this.color;
			}
        });
    }
}
 
 
class HighlightExcessHealth {
	constructor() {}
	inUserProfile(url) {
		const trs = document.querySelectorAll("table.table tbody tr");
		if(trs.length < 6) return;

		let lifeTd = trs[5].children[1];
		const life = lifeTd.innerText;
		const curHealth = parseInt(life.split(" / ")[0].replaceAll(',', ""));
		const maxHealth = parseInt(life.split(" / ")[1].replaceAll(',', ""));
		if(curHealth > maxHealth) lifeTd.classList.add("text-danger", "fw-bold");
	}
}
 
 
class HighlightInactives {
	constructor() {
		this.yellowBy = 1; // in days
		this.redBy = 2; // in days
	}
	inCartel(url) { // Run after stat estimates
		const table = document.querySelector("div.card-body > div.container-fluid");
		let rows = table.querySelectorAll(".row.align-middle");
 
		for(const row of rows) {
			const cols = row.querySelectorAll(".col:not(.fw-bold)");
			let activity = cols[cols.length - 2];
			if(!activity.innerText.endsWith("days ago") && !activity.innerText.endsWith("day ago"))
				return;
			const days = parseInt(activity.innerText.match(/\d+/)[0]);
			if(days >= this.redBy)
				activity.classList.add("text-danger");
			else if(days >= this.yellowBy)
				activity.classList.add("text-warning");
		}
	}
}
 
 
class HighlightUnequipped {
	constructor(darkMode) {}
	inInventory(url) {
		let titles = document.querySelectorAll("h6.card-title");
 
		for(const title of titles) {
			if(title.innerText !== "None") continue;
			title.classList.add("fw-bold", "text-danger");
		}
	}
	inProduction(url) {
		let idle = document.querySelector("p.idleNarcos");
		if(idle === null) return;
		const setColor = text => {
			if(text === "0") idle.classList.remove("fw-bold", "text-danger");
			else idle.classList.add("fw-bold", "text-danger");
		};
		setColor(idle.innerText);
		observeDOM(idle, e => setColor(e[0].target.innerText));
	}
}
 
 
class IntPerWeek {
	constructor(darkMode) {
		this.brightness = darkMode ? 50 : 45;
 
		this.stats = window.location.href[window.location.href.length - 1] === '2';
	}
	inUniversityPage(url) {
		const courses = document.querySelectorAll("div#classAccordion div.accordion-item");
		let intPerDay = [];
		let maxIpd = 0;
		let minIpd = Infinity;
 
		for(const course of courses) {
			const data = course.children[1].children[0];
			const length = parseInt(data.children[0].children[1].children[1].innerText.split(' ')[2]);
			const intGainText = data.children[1].children[1].children[1].innerHTML.match(/\d+\s/g);
			let intGain = 0;
			for(const text of intGainText) intGain += parseInt(text);

			// One course gives int rather than stats
			if(this.stats && data.children[1].children[1].children[1].innerHTML.includes("intelligence"))
				intGain = 0;
 
			const ipd = 7 * intGain / length;
			intPerDay.push(ipd);
			maxIpd = Math.max(maxIpd, ipd);
			minIpd = Math.min(minIpd, ipd);
		}
 
		for(let i = 0; i !== courses.length; ++i) {
			const ipd = intPerDay[i];
			const colorVal = (ipd - minIpd) / (maxIpd - minIpd);
			const { children } = courses[i].children[0].children[0];
			children[children.length - 1].children[0].innerHTML += ` <span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">(${ipd.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${this.stats ? "stats" : "INT"}/week)</span>`
		}
	}
}
 
 
class LargerGymGraph {
	constructor() {
		this.newHeight = 400;
		this.factor = 1.12;
	}
	inGym(url) {
		const container = document.querySelector("div#graphContainer div.card-body div");
		if(container === null) return;

		container.style.maxHeight = `${this.newHeight * this.factor}px`;
		const graph = container.querySelector("canvas#gymGraph");
		graph.style.height = `${this.newHeight * this.factor}px`;
		graph.height = this.newHeight;
	}
}
 
 
class RedLeaveCourseButton {
	constructor() {
		this.redClassName = "bg-danger";
	}
	inUniversity(url) {
		const leaveButtons = document.querySelectorAll("button.leaveCourseBtn");
		for(const button of leaveButtons)
			button.classList.add(this.redClassName);
	}
}
 
 
class RemoveOwnStatus {
    // Immediately execute the static method upon class definition
    static {
		init();

		function init(){
			// Find the "Status" label and its corresponding row
			const labels = Array.from(document.querySelectorAll("p.fw-bold"));
			const statusLabel = labels.find(label => label.textContent.trim() === 'Status');
			const statusRow = statusLabel ? statusLabel.closest('.row') : null;
			if (!statusRow) return;

			// Find and remove the cells containing the "Status" label and value
			const statusLabelIndex = Array
				.from(statusRow.children)
				.findIndex(child => child.textContent.trim() === 'Status');
			if (statusLabelIndex < 0) return;

			statusRow.children[statusLabelIndex].remove(); // Remove the label's parent container
			if (!statusRow.children[statusLabelIndex]) return;

			statusRow.children[statusLabelIndex].remove(); // Remove the value's container
		}
    }
}
 
 
class RoundedCards {
	constructor() {}
	inAnywhere() {
		GM_addStyle(".contentColumn .card.border-success > .card-body.bg-success, .contentColumn .card.border-danger > .card-body.bg-danger, .contentColumn .card.border-warning > .card-body.bg-warning { border-radius: 10px !important }");
	}
}
 
 
class ScriptSettings {
	constructor() {
		this.name = "megascript-settings";
		this.fullName = "Megascript Settings";
	}
	inSettings(URL) {
		let navTabs = document.querySelector("#settingsNav .nav-tabs");
		let tabContent = document.querySelector("#settingsNav .tab-content");
		if(navTabs === null || tabContent === null) return;
 
		const urlParams = new URLSearchParams(window.location.search);
		const selected = urlParams.get("t") === this.name;
 
		let button = document.createElement("button");
		button.id = `v-tab-${this.name}`;
		button.classList.add("nav-link", "settings-nav-link");
		if(selected) button.classList.add("active");

		button.setAttribute("data-bs-toggle", "tab");
		button.setAttribute("data-bs-target", `#v-content-${this.name}`);
		button.type = "button";
		button.role = "tab";
		button.setAttribute("aria-controls", `v-content-${this.name}`);
		button.setAttribute("aria-selected", selected.toString());
		button.setAttribute("tab", this.name);
		if(!selected) button.setAttribute("tabindex", "-1");

		button.innerText = this.fullName;
		navTabs.append(button);
		let tab = document.createElement("div");
		tab.classList.add("tab-pane", "fade");
		if(selected) tab.classList.add("active", "show");

		tab.id = `v-content-${this.name}`;
		tab.setAttribute("role", "tabpanel");
		tab.setAttribute("aria-labelledby", `v-tab-${this.name}`);
		tab.innerHTML = `<div class="card"><div class="card-body"> <h5 class="h5">${this.fullName}</h5><p class="card-text">Currently there's no toggleable script settings.</p></div></div>`;
		tabContent.appendChild(tab);
	}
}
 
 
class TotalListingValue {
	constructor() {}
	inMarket(url) {
		const ownOffers = document.querySelector(".offerListWrapper");
		if(ownOffers === null) return;

		const header = ownOffers.querySelector("div.row.row-cols-3.row-header");
 
		let totalVal = 0;
		for(let i = 1; i < ownOffers.children.length; ++i) {
			const item = ownOffers.children[i];
			if(item.children.length < 5) continue;
			const val = parseInt(item.children[2].innerText.slice(1).replaceAll(',', ""));
			const countOf = parseInt(item.children[4].innerText.replaceAll(',', ""));
			totalVal += val * countOf;
		}
 
		const totalValCard = document.createElement("div");
		totalValCard.classList.add("card-body", "mb-2");
		totalValCard.innerHTML = `<p class="card-text">The total value of your listings is <span class="fw-bold">\u00a3${totalVal.toLocaleString("en-US")}</span>.</p>`;
		ownOffers.insertBefore(totalValCard, header);
	}
}
 
 
class TransparentChats {
	constructor() {}
	inAnywhere() {
		GM_addStyle("div.chats.row label.chat-btn { opacity: 0.9 }");
	}
}
 
 
class TrueKDR {
	constructor() {}
	inHomepage(url) {
		const stats = document.querySelectorAll(".col-md-6.d-flex.align-items-stretch.col-xxl-4");
		if(stats.length < 2) return;
 
		const table = stats[1].querySelector("div.row.align-items-center.gy-2.mb-2:nth-of-type(2)");
		const lambda = idx => parseInt(table.children[idx].children[0].innerText.replaceAll(',', ""));
		let totalW = lambda(3) + lambda(7);
		let totalL = lambda(5) + lambda(9);
 
        const descriptionText = document.createElement("div");
        descriptionText.className = "col-4";
        descriptionText.innerHTML = '<p class="profileLabel">True K/D</p>';
		table.insertBefore(descriptionText, table.children[2]);
 
        const trueKD = document.createElement("div");
        trueKD.className = "col-8";
        trueKD.innerHTML = `<p class="form-data-inset p-2 mb-0 rounded d-flex">${totalW} / ${totalL}</p>`;
        table.insertBefore(trueKD, table.children[3]);
    }
}
 
 
 
(function(links, strikethrough, alwaysColorNames, days) {
	const URL = window.location.href.split(/\/|\?/g).slice(3).join('/').replace(/#[^\?\/]*$/, "").toLowerCase() || "home";
	const darkMode = document.querySelector("html").getAttribute("data-bs-theme") === "dark";
	const addItemButtons = new AddItemButtons();
	const addLinks = new AddLinks(links);
	const bankDepositTax = new BankDepositTax();
	const betterItemValues = new BetterItemValues(darkMode, strikethrough, alwaysColorNames);
	const betterMoneyInputs = new BetterMoneyInputs(); // INACTIVATED
	const betterProgressBars = new BetterProgressBars();
	const blackjackHelper = new BlackjackHelper();
	const buyPointsLink = new BuyPointsLink();
	const cartelMemberRep = new CartelMemberRep(); // INACTIVATED
	const centerTabs = new CenterTabs();
	const centerText = new CenterText();
	const colorChatNames = new ColorChatNames(user_id);
	const colorStats = new ColorStats(darkMode);
	const disableThrow = new DisableThrow();
	const displayPerks = new DisplayPerks();
	const displayTownCaches = new DisplayTownCaches(darkMode);
	const dpEnergyRefillReminder = new DPEnergyRefillReminder();
	const estateLevelInfo = new EstateLevelInfo(darkMode);
	const estimatedIntGains = new EstimatedIntGains(darkMode);
	const expeditionChances = new ExpeditionChances();
	const greenMoney = new GreenMoney();
	const highlightExcessHealth = new HighlightExcessHealth();
	const highlightInactives = new HighlightInactives();
	const highlightUnequipped = new HighlightUnequipped();
	const highscoreChanges = new HighscoreChanges();
	const intPerWeek = new IntPerWeek(darkMode);
	const itemCache = new ItemCache(darkMode, days);
	const largerGymGraph = new LargerGymGraph();
	const propertyPageAgentLink = new PropertyPageAgentLink();
	const redLeaveCourseButton = new RedLeaveCourseButton();
	const removeOwnStatus = new RemoveOwnStatus();
	const roundedCards = new RoundedCards();
	const scriptSettings = new ScriptSettings();
	const statEstimate = new StatEstimate(darkMode, user_id, user_name);
	const totalListingValue = new TotalListingValue();
	const transparentChats = new TransparentChats();
	const trueKDR = new TrueKDR();
 
 
	if(/^gym\/?$/.test(URL)) {
		// In the gym
		statEstimate.inGym(URL);
		colorStats.inGym(URL);
		displayPerks.inGym(URL);
		addItemButtons.inGym(URL);
		betterItemValues.inGym(URL);
		largerGymGraph.inGym(URL);
	} else if(/^university\/?$/.test(URL)) {
		// In the university main page
		colorStats.inUniversity(URL);
		redLeaveCourseButton.inUniversity();
		addItemButtons.inUniversity(URL);
		betterItemValues.inUniversity(URL);
		estimatedIntGains.inUniversity(URL);
	} else if(/^university\/[132]\/?$/.test(URL)) {
		// In a university course pages
		intPerWeek.inUniversityPage(URL);
		redLeaveCourseButton.inUniversity();
	} else if(/^jail\/?$/.test(URL)) {
		// In the jail
		addItemButtons.inJail(URL);
	} else if(/^bank\/?$/.test(URL)) {
		// In the bank
		bankDepositTax.inBank(URL);
		//betterMoneyInputs.inBank(URL);
	} else if(/^expedition/.test(URL)) {
		// In the expeditions page
		expeditionChances.inExpeditions(URL);
		centerTabs.inNavTabPlace(URL);
		betterProgressBars.inExpeditions(URL);
	} else if(/^market/.test(URL)) {
		// In the market
		itemCache.inMarket(URL);
		displayPerks.inMarket(URL);
		colorStats.inMarket(URL);
		betterItemValues.inMarket(URL);
		totalListingValue.inMarket(URL);
		centerTabs.inNavTabPlace(URL);
		colorChatNames.inMarket(URL);
		//betterMoneyInputs.inMarket(URL);
	} else if(/^supporter\/?$/.test(URL)) {
		// On the Supporter main page
		betterItemValues.inSupporter(URL);
		buyPointsLink.inSupporter(URL);
		displayTownCaches.inSupporter(URL);
		dpEnergyRefillReminder.inSupporter(URL);
	} else if(/^town\/?$/.test(URL)) {
		// In the town main page
		centerText.inTown(URL);
		displayTownCaches.inTown(URL);
	} else if(/^town\/estateagent\/?/.test(URL)) {
		// In the estate agent
		betterItemValues.inEstateAgent(URL);
		estateLevelInfo.inEstateAgent(URL);
		betterProgressBars.inBarPage(URL);
		centerTabs.inNavTabPlace(URL);
	} else if(/^town\/pharmacy\/?$/.test(URL)) {
		// In the pharmacy
		betterItemValues.inTownStore(URL);
		displayPerks.inPharmacy(URL);
    } else if(/^town\/club\/?$/.test(URL)) {
		// In Julio's club
		displayTownCaches.inSicarios(URL);
    } else if(/^town\/mateos\/?$/.test(URL)) {
        // In Mateo's
        displayTownCaches.inMateos(URL);
	} else if(/^town\/.+\/?$/.test(URL)) {
		// In a town store other than the estate agent or pharmacy
		betterItemValues.inTownStore(URL);
	} else if(/^petshop\/?$/.test(URL)) {
		// In the petshop
		betterItemValues.inTownStore(URL);
		displayTownCaches.inPetshop(URL);
	} else if(/^trade\/view/.test(URL)) {
		// Viewing a trade
		betterItemValues.inTradeView(URL);
		//betterMoneyInputs.inTradeView(URL);
	} else if(/^trade/.test(URL)) {
		// In the trade list
		colorChatNames.inTrade(URL);
	} else if(/^trade\/additems/.test(URL)) {
		// Adding items to a trade
		betterItemValues.inAddItems(URL);
	} else if(/^cartel\/\d+\/?$/.test(URL)) {
		// In someone else's cartel homepage
		statEstimate.inBountyOrOtherCartel(URL);
		colorChatNames.inBountyOrOtherCartel(URL);
	} else if(/^cartel\/?$/.test(URL)) {
		// In the cartel homepage
		highlightInactives.inCartel(URL);
		//statEstimate.inCartelHomepage(URL);
		//cartelMemberRep.inCartelHomepage(URL);
	} else if(/^cartel\/armou?ry\/deposit\/?$/.test(URL)) {
		// Adding items to cartel armoury
		betterItemValues.inAddItems(URL);
	} else if(/^cartel\/armou?ry/.test(URL)) {
		// Viewing the cartel armoury
		betterItemValues.inCartelArmory(URL);
		//betterMoneyInputs.inCartelArmory(URL);
	} else if(/^cartel\/territory\/?$/.test(URL)) {
		// In cartel war page
		statEstimate.inCartelWar(URL);
	} else if(/^cartel\/perks\/?$/.test(URL)) {
		// In the cartel perks page
		betterProgressBars.inBarPage(URL);
		centerTabs.inNavTabPlace(URL);
	} else if(/^cartel\/allfights/.test(URL)) {
		// In the cartel fight log
		//cartelMemberRep.inAttackLog(URL);
	} else if(/^events/.test(URL)) {
		// On an events page
		betterItemValues.inEvents(URL);
		statEstimate.inEvents(URL);
	} else if(/^production\/?$/.test(URL)) {
		// On the productions page
		betterItemValues.inProduction(URL);
		highlightUnequipped.inProduction(URL);
		itemCache.inProduction(URL);
	} else if(/^jobs\/?$/.test(URL)) {
		// In the jobs page
		betterItemValues.inJobs(URL);
		itemCache.inJobs(URL);
		betterProgressBars.inJobs(URL);
	} else if(/^inventory/.test(URL)) {
		// In the inventory
		addItemButtons.inInventory(URL);
		itemCache.inInventory(URL);
		colorStats.inInventory(URL);
		displayPerks.inInventory(URL);
		disableThrow.inInventory(URL);
		betterItemValues.inInventory(URL);
		highlightUnequipped.inInventory(URL);
	} else if(/^casino\/?$/.test(URL)) {
		// In the casino main page
		displayTownCaches.inCasino(URL);
	} else if(/^casino\/spinner\/?$/.test(URL)) {
		// In the casino wheel spinner
		displayTownCaches.inCasinoSpinner(URL);
	} else if(/^casino\/blackjack\/?$/.test(URL)) {
		// In casino blackjack
		blackjackHelper.inBlackjack(URL);
	} else if(blackjackHelper.statsRegex.test(URL)) {
		// In the blackjack stats page
		blackjackHelper.inBlackjackStats(URL);
	} else if(/^highscores/.test(URL)) {
		// On a highscores page
		highscoreChanges.inHighscores(URL);
		colorStats.inHighscores(URL);
		centerTabs.inNavTabPlace(URL);
	} else if(/^(home|user)\/?$/.test(URL)) {
		// On the homepage
		displayPerks.inHomepage(URL);
		statEstimate.inHomepage(URL);
		colorStats.inHomepage(URL);
		trueKDR.inHomepage(URL);
	} else if(/^user\/\d+\/?$/.test(URL)) {
		// Viewing someone's profile
		highlightExcessHealth.inUserProfile(URL);
		statEstimate.inUserProfile(URL);
		//betterMoneyInputs.inUserProfile(URL);
		colorChatNames.inUserProfile(URL);
	} else if(/^user\/stats/.test(URL)) {
		// In personal stats
		colorStats.inPersonalStats(URL);
	} else if(/^property\/?$/.test(URL)) {
		// On own property page
		propertyPageAgentLink.inProperty(URL);
		betterProgressBars.inBarPage(URL);
		centerTabs.inNavTabPlace(URL);
	} else if(statEstimate.statEstimateRegex.test(URL)) {
		// On the custom stat estimate page
		statEstimate.inStatEstimate(URL);
	} else if(/^(advanced)?search/.test(URL)) {
		// On the search page
		statEstimate.inSearch(URL);
	} else if(/^bounty/.test(URL)) {
		// In the bounty list page
		statEstimate.inBountyOrOtherCartel(URL);
		colorChatNames.inBountyOrOtherCartel(URL);
	} else if(/^fight/.test(URL)) {
		// Viewing attack log
		statEstimate.inFight(URL);
	} else if(/^connections$/.test(URL)) {
		// In the friends & enemies page
		colorChatNames.inConnections(URL);
	} else if(/^forum\/\d+\/\d+|^forum\/thread\/\d+/.test(URL)) {
		// In a forum post
		colorChatNames.inForumPost(URL);
		colorStats.inForumPost(URL);
	} else if(/^forum\/\d+/.test(URL)) {
		// In a forum category
		colorChatNames.inForumCategory(URL);
	} else if(/^inbox|^outbox/.test(URL)) {
		// In inbox/outbox
		colorChatNames.inMail(URL);
	} else if(/^settings/.test(URL)) {
		// In the settings page
		centerTabs.inNavTabPlace(URL);
		scriptSettings.inSettings(URL);
	}
 
	addLinks.inAnywhere();
	betterProgressBars.inAnywhere();
	centerText.inAnywhere();
	colorChatNames.inAnywhere();
	displayTownCaches.inAnywhere();
	greenMoney.inAnywhere();
	roundedCards.inAnywhere();
	transparentChats.inAnywhere();
 
	return darkMode; // Just for confusion for decompilers
})(LINKS, STRIKETHROUGH, ALWAYS_COLOR_NAMES, DAYS);