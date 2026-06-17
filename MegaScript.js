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
    }
 
    inAnywhere() {
        // List of class names to handle
        ["currentCashDesktop", "cashDisplay"].forEach(className => {
            // Find the cash elements
            const cash = document.querySelector(`span.${className}`);
 
            if (cash === null) return;

			// Apply color to the cash amount
			cash.style.color = this.color;

			// Determine the parent element for context
			const parentElement = cash.closest('li') || cash.closest('.row');

			if (!parentElement) return;

			// Case 1: Handle £ in the same element
			if (parentElement.textContent.includes('£')) {
				parentElement.innerHTML = parentElement.innerHTML.replace(/£/, `<span style="color: ${this.color};">£</span>`);
			}

			// Case 2: Handle £ as a sibling element
			const poundSymbol = parentElement.querySelector('span, p')?.previousSibling;
			if (poundSymbol && poundSymbol.nodeType === Node.TEXT_NODE
				&& poundSymbol.textContent.includes('£')
			) poundSymbol.style.color = this.color;
        });
    }
}
 
 
class HighlightExcessHealth {
	constructor() {}
	inUserProfile(url) {
		const trs = document.querySelectorAll("table.table tbody tr");
		if(trs.length < 6) return;

		const lifeTd = trs[5].children[1];
		const life = lifeTd.textContent;
		const curHealth = parseInt(life.split(" / ")[0].replaceAll(',', ""));
		const maxHealth = parseInt(life.split(" / ")[1].replaceAll(',', ""));
		if(curHealth > maxHealth)
			lifeTd.classList.add("text-danger", "fw-bold");
	}
}
 
 
class HighlightInactives {
	constructor() {
		this.yellowBy = 1; // in days
		this.redBy = 2; // in days
	}
	inCartel(url) { // Run after stat estimates
		const table = document.querySelector("div.card-body > div.container-fluid");
		const rows = table.querySelectorAll(".row.align-middle");
 
		for(const row of rows) {
			const cols = row.querySelectorAll(".col:not(.fw-bold)");
			const activity = cols[cols.length - 2];
			if(!activity.textContent.endsWith("days ago")
				&& !activity.textContent.endsWith("day ago")
			) continue;
			
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
		const titles = document.querySelectorAll("h6.card-title");
 
		for(const title of titles) {
			if (['Fists', 'None', 'No Armour'].includes(title.textContent))
				title.classList.add("fw-bold", "text-danger");
		}
	}
	inProduction(url) {
		const idle = document.querySelector("p.idleNarcos");
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
			const body = course.querySelector('div.accordion-collapse > div.accordion-body');
			const lengthElem = body.querySelector('div.row.pb-4 > div.col-6 > p.card-text:nth-of-type(2)');
			const length = parseInt(lengthElem.textContent.split(' ')[2]);
			const intGainElem = body.querySelector('div:nth-child(2) > div:nth-child(2) > p:nth-child(2)');
			const intGainText = intGainElem.textContent.match(/\d+\s/g);
			let intGain = 0;
			for(const text of intGainText) intGain += parseInt(text);

			// One combat course gives int rather than stats; ignore it
			if(this.stats && intGainElem.textContent.includes("intelligence"))
				intGain = 0;
 
			const ipd = 7 * intGain / length;
			intPerDay.push(ipd);
			maxIpd = Math.max(maxIpd, ipd);
			minIpd = Math.min(minIpd, ipd);
		}
		
		this.updateUI(courses, intPerDay, minIpd, maxIpd);
	}

	updateUI(courses, intPerDay, minIpd, maxIpd) {
		for(let i = 0; i < courses.length; ++i) {
			const ipd = intPerDay[i];
			const colorVal = (ipd - minIpd) / (maxIpd - minIpd);
			const infoTextElem = courses[i].querySelector('h2 > button > div:last-of-type > span');
			infoTextElem.innerHTML += ` <span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">(${ipd.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${this.stats ? "stats" : "INT"}/week)</span>`
		}
	}
}
 
 
class LargerGymGraph {
	constructor() {
		this.newHeight = 400;
		this.factor = 1.12;
	}
	inGym(url) {
		const container = document.querySelector("div#graphContainer > div.card-body > div");
		if(container === null) return;

		container.style.maxHeight = `${this.newHeight * this.factor}px`;
		const graph = container.querySelector("canvas#gymGraph");
		graph.style.height = `${this.newHeight * this.factor}px`;
		graph.height = this.newHeight;
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
		const ownOffers = document.querySelector("div.offerListWrapper:first-of-type");
		if(ownOffers === null) return;

		const header = ownOffers.querySelector("div.row.row-cols-3.row-header");
		const offerItems = ownOffers.querySelectorAll('div.inventoryItemWrapper');
 
		const totalVal = this.getTotalValue(offerItems);
 
		const totalValCard = document.createElement("div");
		totalValCard.classList.add("card-body", "mb-2");
		totalValCard.innerHTML = `<p class="card-text">The total value of your listings is <span class="fw-bold">\u00a3${totalVal.toLocaleString("en-US")}</span>.</p>`;
		ownOffers.insertBefore(totalValCard, header);
	}
	getTotalValue(offerItems) {
		let totalVal = 0;
		for(const item of offerItems) {
			if(item.children.length < 5) continue;

			const valueText = item.children[2].textContent;
			const val = parseInt(valueText.slice(1).replaceAll(',', ""));

			const countText = item.children[4].textContent;
			const countOf = parseInt(countText.replaceAll(',', ""));

			totalVal += val * countOf;
		}
		return totalVal;
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
		const getNumberAtIndex = idx => parseInt(table.children[idx].children[0].innerText.replaceAll(',', ""));
		let totalW = getNumberAtIndex(3) + getNumberAtIndex(7);
		let totalL = getNumberAtIndex(5) + getNumberAtIndex(9);
 
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
		addItemButtons.inUniversity(URL);
		betterItemValues.inUniversity(URL);
		estimatedIntGains.inUniversity(URL);
	} else if(/^university\/[132]\/?$/.test(URL)) {
		// In a university course pages
		intPerWeek.inUniversityPage(URL);
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