// constants used in all modules
const POUND = '\u00a3';
const SettingType = {
	TOGGLE: 0,
	LIST: 1,
	INTEGER: 2,
	MULTISELECT: 3
}
const ITEMS = [
	// Primary Weapons
	'AK-47',
	'MG34',
	'G36',
	'L86 LSW',
	'Steyr AUG',
	'SIG SG 550',
	'MG5',
	'FN SCAR-H', 
	'Bazooka',

	// Secondary Weapons
	'Baseball Bat',
	'Walther P38',
	'M16A2 Rifle',
	'M1911',
	'S&W Magnum Revolver',
	'Glock 18',
	'Desert Eagle', // TODO: Update this price

	// Thrown
	'Illuminating Grenade',
	'Tear Gas Grenade',
	'Stun Grenade',
	'Flash Bang Grenade',
	'Fragmentation Grenade',

	// Armour
	'Trench Coat',
	'Covert Stab Vest',
	'Ballistic Vest',
	'Kevlar Weave Vest',
	'Carbon Fiber Vest',
	'Armoured Suit',
	'Ceramic Plate Carrier Vest',
	'Riot Suit',
	'Tactical Plate Armour',
	'Blast Suit',
	'New-Age Combat Fatigues',
	'Full-Body Armour',

	// Special
	'Green Surprise Gift',
	'Velvet Mystery Gift',
	'Rustic Charm Gift',
	'Golden Treasure Gift',
	'Mini-Supporter Pack',
	'Personal Favour',
	'Supporter Pack',

	// Alcohol
	'Corana Beer',
	'Mexcal Beer',
	'Blancoda Tequila',
	'Repose Tequila',
	'Anejo Tequila',
	'Raicilla',

	// Medical
	'Bandage',
	'Small Medical Kit',
	'Tainted Cannabis',
	'Large Medical Kit',
	'Tainted Cocaine',
	'Basic Trauma Kit',
	'Large Trauma Kit',

	// Drugs
	'Glittering Gift',
	'Cannabis',
	'Cocaine',

	// Production
	'Bag of Fertiliser',
	'Agave Heart',
	'Coca Paste',

	// Construction
	'Nails',
	'Bricks',
	'Concrete Bags',
	'Steel',

	// Food
	'Dog Food',
	'Black Market Treat',

	// Collectible
	'El Chapo\'s Head',
	'Pablo\'s Hat',
	'Quecheu Troll Doll',
	'The Easter Fuggly',
	'Elf on a Shelf - Green',
	'Elf on a Shelf - Red',
	'Padrino\'s Egg',
	'The Crimson Star',
	'La Cara Roja Mask',

	// Luxury
	'Diablo Tattoo',
	'Italian Shoes',
	'Cuban Cigar Set',
	'Eagle Cabernet',
	'Whiskey Decanter',
	'Gold Grooming Kit',
	'Gemstone Cufflinks',
	'Lapis-Encrusted Lighter',
	'Satellite Phone',
	'Club VIP Lounge Membership',
	'Pearl-Encrusted Lighter',
	'Diamond Watch',
	'Diamond-Encrusted Lighter',
	'Bulletproof Suit',
	'Pet Jaguar',
	'Gold-Plated Pistol',
	'Platinum Credit Card',
	'Personal Helicopter',

	// Cars
	'Renault Espace',
	'Fiat Panda',
	'Austin Metro',
	'Peugeot 205 GTI',
	'Ford Sierra',
	'Vauxhall Cavalier',
	'Ford Escord',
	'Honda CRX',
	'Saab 900 Turbo',
	'Lancia Delta Integrale',
	'Toyota MR2',
	'Audi Quattro', // TODO: Get market value
	'Ford Capri 2.8i',
	'Volkswagen Golf GTI',
	'BMW M5',
	'Porsche 959',
	'Ferrari F40',
	'Lamborghini Countach',

	// Enhancement
	'Street-Quality Enhancement',
	'Syndicate-Issued Enhancement',
	'Blacksite Prototype Enhancement',

	// Smuggling Enhancement
	'Weapons & Armor Specialist Contact',
	'Alcohol Specialist Contact',
	'Tech Specialist Contact',
	'Leadership Specialist Contact',
];

// Used for seeing when elements update, for some reason there's no neat standard way to do that
const observeDOM = (function() {
	const MutationObserver = window.MutationObserver
		|| window.WebKitMutationObserver;
	return function(obj, callback) {
		if(!obj || obj.nodeType !== 1) return;

		if(MutationObserver) {
			const mutationObserver = new MutationObserver(callback);
			mutationObserver.observe(obj, {
				childList: true,
				subtree: true
			});
			return mutationObserver;
		}
		if(window.addEventListener) {
			obj.addEventListener("DOMNodeInserted", callback, false);
			obj.addEventListener("DOMNodeRemoved", callback, false);
		}
	}
})();

function extractUserInfo() {
    const labels = document.querySelectorAll(".profileLabel");
 
    let nameIdElement = null;
 
    labels.forEach(label => {
        if (label.textContent.trim().toLowerCase() === "name") {
            nameIdElement = label
				.parentElement
				.nextElementSibling
				.querySelector(".form-data-inset");
        }
    });
 
    if (!nameIdElement) {
		console.error("❌ User name and ID not found on the page!");
		return;
    }

	const userInfo = nameIdElement.textContent.trim();

	const [extractedName, extractedId] = userInfo.split(" - ");

	if (!extractedName || !extractedId) {
		console.warn("⚠️ Failed to properly split name and ID.");
		return;
	}

	const user_name = extractedName.trim();
	const user_id = extractedId.trim();

	// Save the user name and ID in localstorage
	localStorage.setItem("user_name", user_name);
	localStorage.setItem("user_id", user_id);

	console.debug("✅ Extracted User Name:", user_name);
	console.debug("✅ Extracted User ID:", user_id);

	return { user_name: user_name, user_id: user_id };
}
 
// Function to get user name and ID from localstorage
function getUserInfoFromStorage() {
    const storedName = localStorage.getItem("user_name");
    const storedId = localStorage.getItem("user_id");
 
    if (!storedName || !storedId) {
		console.warn("ℹ️ User info not found in localStorage.");
		return null;
    }
	console.debug(`From LocalStorage: Name: ${storedName}, ID: ${storedId}`);
	return { user_name: storedName, user_id: storedId };
}

// Fetches a stored numeric value
function getNumericValue(prefix, name) {
	const result = getValue(prefix, name);
	if (isNaN(result)) return null;
	return result;
}

// Fetches a stored value of any type
function getValue(prefix, name) {
	let formattedName = `${prefix}_${name.replaceAll(' ', '_')}`;
	let val = GM_getValue(formattedName, null);

	// Fallback to old format if new format returns null
	if (val === null || val === NaN || val === undefined) {
		formattedName = `${prefix}_${name}`; // Try without replacing spaces
		val = GM_getValue(formattedName, null);
	} else return val;

	// Still fails, default to null
	if (val === null || val === NaN || val === undefined) {
		return null;
	} else {
		// Update to new format
		setValue(prefix, name, val);

		// Remove legacy key
		GM_deleteValue(`${prefix}_${name}`);
	}

	return val;
}

/**
 * Retrieve the cached value of an item.
 * 
 * @param {string} itemName The name of the item to get the value of
 * @returns {number | null} - The item value or null if not set
 */
function getItemValue(itemName) {
	return getNumericValue('value', itemName);
}

// Sets a local cache value
function setValue(prefix, name, value) {
	const spacesEscaped = name.replaceAll(' ', '_')
	GM_setValue(`${prefix}_${spacesEscaped}`, value);
	return value;
}

function getSettings(moduleName) {
	return getValue('script', 'settings')[moduleName] || null;
}

function arrayRemoveElem(array, elem) {
	const index = array.indexOf(elem);
	if (index !== -1) array.splice(index, 1);
	return array;
}

function wait(ms) {
	return new Promise(res => {
		setTimeout(() => {res()}, ms);
	});
}

class AchievementStats {

	static metadata = {
		displayName: 'Achievement Stats',
		description: 'Shows stats about each achievement',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() {
		// A couple of constants
		this.medItems = [
			'Bandage',
			'Small Medical Kit',
			'Large Medial Kit',
			'Basic Trauma Kit',
			'Large Trauma Kit',
			'Tainted Cannabis',
			'Tainted Cocaine'
		];
		this.alcItems = [
			'Corana Beer',
			'Mexcal Beer',
			'Blancoda Tequila',
			'Repose Tequila',
			'Anejo Tequila',
			'Raicilla'
		];
		this.drugItems = [
			'Cannabis',
			'Cocaine',
			'Glittering Gift'
		];

		// The prefix used for all achievement IDs
		this.achievementIdPrefix = 'achievement-';

		// Chance to get 3, 4 or 5 correct numbers in the lottery
		this.winThreeChance = 0.005077;

		// Chance to get 5 correct numbers in the lottery
		this.jackpotChance = 5.244e-7;

		this.spinCost = 100_000;
		this.lotteryTicketCost = 10_000;
		this.blackjackCost = 1_000;

		// Energy cost for attacking
		this.attackCost = 20;

		// Minimum job durations (at P5)
		this.intimDuration = 2.5;
		this.arsonDuration = 15;
		this.gtaDuration = 30;
		this.drugDuration = 90;
		this.farmDuration = 7.5;
		this.agaveDuration = 15;
		this.pasteDuration = 30;
		this.constrDuration = 45;
		this.blackmailDuration = 180;
		this.hackDuration = 360;
	}

	inAchievements(URL) {
		/* ----------------------------------------------------------------- *\
		*                            General                                  *
		\* ----------------------------------------------------------------- */
		
		this._modifyAchievement(`#${this.achievementIdPrefix}3`, ['simple', 'Days Left: ']);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}4`,
			['simple', 'Money left: ' + POUND]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}5`,
			['level-rep', 'Reputation left: ']
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}6`,
			['simple', 'Days Left: '],
			['supporter-cost', 'Supporter Pack cost: ']
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}17`,
			['simple', 'Intelligence left: '],
			['int-energy', 'Energy cost: ']
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}19`,
			['simple', 'Refills left: '],
			['simple', 'Point cost: ' + POUND, 25 * getItemValue('Supporter Points')]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}20`,
			['simple', 'Refills left: '],
			['simple', 'Point cost: ' + POUND, 25 * getItemValue('Supporter Points')]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}21`,
			['simple', 'Personal Favors left: '],
			['simple', 'PF cost: ' + POUND, getItemValue('Personal Favour')]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}22`,
			['simple', 'Medical Items left: '],
			['min-item-cost', 'Minimum cost: ' + POUND, this.medItems]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}23`,
			['simple', 'Alcohol Items left: '],
			['min-item-cost', 'Minimum cost: ' + POUND, this.alcItems]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}24`,
			['simple', 'Drug Items left: '],
			['min-item-cost', 'Minimum cost: ' + POUND, this.drugItems]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}26`,
			['simple', 'Revives left: '],
			['simple', 'Energy cost: ', this.attackCost]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}27`,
			['simple', 'Expeditions left: '],
			['exped-time', 'Min total duration: ']
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}32`,
			['simple', 'Missions left: '],
			['mission-time', 'Min days left: ']
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}33`,
			['simple', 'Money left: ' + POUND]
		);

		/* ----------------------------------------------------------------- *\
		*                            Combat                                   *
		\* ----------------------------------------------------------------- */

		this._modifyAchievement(
			`#${this.achievementIdPrefix}1`,
			['simple', 'Attacks left: '],
			['simple', 'Energy cost: ', this.attackCost]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}2`,
			['simple', 'Defends left: '],
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}25`,
			['simple', 'Bounties left: '],
			['simple', 'Energy cost: ', this.attackCost]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}31`,
			['simple', 'Money left: ' + POUND],
		);

		/* ----------------------------------------------------------------- *\
		*                                Jobs                                 *
		\* ----------------------------------------------------------------- */

		this._modifyAchievement(
			`#${this.achievementIdPrefix}34`,
			['simple', 'Jobs left: ']
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}7`,
			['simple', 'Jobs left: '],
			['job-time', 'Min time left: ', this.intimDuration]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}8`,
			['simple', 'Jobs left: '],
			['job-time', 'Min time left: ', this.arsonDuration]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}9`,
			['simple', 'Jobs left: '],
			['job-time', 'Min time left: ', this.gtaDuration]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}10`,
			['simple', 'Jobs left: '],
			['job-time', 'Min time left: ', this.drugDuration]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}11`,
			['simple', 'Jobs left: '],
			['job-time', 'Min time left: ', this.farmDuration]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}12`,
			['simple', 'Jobs left: '],
			['job-time', 'Min time left: ', this.agaveDuration]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}13`,
			['simple', 'Jobs left: '],
			['job-time', 'Min time left: ', this.pasteDuration]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}14`,
			['simple', 'Jobs left: '],
			['job-time', 'Min time left: ', this.constrDuration]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}15`,
			['simple', 'Jobs left: '],
			['job-time', 'Min time left: ', this.blackmailDuration]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}16`,
			['simple', 'Jobs left: '],
			['job-time', 'Min time left: ', this.hackDuration]
		);

		/* ----------------------------------------------------------------- *\
		*                              Casino                                 *
		\* ----------------------------------------------------------------- */

		this._modifyAchievement(
			`#${this.achievementIdPrefix}28`,
			['simple', 'Spins left: '],
			['simple', 'Spin cost: ' + POUND, this.spinCost]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}29`,
			['simple', 'Hands left: '],
			['simple', 'Min cost: ' + POUND, this.blackjackCost]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}30`,
			['simple', 'Spins left: '],
			['simple', 'Min cost: ' + POUND, this.blackjackCost]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}35`,
			['simple', 'Tickets left: '],
			['simple', 'Ticket cost: ' + POUND, this.lotteryTicketCost]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}36`,
			['simple', 'Wins left: '],
			['gamble-amount', 'Avg tickets left: ', this.winThreeChance]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}37`,
			['gamble-amount', 'Average tickets for jackpot: ', this.jackpotChance]
		);
	}

	_calcRepFromLevel(level) {
		const value = 12000 * (Math.exp(level * Math.log(1.1)) - 1);
		return Math.floor(value);
	}

	_calcLevelFromRep(rep) {
		const value = Math.log(rep / 12000 + 1) / Math.log(1.1);
		return Math.floor(value);
	}

	_modifyAchievement(id, ...stats) {
		const elem = document.querySelector(id);
		this._addStatElem(elem);
		for (const stat of stats) {
			this._addStat(elem, stat[0], stat[1], stat.slice(2));
		}
	}

	/** @param {HTMLDivElement} achievementElem */
	_addStatElem(achievementElem) {
		// Make space for new elem
		const mainElem = achievementElem.querySelector('div.col-9');
		mainElem.classList.replace('col-9', 'col-7');

		const statsElem = document.createElement('div');
		statsElem.classList = 'col-2 d-flex';
		mainElem.insertAdjacentElement('afterend', statsElem);
		return statsElem;
	}

	_addStat(achievementElem, type, prefix, params=[]) {
		const statsElem = achievementElem.querySelector('div.col-2.d-flex');
		const amounts = this._getAmount(achievementElem);

		const diffValue = this._getDiffValue(type, amounts, params);
		if (diffValue === null) return;

		statsElem.innerHTML += `${prefix}${diffValue}<br/>`;
	}

	_getAmount(achievementElem) {
		const amount = achievementElem.querySelector("div.col-7.d-flex > div > div.col-12 > div.row.w-100 > div.col-12.text-center.text-muted.pt-0 > span");
		return amount.textContent.split(' / ').map(num => parseInt(num.replaceAll(',', '')));
	}

	_formatNumberOrDate(number) {
		return number.toLocaleString('en-us');
	}

	_formatMoney(number) {
		return POUND + this._formatNumberOrDate(number);
	}

	_getDiff(diff, multiplier=1) {
		return diff * multiplier;
	}

	_getRepDiff(next) {
		const currentRepElem = document.querySelector('div[aria-label="Reputation"] + div > span');
		const currentRep = parseInt(currentRepElem.textContent.replaceAll(',', ''));
		const effectiveLevel = this._calcLevelFromRep(currentRep);
		if (effectiveLevel >= next) return '0 - you can level up now';

		const nextLevelRep = this._calcRepFromLevel(next);
		return nextLevelRep - currentRep;
	}

	_getSupporterCost(diff) {
		const spDaysLeftElem = document.querySelector('li.premiumIcon > a');
		const spDaysLeft = 
			spDaysLeftElem.parentElement.classList.contains('d-none') ? 
			0 : parseInt(spDaysLeftElem.getAttribute('data-bs-content')
				.match(/^\d+/)[0]);
		const spAmount = Math.ceil(Math.max(diff - spDaysLeft, 0) / 31);
		return spAmount * getItemValue('Supporter Pack');
	}

	_getMinItemCost(diff, items) {
		const cheapestPrice = items.reduce((a, c) => {
			const curItemValue = getItemValue(c) || Infinity;
			return curItemValue < a ? curItemValue : a;
		}, Infinity);

		return diff * cheapestPrice;
	}

	_getGambleAmount(diff, chance) {
		const avgTicketsTillGoal = Math.floor(diff * (1 / chance));

		return avgTicketsTillGoal;
	}

	_getIntEnergyCost(current, next) {
		const extraIntGains = getNumericValue('perks', 'Int Gains') || 0; // percentage
		const extraGainsFactor = 1 + extraIntGains / 100;
		const cost = Math.log(next / current) / Math.log(1.000027272479341) / extraGainsFactor
		return Math.floor(cost);
	}

	_getExpedTime(diff) {
		const totalMin = diff * 20;
		const duration = new Temporal.Duration(
			0, //years
			0, // months
			0, // weeks
			0,
			Math.floor(totalMin / 60)// hours
		);
		return diff > 0 ? duration : 0;
	}

	_getMissionTime(diff) {
		// 7 daily (5 personal + 2 cartel),
		// 4 weekly (2 personal + 1 cartel + 1 global),
		// 4 monthly (2 personal + 1 cartel + 1 global)
		const avgMissionsPerDay = 7 + 4/7 + 4/30;
		const daysLeft = Math.ceil(diff / avgMissionsPerDay);
		const duration = new Temporal.Duration(
			0,
			0,
			0,
			daysLeft
		);
		return diff > 0 ? duration : 0;
	}

	_getJobTime(diff, minPerJob) {
		const minutesLeft = Math.ceil(diff * minPerJob);
		const duration = new Temporal.Duration(
			0,
			0,
			0, // weeks
			0,
			Math.floor(minutesLeft / 60) // hours
		);
		return diff > 0 ? duration : 0;
	}

	_getDiffValue(type, amounts, params=[]) {
		const diff = amounts[1] - amounts[0];
		if (diff === 0) return null;

		switch (type) {
			case 'simple':
				return this._formatNumberOrDate(this._getDiff(diff, ...params));
			case 'level-rep':
				return this._formatNumberOrDate(this._getRepDiff(amounts[1]));
			case 'gamble-amount':
				return this._formatNumberOrDate(this._getGambleAmount(diff, ...params));
			case 'supporter-cost':
				return this._formatMoney(this._getSupporterCost(diff));
			case 'min-item-cost':
				return this._formatMoney(this._getMinItemCost(diff, ...params));
			case 'lottery-win-cost':
				return this._getLotteryWinCost(diff);
			case 'int-energy':
				return this._formatNumberOrDate(this._getIntEnergyCost(...amounts));
			case 'exped-time':
				return this._formatNumberOrDate(this._getExpedTime(diff));
			case 'mission-time':
				return this._formatNumberOrDate(this._getMissionTime(diff));
			case 'job-time':
				return this._formatNumberOrDate(this._getJobTime(diff, ...params));
			default:
				break;
		}
	}


}

// This class is good enough for how it is used now,
// but if it's used more, _type and _actionName should
// be replaced by enums
class Item {
	/** @type {string} Name of the item*/
	_name;

	/** @type {number} ImageID used in CE for this item*/
	_imageID;

	/** @type {string} ImageID used in CE for this item*/
	_type;

	/** @type {string} Item description as given in the inventory in CE*/
	_description;
	
	/** @type {string} Item effect as given in the inventory in CE*/
	_effect;

	/** @type {string} Hover value of the 'Use' button in the inventory in CE*/
	_actionName;

	constructor(name, imageID, type, description, effect, actionName) {
		this._name = name;
		this._imageID = imageID;
		this._type = type;
		this._description = description;
		this._effect = effect;
		this._actionName = actionName;
	}

	get name() {
		return this._name;
	}
	get imageID() {
		return this._imageID;
	}
	get type() {
		return this._type;
	}
	get description() {
		return this._description;
	}
	get effect() {
		return this._effect;
	}
	get actionName() {
		return this._actionName;
	}

	set name(value) {
		this._name = value;
	}
	set imageID(value) {
		this._imageID = value;
	}
	set type(value) {
		this._type = value;
	}
	set description(value) {
		this._description = value;
	}
	set effect(value) {
		this._effect = value;
	}
	set actionName(value) {
		this._actionName = value;
	}
}


class AddItemButtons {

	static metadata = {
		displayName: 'Add Item Buttons',
		description: 'Add items to certain pages for convenience',
		settings: {
			active: {
				inGym: {
					description: 'Add a button for cocaine'
				},
				inUniversity: {
					description: 'Add a button for Cocaine'
				},
				inJail: {
					description: 'Add a button for Personal Favours'
				},
				inInventory: {
					description: 'Required to update the item ID'
				}
			},
			custom: {
			}
		}
	}

	constructor() {
		// Static info on each item
		this.itemMap = new Map([
			['Cocaine', new Item(
				'Cocaine',
				301,
				'Drug',
				'Unlike the shadows of tainted competitors, this cocaine embodies purity \u2013 a potent source of untamed energy, and unparalleled confidence. Time itself seems to bow to your will, granting you control over the universe and its secrets. Cocaine serves as both reward and temptation, a double-edged sword that can either elevate you to greatness or lead you down a treacherous path to Hospital and reduces Combat Stats.',
				'Increases Energy by 50. Increases drug cooldown by 3 hours. Possible overdose effect of -20% all Combat Stats',
				'Take'
			)],
			['Personal Favour', new Item(
				'Personal Favour',
				3,
				'Special',
				'The Personal Favour is granted to players by El Capo, the boss of boss\'s. It\'s a valuable asset that can be used to get the player out of jail when they find themselves in a tight spot with the law. With this favour, players bypass the usual legal processes and secure their freedom with just a single phone call to El Capo.',
				'Releases you from Jail',
				'Use'
			)],
			['Corana Beer', new Item(
				'Corana Beer',
				100,
				'Alcohol',
				'Often served with a wedge of lime, what better way to take the edge of a hard day of crime than by sitting down to a cool Corana Beer. Provides a minor boost to energy.',
				'Increases energy by 5. Increases Booster cooldown by 2 hours',
				'Drink'
			)]
		]);
	}
	getID(itemName) {
		return getValue('itemID', itemName);
	}
	setID(cache, itemName) {
		setValue('itemID', itemName, cache);
		console.debug(`Set itemID_${itemName} to ${cache}`);
		return cache;
	}
	getCount(itemName) {
		return getValue('itemCache', itemName);
	}
	setCount(cache, itemName) {
		setValue('itemCache', itemName, cahce);
		return cache;
	}
	getItemValue(itemName) {
		return getNumericValue('value', itemName);
	}
	useItemClicked(e) {
		// Disable button
		e.target.disabled = true;
		document.querySelector('.useItemMsg')?.remove();

		const id = e.currentTarget.getAttribute("id");
		fetch('/Inventory/Use?id=' + id, { method: 'POST' })
			.then(response => response.json())
			.then(this.handleInvResponse);
	}
	handleInventoryCollapse(target, parent) {
		if (target.tagName === 'svg' || target.tagName === 'BUTTON' || target.tagName === 'path') return;
		// Hide any open items

		const descId = '#itemCollapse' + parent.id.slice(5);
		const descElem = parent.querySelector(descId);
		if (!descElem) return;

		// Toggle description visibility
		if (descElem.classList.contains('collapse')) descElem.classList.remove('collapse');
		else descElem.classList.add('collapse');
	}
	handleInvResponse(data) {
		if (data.status !== 200) return;

		if (data.type == "Weapon" || data.type == "Armour" || data.type == "Thrown") {
			location.setAttribute('href', '/Inventory');
			document.querySelector('.use-item-btn').disabled = false;
			return;
		}
		const containingRow = document.querySelector('.use-item-btn').parentElement.parentElement;
		const dateString = new Date(Date.now()).toLocaleTimeString("en-GB", { timeZone: "UTC" }); 

		if (!data.statusMsg.success) {
			const infoElem = this.constructInfoMsg('col-12 useItemMsg mt-2 text-danger fw-bold', `${dateString} - ${data.statusMsg.error}`);
			containingRow.appendChild(infoElem);
			return;
		}
		const infoElem = this.constructInfoMsg('col-12 useItemMsg mt-2 text-success fw-bold', `${dateString} - ${data.statusMsg.success}`);
		containingRow.appendChild(infoElem);

		if (data.energyGained) this.handleEnergyGain(data);

		if (data.lifeToSet || data.lifeToSet === 0) this.handleLifeUpdate(data);

		if (data.sentToHospital) {
			document.querySelector('.content-container').style = 'background-image:linear-gradient(to right, rgba(255,0,0,0.05), rgba(255, 0, 0, 0.2), rgba(255,0,0,0.05)), url(../images/background-hospital.webp);';
			document.querySelector('#userStatus').textContent = 'In Hospital'
		}
		if (data.releaseFromHosp || data.releaseFromJail) {
			document.querySelector('.content-container').style = 'background-image:linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url(../images/background.webp)';
			document.querySelector('#userStatus').textContent = 'Active'
		}

		document.querySelector('.use-item-btn').disabled = false;

		// Update item count
		const itemCountLabel = document.querySelector(".inventoryItemWrapper .itemQuantity");
		if (!itemCountLabel[0]) return;

		const currentCount = parseInt(itemCountLabel[0].textContent);
		if (isNaN(currentCount)) return;

		if (currentCount - 1 > 0)
			itemCountLabel[0].textContent = currentCount - 1;
		else
			containingRow.remove();
	}
	constructInfoMsg(classList, textContent) {
		const infoElem = document.createElement('div');
		infoElem.classList = classList;
		infoElem.textContent = textContent;
		return infoElem;
	}
	handleEnergyGain(data) {
		const currentEnergyElem = document.querySelector('#currentEnergy');
		const currentEnergy = parseInt(currentEnergyElem.textContent);
		const newEnergy = currentEnergy + data.energyGained;

		const maxEnergyElem = document.querySelector('#maxEnergy');
		const maxEnergy = parseInt(maxEnergyElem.textContent);
		const percentageOfMax = ((newEnergy / maxEnergy) * 100);

		currentEnergyElem.textContent = newEnergy;

		const energyProgressElem = document.querySelector('#energyProgress');
		energyProgressElem.style.width = `${percentageOfMax}%`;
		energyProgressElem.setAttribute("aria-valuenow", newEnergy);

		// Update input fields
		document
			.querySelectorAll('form.input-group input.form-control')
			.forEach((elem) => {
				elem.setAttribute("max", newEnergy.toString());
				elem.setAttribute("value", newEnergy.toString());
			});
		document
			.querySelectorAll('form.input-group input.btn.disabled')
			.forEach((elem) => {
				elem.classList.remove("disabled")
			});
	}
	handleLifeUpdate(data) {
		const maxLifeElem = document.querySelector('#maxLife');
		const maxLife = parseInt(maxLifeElem.textContent);
		const newLife = data.lifeToSet;
		const percentageOfMax = ((newLife / maxLife) * 100);
		if (newLife > maxLife) newLife = maxLife;

		const currentLifeElem = document.querySelector('#currentLife');
		const lifeProgressElem = document.querySelector('#lifeProgress');
		currentLifeElem.textContent = newLife;
		lifeProgressElem.style.width = `${percentageOfMax}%`;
		lifeProgressElem.setAttribute("aria-valuenow", newLife);
	}
	add(count, value, pb, itemName) {
		const ID = this.getID(itemName);
		if (ID === null) return '';

		const item = this.itemMap.get(itemName);
		const desc = item.description;
		const effect = item.effect;
		const imageID = item.imageID;
		const type = item.type;
		const actionName = item.actionName;

		return `
		<div class="row row-cols-3 align-items-center pb-${pb} inventoryItemWrapper" id="item-${ID}" style="cursor: auto; border-bottom: none">
			<div class="col col-4 col-sm-2 col-xl-1">
				<img class="img-thumbnail" src="/images/items/${imageID}.png" title="${itemName}">
			</div>
			<div class="col col-8 col-sm-3 col-xl-4">
				${itemName}<span class="fw-bold"> x<span class="itemQuantity">${count.toLocaleString("en-US")}</span></span>
			</div>
			<div class="col col-2 col-sm-4 col-xl-2 d-none d-sm-inline">
				${itemName === 'Cocaine' ? "Drug" : "Special"}
			</div>
			<div class="col col-2 col-xl-2 d-none d-xl-inline">
				<span></span>${POUND}${value.toLocaleString("en-US")} 
			</div>
			<div class="col col-12 col-sm-3 pe-2 d-none d-sm-inline">
				<button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end" href="#" data-bs-toggle="modal" data-bs-target="#throwItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" title="Throw Away" aria-label="Throw Away ${itemName}" disabled="">
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z">
						</path>
					</svg>
				</button>
				<button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end" href="#" data-bs-toggle="modal" data-bs-target="#sendItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" data-bs-owned="${count}" title="Send" aria-label="Send ${itemName}" disabled="">
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z">
						</path>
					</svg>
				</button>
				<button class="btn btn-sm btn-outline-dark action-btn use-item-btn float-end" href="#" id="${ID}" title="${actionName}" aria-label="${actionName} ${itemName}">
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z">
						</path>
					</svg>
				</button>
			</div>
			<div class="col col-12 collapse" id="itemCollapse${ID}" style="">
				<div class="row row-cols-2 d-md-none mt-3 mb-2">
					<div class="col col-6 mb-2">
						<button class="btn btn-sm btn-outline-dark action-btn use-item-btn w-100" href="#" id="${ID}" title="${actionName}" aria-label="${actionName} ${itemName}">
							${actionName}
						</button>
					</div>
					<div class="col col-6 mb-2">
						<button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end w-100" href="#" data-bs-toggle="modal" data-bs-target="#sendItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" data-bs-owned="42" title="Send" aria-label="Send ${itemName}" disabled="true">
							Send
						</button>
					</div>
					<div class="col col-6 mb-2">
						<button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end w-100" href="#" data-bs-toggle="modal" data-bs-target="#throwItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" data-bs-itemquantity="42" title="Throw Away" aria-label="Throw Away ${itemName}" disabled="true">
							Throw
						</button>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12 mt-2">
						<div class="card-text">
							<div class="fw-bold">
								Description 
							</div>
							<div class="card-text">
								${desc}
							</div>
						</div>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-6 d-md-none">
						<div class="card-text">
							<div class="fw-bold">
								Type 
							</div>
							<div class="card-text">
								${type}  
							</div>
						</div>
					</div>
					<div class="col-6 d-xl-none">
						<div class="card-text">
							<div class="fw-bold">
								Value
							</div>
							<div class="card-text">
								<span></span>${POUND}${value.toLocaleString("en-US")} 
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-xl-6 col-md-6 col-12 mb-3">
						<div class="card-text">
							<div class="fw-bold">
								Effect 
							</div>
							<div class="card-text">
								${effect}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
	}
	addListener(itemName) {
		const ID = this.getID(itemName);
		if (ID === null) return;

		const item = document.getElementById(`item-${ID}`);
		observeDOM(item, e => {
			const added = e[0].addedNodes[0];
			if (!added || !added.classList
				|| !added.classList.contains("useItemMsg")
				|| added.classList.contains("text-danger")
			) return;

			const newCount = (this.getCount(itemName) || 1) - 1;
			this.setCount(newCount, itemName);
			const countText = document.querySelector(`#item-${ID} span.itemQuantity`);
			countText.textContent = newCount.toLocaleString("en-US");
		});
	}
	addItem(itemName, targetElement) {
		const temp = document.createElement('div');
		temp.innerHTML = this.add(this.getCount(itemName) || 0, this.getItemValue(itemName) || "???", 4, itemName);
		const newDiv = temp.firstElementChild;

		targetElement.parentNode.insertBefore(newDiv, targetElement.nextSibling);

		newDiv.addEventListener('click', e => this.handleInventoryCollapse(e.target, newDiv));

		const useButton = newDiv.querySelector('.use-item-btn');
		useButton.addEventListener('click', e => this.useItemClicked(e));

		this.addListener(itemName);
	}
	inGym(url) {
		const targetElement = document.querySelector(".row.row-cols-2.row-cols-lg-4.row-cols-md-2.mt-2.mb-4.g-4");
		if (targetElement === null) return;

		this.addItem('Corana Beer', targetElement);
		this.addItem('Cocaine', targetElement);

		const delimiter = document.createElement('hr');
		targetElement.parentNode.insertBefore(delimiter, targetElement.nextSibling);
	}
	inUniversity(url) {
		const container = document.querySelector("div.contentColumn > div > div:not(#helpAccordion):not(.border-success):not(.border-danger) div.card-body");
		if (container === null) return;

		const form = container.querySelector("div.text-center.d-flex.flex-column.align-items-center");
		// At max int
		if (form === null || container === null) return;

		const itemName = 'Cocaine';

		this.addItem(itemName, container);
		const delimiter = document.createElement('hr');
		container.parentNode.insertBefore(delimiter, container.nextSibling);
	}
	inJail(url) {
		let container = document.querySelector("div.contentColumn > div > div:not(#helpAccordion):not(.border-success):not(.border-danger) div.card-body");
		const inJail = container.querySelector("p.card-text.fw-bold.text-success");
		if (inJail === null || container === null) return;

		const itemName = 'Personal Favour';

		this.addItem(itemName, container);
		const delimiter = document.createElement('hr');
		container.parentNode.insertBefore(delimiter, container.nextSibling);
	}
	inInventory(url) {
		const itemList = document.querySelector("div.container.inventoryWrapper");
		if (itemList === null) return;

		for (let i = 2; i < itemList.children.length; ++i) {
			const item = itemList.children[i];
			if (item.children.length < 2) continue;

			const nameSplit = item.children[1].innerText.split(' ');
			const itemName = nameSplit.slice(0, -1).join(' ');
			if (this.itemMap.get(itemName))
				this.setID(item.id.slice(5), itemName);
		}
	}
}



class Link {
	/** @type {string} The name of the link that will show below the icon */
	_name;

	/** @type {string} The hover name */
	_altName;

	/** @type {string} The relative link to the target page */
	_link;

	/** @type {string} The svg path of the icon */
	_path;
	
	/** @type {string} The size of the icon in px*/
	_viewBox;

	constructor(name, altName, link, path, viewBox) {
		this._name = name;
		this._altName = altName;
		this._link = link;
		this._path = path;
		this._viewBox = viewBox;
	}

	get name() {
		return this._name;
	}
	get altName() {
		return this._altName;
	}
	get link() {
		return this._link;
	}
	get path() {
		return this._path;
	}
	get viewBox() {
		return this._viewBox;
	}

	set name(value) {
		this._name = value;
	}
	set altName(value) {
		this._altName = value;
	}
	set link(value) {
		this._link = value;
	}
	set path(value) {
		this._path = value;
	}
	set viewBox(value) {
		this._viewBox = value;
	}
}

const LINKS = [
	new Link(
		'ITEM MARKET',
		'Player Market',
		'/Market',
		`<path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z"></path>`,
		'16'
	),
	new Link (
		'STAT EST',
		'Stat Estimates',
		'/StatEstimates',
		`<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"></path>`,
		'16'
	),
	new Link(
		'HOSPITAL',
		'Hospital',
		'/Hospital',
		`<path d="M6 0h4v4h4v4h-4v4h-4v-4H2V4h4V0z"/>`,
		'16'
	),
	new Link(
		'HIGHSCORES',
		'Highscores',
		'/Highscores',
		`<path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"/>
  		<path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635z"/>`,
		'16'
	),
	new Link(
		'BOUNTY',
		'Bounties',
		'/Bounty',
		`<path class="cls-1" d="M16,28A12,12,0,1,1,28,16,12,12,0,0,1,16,28ZM16,6A10,10,0,1,0,26,16,10,10,0,0,0,16,6Z"></path><rect class="cls-1" height="7" width="2" x="15" y="24"></rect><rect class="cls-1" height="7" width="2" x="15" y="1"></rect><rect class="cls-1" height="2" width="7" x="24" y="15"></rect><rect class="cls-1" height="2" width="7" x="1" y="15"></rect><path class="cls-1" d="M16,20a4,4,0,1,1,4-4A4,4,0,0,1,16,20Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,16,14Z"></path>`,
		'32'
	),
	new Link(
		'PERSONAL STATS',
		'Personal Stats',
		'/User/Stats',
		`<path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2zm1 12h2V2h-2v12zm-3 0V7H7v7h2zm-5 0v-3H2v3h2z"></path>`, 
		'16'
	),
	new Link(
		'ACHIEVEMENTS',
		'Achievements',
		'/Achievements',
		`<path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935"></path>`,
		'16'
	)
];

class AddLinks {

	static metadata = {
		displayName: 'Add Links',
		description: 'Add extra links to the top nav bar',
		settings: {
			active: {
				inAnywhere: {
					description: 'Add useful links'
				}
			},
			custom: {
				links: {
					displayName: 'Links',
					description: 'What (custom) links should be shown in the navbar. Can select multiple',
					type: SettingType.LIST,
					defaultValue: [
						'Player Market',
						'Stat Estimates',
						'Hospital',
						'Highscores'
					],
					extra: {
						unique: true,
						availableElements: [
							'Player Market',
							'Stat Estimates',
							'Hospital',
							'Highscores',
							'Bounties',
							'Personal Stats',
							'Achievements'
						]
					}
				}
			}
		}
	}

	constructor() {
		const configManager = ConfigManager.getInstance();
		const activeLinks = configManager.getCustomSetting(this, 'links');
		if (activeLinks !== null) this.links = LINKS.filter(link => activeLinks.includes(link._altName));
		else this.links = LINKS;
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

	static metadata = {
		displayName: 'Bank Deposit Tax',
		description: 'Calculate and displays the bank deposit tax',
		settings: {
			active: {
				inBank: {
					description: 'Display the bank deposit tax below the input box'
				}
			},
			custom: {
			}
		}
	}

	constructor() {
		this.taxRate = 2.5;
		this.ID = "taxOnDeposit";
	}
	calc(val) {
		return `Deposit tax: ${POUND}${Math.round(val / 100 * this.taxRate).toLocaleString("en-US")}`;
	}
	inBank(url) {
		const container = document.querySelector("div.text-center.d-flex.flex-column.align-items-center");
		if (container === null) return;

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

		["autoNumeric:formatted", "input"].forEach(eventType => {
			depositInput.addEventListener(eventType, e => {
				value = e.target.value === "" ? 0 : Math.floor(parseFloat(e.target.value.replaceAll(',', "")));
				tax.innerHTML = this.calc(value);
			});
		});
	}
}


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
			{ "Bag of Fertiliser": 6 },
			{ "Agave Heart": 3.5 },
			{ "Coca Paste": 12 },
			{ Nails: 12.5 * 0.4, Bricks: 12.5 * 0.3, "Concrete Bags": 12.5 * 0.2, Steel: 12.5 * 0.1 },
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
		this.prodProfit = [];
		this.minProfit = -Infinity;
		this.maxProfit = Infinity;
		// Fallback default values
		this.required = [0, 0, 10, 5, 35];
		this.owned = [0, 0, 0, 0, 0];
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
	getProdReq(type) {
		return getNumericValue('prodReq', type);
	}
	setProdReq(type, req) {
		setValue('prodReq', type, req);
		console.debug(`Set prodReq_${type} to ${req}`);
		return req;
	}
	_getArea(container) {
		// Test for Buy-Container
		const header = container
			.closest('div.card-body')
			?.previousSibling
			?.querySelector('div.header-section > h2')
			?.textContent;
		
		if (header.startsWith('Buy Items')) return 'buy';
		if (header.startsWith('Special Stock')) return 'special';
		if (header.startsWith('Sell Items')) return 'sell';
		return undefined;
	}
	_getItemName(area, itemElem) {
		switch (area) {
			// 'Buy Items' area
			case 'buy':
			// 'Special Stock' area
			case 'special': return itemElem.children[1].textContent;
			case 'sell': return itemElem.children[2].firstChild.textContent;
			default: return;
		}
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
		const containers = document.querySelectorAll('div.container.inventoryWrapper.mb-4');

		const cannabisValue = this.getItemValue('Cannabis');
		for (const [id, container] of containers.entries()) {
			const area = this._getArea(container);
			if (!area) {
				console.warn(`Unidentdified container at id ${id}`);
				continue;
			}
			// Can only process special stock with known cannabis prices
			if (area === 'special' && cannabisValue === null) continue;

			const items = container.querySelectorAll('div.inventoryItemWrapper');
			for (const item of items) {
				this._updateStoreUI(item, area, cannabisValue);
			}
		}
	}
	_updateStoreUI(item, type, cannabisPrice) {
		const itemName = this._getItemName(type, item);

		const currentBest = this.getItemValue(itemName);
		if (currentBest === null) return;

		const priceElemIndex = type === 'special' ? 3 : type === 'buy' ? 4 : 5;
		const priceElem = item.children[priceElemIndex];

		const inSellingUI = type === 'buy' || type === 'special' ? false : true;

		let currentVal;
		if (type === 'special') {
			const cannabisAmount = parseInt(priceElem.textContent);
			currentVal = cannabisAmount * cannabisPrice;
		} else 
			currentVal = parseInt(priceElem.textContent.slice(1).replaceAll(',', ""));

		let shopHTML = priceElem.innerHTML;
		if (currentVal > currentBest)
			shopHTML = `<span class="text-${inSellingUI ? "success" : "danger"}">${priceElem.textContent}</span>`;
		else if (currentVal === currentBest && inSellingUI)
			shopHTML = `<span class="text-warning">${priceElem.textContent}</span>`;

		const marketHTML = `<br><span class="text-muted">(${POUND}${currentBest.toLocaleString("en-US")})</span>`;

		priceElem.innerHTML = shopHTML + marketHTML;

		const otherValueIndex = type === 'special' ? 5 : type === 'buy' ? 6 : 7;
		const otherValueText = item.children[otherValueIndex].querySelector("div.col-6");
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
		if (url.endsWith('bulkeditarmory')) return;

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
	inCartelArmoryEditor(url) {
		const itemList = document.querySelector('div.container-fluid.inventoryWrapper');
		if (itemList === null) return;

		const topButton = itemList.querySelector('div.row.mt-2.mb-2');
		const bottomButton = itemList.querySelector('div.row.mt-4');

		const totalContainer = document.createElement('div');
		totalContainer.classList.add('card-body', 'mb-4');
		totalContainer.innerHTML = `<p class='card-text'>Total item value: <span class='total-value-span fw-bold'>${POUND}0</span>.</p>`;

		topButton.prepend(totalContainer.cloneNode(true));
		bottomButton.prepend(totalContainer.cloneNode(true));

		const totalTextTop = topButton.querySelector('span.total-value-span.fw-bold');
		const totalTextBottom = bottomButton.querySelector('span.total-value-span.fw-bold');
		const totalVals = {};

		const items = itemList.querySelectorAll('div.inventoryItemWrapper');
		for (const item of items) {
			// Skip header
			if (item.children.length < 2) continue;

			// Get item name and price
			const itemName = item.children[1].querySelector('p').childNodes[0].textContent;
			const currentBest = this.getItemValue(itemName);

			// Create price display element
			const value = document.createElement('span');
			value.classList.add('itemValue', 'text-muted', 'float-end');
			value.innerText = `(${POUND}${currentBest === null ? '???' : currentBest.toLocaleString('en-US')})`;
			item.children[1].appendChild(value);

			const input = item.querySelector('input.form-control');
			// Skip borrowed items
			if (!input) continue;

			input.addEventListener('input', e => {
				const value = e.target.closest('div.inventoryItemWrapper').querySelector('span.itemValue');
				const currentBest = this.getItemValue(itemName);
				const inputVal = e.target.value;
				let totalValue = 0;

				if (inputVal === '' || inputVal.trim()[0] === '-' || parseInt(inputVal) === 0) {
					this._resetInputDisplay(value, currentBest, totalVals);
				} else {
					const count = parseInt(inputVal.replaceAll(',', ''));
					this._updateInputDisplay(value, currentBest, totalVals, count);
				}
				for (const val in totalVals)
						totalValue += val * totalVals[val];
				totalTextTop.innerText = `${POUND}${totalValue.toLocaleString('en-US')}`;
				totalTextBottom.innerText = `${POUND}${totalValue.toLocaleString('en-US')}`;
			});
		}
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
		if (containers?.length === 0) return;


		const prodHeader = document.querySelector("#mainBackground > div > div > div.col-12 > div.productionsContainer.rounded > div.row.mb-0");
		const flexContainer = this._constructProdHeader(0);
		// Insert the flex container at the top of the target section
		prodHeader.parentNode.insertBefore(flexContainer, prodHeader);

		this._initProfits(containers);

		for (let i = 0; i !== containers.length; ++i) {
			const container = containers[i];

			const expectedProfit = document.createElement("p");
			expectedProfit.id = 'expected-profit-' + i;
			expectedProfit.classList.add("card-text", "text-center");
			container.insertBefore(expectedProfit, container.querySelectorAll("hr")[1]);

			const sliderElem = container.querySelector('input.premiumSlider');
			if (sliderElem) {
				this._setDistribution(sliderElem, i);
				sliderElem.addEventListener('change', (evt) => {this._updateDistribution.bind(this)(evt.target, i)});
			}
			

			this._updateExpectedProfit(containers, i);

			// Get the "Narcos Assigned" input field
			const narcoInput = container.querySelector("input.assignNarcoInput");
			if (!narcoInput) continue;

			this.assigned[i] = parseInt(narcoInput.value);
			narcoInput.id = `inputNum${i}`;
			narcoInput.addEventListener("change", this._assignedNarcosChange.bind(this));

			// Skip street crimes and offices
			if (i < 2) continue;

			const daysLeftElement = document.createElement("p");
			daysLeftElement.classList.add("card-text", "text-center");

			// Append days left under supply items
			const requiredElement = container.querySelector("p.card-text.text-center.mb-0");
			requiredElement.parentElement.insertBefore(daysLeftElement, requiredElement.nextSibling);

			this._updateDaysLeft(daysLeftElement, i);
		}
		this._updateDailyProfit();
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
	_initProfits(containers) {
		const profit = [];
		let maxProfit = -Infinity;
		let minProfit = Infinity;
		for (let i = 0; i !== containers.length; ++i) {
			profit[i] = this._calcProfit(i, containers[i]);
			if (profit[i] === null) continue;

			maxProfit = Math.max(maxProfit, profit[i]);
			minProfit = Math.min(minProfit, profit[i]);
		}
		this.profit = profit;
		this.minProfit = minProfit;
		this.maxProfit = maxProfit;
	}
	_calcProfit(id, container) {
		this._updateSupplyInfo(container, id);

		const prodCount = this._getProdCount(container);

		// Get supply amount directly from container, so 'Efficiency' prestige
		// doesn't need to be applied; 
		const supplyCost = this._calcSupplyCost(id, prodCount, container);

		const narcoInput = container.querySelector("input.assignNarcoInput");
		this.assigned[id] = parseInt(narcoInput.value);
		if (this.assigned[id] === 0) return 0;
		if (supplyCost === null) return null;

		const required = this.required[id];
		const owned = this.owned[id];
		const assignedFraction = Math.min(this.assigned[id] / (this.narcoCounts[id] * prodCount), 1);

		const materialFraction = required > 0 ? Math.min(owned / required, 1) : 1;

		const prestigeTable = container.querySelector('div.table-responsive.production-table.mt-1');
		const prestigeLevels = this._getPrestigeLevels(prestigeTable);

		// Each level of 'Production Boost' prestige increases profit by 20%
		const profitBoost = 1 + prestigeLevels.productionBoost * 0.2;

		let profit = this.prodMoney[id] * profitBoost;
		const itemProfit = this._calcItemProfits(id) * profitBoost;
		if (itemProfit === null) return null;

		profit += itemProfit;

		// Calculation based on https://discord.com/channels/1011563751884988467/1011563751884988469/1050410586778902641
		profit *= assignedFraction;
		profit *= materialFraction;
		// More prods mean less profit per prod
		profit *= this._calcProfitScalar(id, prodCount);
		profit *= this.prodProfitFactor;

		profit -= supplyCost;

		if (id === 0) profit *= this.streetProfitFactor;
		profit /= this.narcoCounts[id] * (id === 4 ? prodCount : 1); // Also dealing with coke custom scaling
		return profit;
	}
	_updateSupplyInfo(container, id) {
		if (id < 2) return;
		// Get supply items
		const requiredElement = container.querySelector("p.card-text.text-center.mb-0");
		const ownedElement = container.querySelector("p.card-text.text-center.fst-italic");

		const requiredText = requiredElement ? requiredElement.innerText.replace(/\D/g, "") : "N/A"; // Extract numbers only
		const ownedText = ownedElement ? ownedElement.innerText.replace(/\D/g, "") : "N/A"; // Extract numbers only

		this.required[id] = parseInt(requiredText);
		this.owned[id] = parseInt(ownedText);
	}
	_getProdCount(container) {
		const prodCountText = container.querySelectorAll("tbody tr.align-middle th");
		if (prodCountText.length === 0) return 1;
		return parseInt(prodCountText[1].textContent) || 1;
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
		// street crime + offices have no supply cost
		if (id < 2) return 0;

		const prodReqsText = container.querySelector("p.card-text.text-center.mb-0");

		// Matches x<number>
		const regexResult = prodReqsText.textContent.match(/^x(\d+)/);
		const prodReqValue = parseInt(regexResult?.[1]);
		let supplyCost = 0;
		for (const itemName of Object.keys(this.prodReqs[id])) {
			const itemVal = this.getItemValue(itemName);
			if (itemVal === null) return null;
			supplyCost += itemVal * prodReqValue / (id === 4 ? 1 : prodCount);
		}
		return supplyCost;
	}
	_assignedNarcosChange(e) {
		const containers = document.querySelectorAll("div.row.g-0.align-items-center.h-100.flex-column");
		const id = parseInt(e.target.id.slice(8));

		this.profit[id] = this._calcProfit(id, containers[id]);

		this.assigned[id] = parseInt(e.target.value);

		this._updateDailyProfit();

		this._updateExpectedProfit(containers, id);
	}
	_updateDailyProfit() {
		const containers = document.querySelectorAll("div.row.g-0.align-items-center.h-100.flex-column");
		const dailyProfitText = document.querySelector("span#dailyProfit");
		const dailyProfitCokeText = document.querySelector("span#dailyProfitMinusCoke");
		const dailyProfit = this._calcDailyProfit(containers);

		dailyProfitText.innerText = `${POUND}${Math.round(dailyProfit).toLocaleString("en-US")}`;

		this._adjustColors(dailyProfitText, dailyProfit);

		const cokeVal = this.getItemValue("Cocaine");
		const dailyProfitCoke = dailyProfit - this.maxCokeDaily * cokeVal;
		dailyProfitCokeText.innerText = `${POUND}${cokeVal === null ? "???" : Math.round(dailyProfitCoke).toLocaleString("en-US")}`;
		if (cokeVal === null) return;

		this._adjustColors(dailyProfitCokeText, dailyProfitCoke);
	}
	_updateDistribution(sliderElem, id) {
		this._setDistribution(sliderElem, id);

		const containers = document.querySelectorAll("div.row.g-0.align-items-center.h-100.flex-column");
		this._updateExpectedProfit(containers, id);
		this._updateDailyProfit();
	}
	_setDistribution(sliderElem, id) {
		const taintedChance = 100 - parseInt(sliderElem.value);
		const containers = document.querySelectorAll("div.row.g-0.align-items-center.h-100.flex-column");
		if (id == 2) {
			this.taintedChance[0] = taintedChance;
			this.itemCounts[id]['Cannabis'] = this.maxCannabis / 2 * (1 - this.taintedChance[0] / 100);
			this.itemCounts[id]['Tainted Cannabis'] = this.maxCannabis / 2 * this.taintedChance[0] / 100;
		}
		if (id == 4) {
			this.taintedChance[1] = taintedChance;
			this.itemCounts[id]['Cocaine'] = this.maxCoke / 2 * (1 - this.taintedChance[1] / 100);
			this.itemCounts[id]['Tainted Cocaine'] = this.maxCoke / 2 * this.taintedChance[1] / 100;
		}
		this.profit[id] = this._calcProfit(id, containers[id]);
	}
	_updateExpectedProfit(containers, id) {
		const container = containers[id];

		const expectedProfit = container.querySelector('p#expected-profit-' + id);
		if (this.profit[id] !== null) {
			const colorVal = (this.profit[id] - this.minProfit) / (this.maxProfit - this.minProfit);
			expectedProfit.innerHTML = `Profit: <span class="fw-bold" style="color: hsl(${this.profit[id] >= 0 ? colorVal * 120 : 0}, 67%, ${this.brightness}%)">${POUND}${Math.floor(this.profit[id]).toLocaleString("en-US")}/narco</span>`;
		} else
			expectedProfit.innerHTML = `Profit: <span class="text-muted">${POUND}???/narco</span>`;

		const narcoInput = containers[id].querySelector("input.assignNarcoInput");
		this.assigned[id] = parseInt(narcoInput.value.replaceAll(',', ""));
	}
	_updateDaysLeft(daysLeftElement, id) {
		// Calculate days left
		// Skip street crimes and offices
		if (id < 2) return;

		const owned = this.owned[id];
		const required = this.required[id];
		
		if (!isNaN(required) && !isNaN(owned) && required > 0) {
			const daysLeft = Math.floor(owned / required);

			let colorClass = "text-success";
			if (daysLeft <= 3) colorClass = "text-danger";
			else if (daysLeft <= 10) colorClass = "text-warning";

			daysLeftElement.innerHTML = `Days Left: <span class="fw-bold ${colorClass}">${daysLeft}</span>`;
		} else {
			daysLeftElement.innerHTML = `Days Left: <span class="fw-bold text-muted">N/A</span>`;
		}
	}
	_calcDailyProfit(containers) {
		let dailyProfit = 0;
		for (let j = 0; j !== containers.length; ++j) 
			dailyProfit += this.profit[j] * this.assigned[j];
		return dailyProfit;
	}
	_adjustColors(elem, value) {
		elem.classList.remove("text-danger", "text-warning", "text-success");
		const className = value > 0 ? "text-success" : value < 0 ? "text-danger" : "text-warning";
		elem.classList.add(className);
	}
	_constructProdHeader() {

		// Create Expected Daily Profit card
		const expectedProfit = document.createElement("div");
		expectedProfit.classList.add("mb-4", "card");
		expectedProfit.innerHTML = `<div class="header-section"><h2>Expected Daily Profit</h2></div><div class="card-body"><p class="card-text text-center">Each day your narcos will produce roughly <span id="dailyProfit" class="fw-bold"></span> in profit.<br>If you take ${this.maxCokeDaily} cocaine daily, your net profit is <span id="dailyProfitMinusCoke" class="fw-bold"></span> per day.</p></div>`;

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

			const standardJobRepBonus = getNumericValue('perks', 'Standard Job Rep');
			// Apply only to standard jobs
			if (i <= 4) this.jobRep[i] *= (1 + (standardJobRepBonus / 100));

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
		const valueTracker = {totalVal: 0, haveAll: true};

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
				const gameItemValue = parseInt(item.children[3].innerText.slice(1).replaceAll(',', "")) || 0;
				valueTracker.totalVal += gameItemValue * countOf;
				valueTracker.haveAll = false;
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
			valueTracker.totalVal += currentBest * countOf;
		}

		const totalValCard = this._createTotalValueCard(valueTracker);
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
	inUserProfile(url) {
		const galleryCards = document.querySelectorAll('#mainBackground > div.container > div.row > div.col-12 > div.mt-3.card:nth-child(10) > div.row.gx-0 > div.container > div.row.row-cols-3.row-cols-md-6.g-3 > div.col > div.galleryCard');
		if (galleryCards.length === 0) return;

		for (const galleryCard of galleryCards) {
			this._handleGalleryCard(galleryCard);
		}
	}
	_handleGalleryCard(card) {
		const nameAndAmount = card.querySelector('div > h5').textContent;
		const nameRegex = new RegExp('^(.*) x(\\d+)$');
		const nameRegexResult = nameRegex.exec(nameAndAmount);
		
		const name = nameRegexResult[1];
		const amount = parseInt(nameRegexResult[2]);

		const itemValue = this.getItemValue(name);
		if (itemValue === null) return;

		const cardValue = amount * itemValue;
		const valueTextNode = card.querySelector('div > p:last-of-type').childNodes[2];

		valueTextNode.textContent = `${POUND}${cardValue.toLocaleString('en-us')}`;
	}
	inGallery(url) {
		const galleryElem = document.querySelector('#sortableGallery');
		const valueTracker = {totalVal: 0, haveAll: true};

		// Add an offset for the div position in the gallery table
		// if you look at gallery of another player.
		const userInfo = getUserInfoFromStorage();
		let offset = 0;
		if (url.split('/').at(-1) !== userInfo.user_id.toString()) offset = -1;

		for (const item of galleryElem.children) {
			this._handleGalleryRow(item, valueTracker, offset);
		}

		const totalValCard = this._createTotalValueCard(valueTracker);
		galleryElem.parentElement.insertBefore(totalValCard, galleryElem);
		
	}
	_handleGalleryRow(elem, valueTracker, offset=0) {
		const getSelectColString = (index) => `div:nth-of-type(${index + offset})`;

		const nameElem = elem.querySelector(getSelectColString(2) + ' > div > span');
		const name = nameElem.textContent;

		const amountElem = elem.querySelector(getSelectColString(6));
		const amount = parseInt(amountElem.textContent.slice(1));

		const itemValue = this.getItemValue(name);
		if (itemValue === null) {
			valueTracker.haveAll = false;
			return;
		}

		const rowValue = amount * itemValue;
		valueTracker.totalVal += rowValue;
		const valueTextNode = elem.querySelector(getSelectColString(5));

		valueTextNode.textContent = `${POUND}${rowValue.toLocaleString('en-us')}`;
	}
	_createTotalValueCard(valueTracker) {
		const totalValCard = document.createElement('div');
		totalValCard.classList.add('card-body', 'mb-2');
		totalValCard.innerHTML = `<p class="card-text">The value of these items is <span class="fw-bold">${POUND}${valueTracker.totalVal.toLocaleString('en-US')}${valueTracker.haveAll ? '' : '+'}</span>.</p>`;
		return totalValCard;
	}
}


class BetterMoneyInputs {

	static metadata = {
		displayName: 'Better Money Inputs',
		description: 'Press \'a\' to add all your money and \'h\' to add half your money',
		settings: {
			active: {
				inBank: {
					description: 'Affects the deposit- and withdraw input'
				},
				inCartelArmory: {
					description: 'Affects the point deposit input'
				},
				inTradeView: {
					description: 'Affects the cash- and point input'
				},
				inMarket: {
					description: 'Affects the cash- and point input'
				},
				inUserProfile: {
					description: 'Affects the send cash input'
				}
			},
			custom: {
			}
		}
	}

	constructor() { }
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
		if (AutoNumeric.isManagedByAutoNumeric(input))
			this._changeAutonumeric(input);

		else
			input.addEventListener("autoNumeric:initialized", () => this._changeAutonumeric(input));
	}
	_listener(e, input) {
		const elem = AutoNumeric.getAutoNumericElement(input);
		const curVal = parseFloat(elem.get().replaceAll(',', ""));
		const max = elem.getSettings().maximumValue;
		if (e.ctrlKey) return;

		if (e.key === 'a')
			elem.set(max);
		else if (e.key === 'h')
			elem.set(Math.floor(max / 2));
	}
	listener(e, input) {
		if (AutoNumeric.isManagedByAutoNumeric(input)) 
			this._listener(e, input);
		else
			input.addEventListener("autoNumeric:initialized", () => this._listener(e, input));
	}
	update(input) {
		this.changeAutonumeric(input);
		input.addEventListener("keydown", e => this.listener(e, input));
	}
	inBank(url) {
		const depositInput = document.querySelector("input#depositInput");
		const withdrawInput = document.querySelector("input#withdrawInput");
		if (depositInput === null) return;

		this.update(depositInput);
		this.update(withdrawInput);
	}
	inCartelArmory(url) {
		const pointsDeposit = document.querySelector("input#pointsdepositquantity");
		if (pointsDeposit === null) return;

		this.update(pointsDeposit);
	}
	inTradeView(url) {
		const cashInput = document.querySelector("input#cashModifier");
		const pointsInput = document.querySelector("input#pointsModifier");
		if (cashInput === null || cashInput.disabled) return;

		this.update(cashInput);
		this.update(pointsInput);
	}
	inMarket(url) {
		const pricePer = document.querySelector("input#priceper");
		const pointsPricePer = document.querySelector("input#pointspriceper");
		const qty = document.querySelector("input#quantity");
		const pointsQty = document.querySelector("input#pointsquantity");
		if (pricePer === null) return;

		this.update(pricePer);
		this.update(pointsPricePer);
		this.update(qty);
		this.update(pointsQty);

		pointsPricePer.min = 0; // Make it like pricePer
		if (AutoNumeric.isManagedByAutoNumeric(pointsPricePer)) {
			const elem = AutoNumeric.getAutoNumericElement(pointsPricePer);
			elem.update({ minimumValue: 0 });
		} else {
			pointsPricePer.addEventListener("autoNumeric:initialized", () => {
				const elem = AutoNumeric.getAutoNumericElement(pointsPricePer);
				elem.update({ minimumValue: 0 });
			});
		}
	}
	inUserProfile(url) {
		const sendCash = document.querySelector("input#sendCashInput");
		if (sendCash === null) return;

		this.update(sendCash);
	}
}


class BetterProgressBars {

	static metadata = {
		displayName: 'Better Progress Bars',
		description: 'Change progress bars to be striped and animated',
		settings: {
			active: {
				inExpeditions: {
					description: 'Affects the scicario level progress bar'
				},
				inJobs: {
					description: 'Affects the prestige progress bar'
				},
				inAnywhere: {
					description: 'Affects the health- and energy progress bars'
				},
				inEstateAgent: {
					description: 'Affects the build progress bar'
				},
				inCartelPerks: {
					description: 'Affects the perk progress bars'
				},
				inProperty: {
					description: 'Affects the upgrade progress bars'
				}
			},
			custom: {
			}
		}
	}

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
	inEstateAgent(url) {
		this.inBarPage(url);
	}
	inCartelPerks(url) {
		this.inBarPage(url);
	}
	inProperty(url) {
		this.inBarPage(url);
	}
	inExpeditions(url) {
		const bars = document.querySelectorAll(".progress-bar-striped");
		for (const bar of bars) bar.classList.remove("bg-success");
	}
	inJobs(url) {
		const bars = document.querySelectorAll("div.equipmentModule .progress-bar");
		for (const bar of bars) {
			const val = parseFloat(bar.getAttribute("aria-valuenow"));
			bar.classList.remove("bg-success");
			bar.classList.add("progress-bar-striped");
			bar.style.backgroundColor = `hsl(${val / 100 * 120}, 67%, 30%)`;
		}
		const buttons = document.querySelectorAll("div.equipmentModule form > .btn.w-100:not(#upgradeTimeButton):not(#upgradeRewardButton)");
		if (buttons.length !== 1) return;

		const bar = buttons[0].parentNode.parentNode.querySelector(".progress-bar");
		bar.classList.add("progress-bar-animated");
	}

	inBarPage(url) {
		const bars = document.querySelectorAll(".progress-bar.bg-dark");
		for (const bar of bars) {
			bar.classList.remove("bg-dark");
			bar.classList.add("fs-6");
		}
	}

	inAnywhere() {
		const healthTimer = document.getElementById("lifeProgressBar");
		const energyTimer = document.getElementById("energyProgressBar");

		const healthBar = document.getElementById("lifeProgress");
		healthBar.classList.add("progress-bar-striped");
		const energyBar = document.getElementById("energyProgress");
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

	static metadata = {
		displayName: 'Blackjack Helper',
		description: 'Highlight the best next move',
		settings: {
			active: {
				inBlackjack: {
					description: 'Highlight the best next move and record your statistics'
				},
				inBlackjackStats: {
					description: 'Display your statistics'
				}
			},
			custom: {
			}
		}
	}

	constructor() {
		this.statsRegex = /^casino\/blackjackstats(\/|\/?\?.+)?/;
		this.id = "totalProfit";
		this.statsLink = "/Casino/blackjackStats";
		if (this.getStats() === null)
			this.setStats([0, 0, 0, 0, 0, 0, 0, 0]);
		if ([null, NaN].includes(this.getMoneyStat("Profit")))
			this.setMoneyStat("Profit", 0);
		if ([null, NaN].includes(this.getMoneyStat("Gain")))
			this.setMoneyStat("Gain", 0);
		if ([null, NaN].includes(this.getMoneyStat("Loss")))
			this.setMoneyStat("Loss", 0);
		this.statIndexes = ["Blackjack", "Win", "Lose", "Bust", "Surrendered", "Push", "Times split", "Times doubled"];
		this.cardVals = ['2', '3', '4', '5', '6', '7', '8', '9', 'K', 'A'];
		// https://www.beatingbonuses.com/bjstrategy.php?decks2=4&h17=stand&doubleon2=any2cards&peek2=off&surrender2=earlyf&charlie2=no&dsa2=on&resplits2=0&shuffle=0&bj=3to2&opt2=1&btn2=Generate+Strategy
		this.houseOdds = -0.17; // percent
		this.blackjackBroken = true; // 1.5x payout instead of push when both get blackjack
		this.normalTable = [
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
		return getNumericValue('blackjack', stat);
	}
	setMoneyStat(stat, money) {
		setValue('blackjack', stat, money);
		console.debug(`Set blackjack_${stat} to ${POUND}${money.toLocaleString("en-US")}`);
		return money;
	}
	getStats() {
		return this.getMoneyStat('Stats');
	}
	setStats(stats) {
		setValue('blackjack', 'Stats', stats);
		console.debug(`Set blackjack_Stats to ${JSON.stringify(stats)}`);
		return stats;
	}
	addProfit(val) {
		const setTo = this.getMoneyStat("Profit") + val;
		// Not sure why this is happening
		if (isNaN(setTo)) return;

		this.setMoneyStat("Profit", setTo);
		if (val > 0)
			this.setMoneyStat("Gain", this.getMoneyStat("Gain") + val);
		else
			this.setMoneyStat("Loss", this.getMoneyStat("Loss") - val);

		let profitText = document.querySelector(`span#${this.id}`);
		profitText.innerText = `${POUND}${setTo.toLocaleString("en-US")}`;
		if (setTo > 0) {
			profitText.classList.remove("text-warning", "text-danger");
			profitText.classList.add("text-success");
			return;
		}
		if (setTo < 0) {
			profitText.classList.remove("text-warning", "text-success");
			profitText.classList.add("text-danger");
			return;
		}
		profitText.classList.remove("text-success", "text-danger");
		profitText.classList.add("text-warning");
	}
	addStat(gameType) {
		if (!this.statIndexes.includes(gameType)) return;

		const curStats = this.getStats();
		curStats[this.statIndexes.indexOf(gameType)] += 1;
		this.setStats(curStats);
	}
	inBlackjack(url) {
		GM_addStyle(".click-this { background-color: #0d6efd !important; border: var(--bs-btn-border-width) solid #0d6efd !important }");

		const container = document.querySelector("#mainBackground > div > div > div.col-12");
		const ellen = container.querySelector("div.card.mb-3");
		if (ellen === null) return;

		ellen.classList.remove("mb-3");
		ellen.outerHTML = `<div class="row"><div class="col-xl-9 col-12 mb-4">${ellen.outerHTML}</div><div class="col-xl-3 col-12 mb-4"><div class="card h-100"><div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Total Profit</h2></div></div></div><div class="card-body"><p class="card-text text-center">Total running profit: <span id="${this.id}" class="fw-bold text-warning">${POUND}???</span>.</p><p class="card-text text-center"><span class="fs-2 text-${this.houseOdds > 0 ? "danger" : this.houseOdds < 0 ? "success" : "warning"}">${this.houseOdds.toFixed(2)}%</span> house odds</p></div></div></div></div>`;
		this.addProfit(0);

		const statsLink = document.createElement("a");
		statsLink.href = this.statsLink;
		statsLink.innerHTML = `<button class="btn btn-sm btn-dark">Stats</button>`;
		const linkContainer = container.querySelector("div.gap-2.flex-wrap");
		const rulesLink = linkContainer.querySelector("a");
		linkContainer.insertBefore(statsLink, rulesLink);

		const dealButton = container.querySelector("button#deal");
		const betAmountInput = container.querySelector("input#betAmountInput");
		const hitButton = container.querySelector("button#hit");
		if (hitButton === null) return;

		const standButton = container.querySelector("button#stand");
		const doubleButton = container.querySelector("button#double");
		const splitButton = container.querySelector("button#split");
		const surrenderButton = container.querySelector("button#surrender");
		const result = container.querySelector("div#result");
		const bjGame = container.querySelector("div#blackjackGame");
		const dealerCards = bjGame.querySelector("div#dealerCards");
		const playerCards = bjGame.querySelector("div#playerCards");

		const removeHighlights = () => {
			for (const button of [hitButton, standButton, doubleButton, splitButton, surrenderButton])
				button.classList.remove("click-this");
		};

		observeDOM(bjGame, () => {
			removeHighlights();
			const dealerCardText = dealerCards.innerText.replace(/10|J|Q/g, "K");
			if (dealerCardText.length !== 1) return;

			const dealerVal = this.cardVals.indexOf(dealerCardText) + 2;
			const playerCardText = playerCards.innerText.replace(/\s+/g, '').replace(/10|J|Q/g, "K");
			if (playerCardText.length < 2) return;

			let playerVal = 0;
			for (const l of playerCardText)
				playerVal += this.cardVals.indexOf(l) + 2;

			const move = this.determineNextMove(playerCardText, playerVal, dealerVal, splitButton, standButton);

			const hl = button => button.classList.add("click-this");

			switch (move) {
				case 'H':
					hl(hitButton);
					return;
				case 'J':
					hl(playerCardText.length === 2 ? hitButton : standButton);
					return;
				case 'S':
					hl(standButton);
					return;
				case 'D':
					hl(doubleButton.disabled ? hitButton : doubleButton);
					return;
				case 'E':
					hl(doubleButton.disabled ? standButton : doubleButton);
					return;
				case 'P':
					hl(splitButton);
					return;
				case 'R':
					hl(surrenderButton.disabled ? hitButton : surrenderButton);
					return;
				case 'Q':
					hl(surrenderButton.disabled ? standButton : surrenderButton);
					return;
				default:
					console.warn('Invalid move');
			}
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
			if (val === "") return;

			let betAmount = parseInt(betAmountInput.value.replaceAll(',', ""));
			if (doubled) betAmount *= 2;

			doubled = false;
			this.addStat(val.split(' ')[0].replace('!', ""));

			if (val.startsWith("Win") || val.startsWith("Blackjack")) {
				e[0].target.classList.add("text-success");
				e[0].target.classList.remove("text-warning", "text-danger");
				const textSplit = val.split(' ');
				const won = parseInt(textSplit[textSplit.length - 1].slice(1).replaceAll(',', ""));
				this.addProfit(betAmount + won);
				return;
			}
			if (val === "Push") {
				e[0].target.classList.add("text-warning");
				e[0].target.classList.remove("text-success", "text-danger");
				this.addProfit(betAmount);
				return;
			}
			if (val === "Surrendered") {
				e[0].target.classList.add("text-warning");
				e[0].target.classList.remove("text-success", "text-danger");
				this.addProfit(Math.floor(betAmount / 2));
				return;
			}
			e[0].target.classList.add("text-danger");
			e[0].target.classList.remove("text-warning", "text-success");
		});
	}
	determineNextMove(playerCardText, playerVal, dealerVal, splitButton, standButton) {
		let move = '';
		if (playerCardText.length === 2) {
			if (playerCardText[0] === playerCardText[1]) {
				if (!splitButton.disabled)
					move = this.splitTable[playerVal / 2 - 2][dealerVal - 2];
			} else if (playerCardText[0] === 'A' || playerCardText[1] === 'A') {
				if (playerVal === 21) {
					if (!standButton.disabled) move = 'S';
				}
				else
					move = this.softTable[playerVal - 11 - 2][dealerVal - 2];
			}
		}
		if (move === "" && playerCardText.includes('A') && playerVal <= 21)
			move = this.softTable[playerVal - 11 - 2][dealerVal - 2];
		if (move === "") {
			while (playerCardText.includes('A') && playerVal > 21) {
				playerVal -= 10;
				playerCardText.replace('A', 'a');
			}
			playerCardText.replaceAll('a', 'A');
			move = this.normalTable[Math.min(11, Math.max(0, playerVal - 7))][dealerVal - 2];
		}
		return move;
	}
	inBlackjackStats(url) {
		document.title = "Blackjack Stats | Cartel Empire";
		const container = document.querySelector("div.content-container.contentColumn");
		let insertHTML = "";

		const urlParams = new URLSearchParams(window.location.search);
		const reset = urlParams.get("resetMoney");
		if (reset === "true") {
			this.setMoneyStat("Profit", 0);
			this.setMoneyStat("Gain", 0);
			this.setMoneyStat("Loss", 0);
			window.history.replaceState({}, document.title, this.statsLink); // remove params from URL
		}

		let colorClass = "text-warning";
		const curProfit = this.getMoneyStat("Profit");
		const curGain = this.getMoneyStat("Gain");
		const curLoss = this.getMoneyStat("Loss");
		if (curProfit) {
			if (curProfit > 0) colorClass = "text-success";
			else if (curProfit < 0) colorClass = "text-danger";
		}
		const curStats = this.getStats();
		let totalGames = 0;
		for (const gameCount of curStats) totalGames += gameCount;
		for (let i = 0; i !== curStats.length; ++i)
			insertHTML += `<tr class="align-middle"><td>${this.statIndexes[i]}</td><td>${curStats[i]}</td><td>${(curStats[i] / totalGames * 100).toFixed(2)}%</td></tr>`;
		insertHTML += `<tr class="align-middle"><td>Hands played</td><td>${totalGames}</td><td></td></tr><tr class="align-middle"><td>Total gain</td><td>${POUND}${curGain !== null ? curGain.toLocaleString("en-US") : 0}</td><td></td></tr><tr class="align-middle"><td>Total loss</td><td>${POUND}${curLoss !== null ? curLoss.toLocaleString("en-US") : 0}</td><td></td></tr><tr class="align-middle"><th>Net total profit</th><th class="${colorClass}">${POUND}${curProfit ? curProfit.toLocaleString("en-US") : 0}</th><td></td></tr><tr class="align-middle"><td>Reset money stats</td><td></td><td><button onclick="window.location.href += '?resetMoney=true'" title="Reset" aria-label="Reset money stats" class="btn btn-danger action-btn fw-normal">Reset</button></td></tr>`;

		const tableHTML = `<div class="mb-4 card"><div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Blackjack Stats</h2></div></div></div><div class="card-body"> <div class="table-responsive"><table class="table align-items-center table-flush dark-tertiary-bg" id="blackjackStatsTable"><thead class="thead-light"><tr><th scope="col">Value</th><th scope="col">Count</th><th scope="col">Chance</th></tr></thead><tbody>${insertHTML}</tbody></div></div></div>`;
		container.innerHTML = `<div class="col-12 col-md-10"><div class="gap-2 d-flex justify-content-md-end mb-2 flex-wrap"><a href="/Casino/Blackjack"><button class="btn btn-sm btn-dark">Back to Blackjack </button></a></div>${tableHTML}</div>`;
	}
}


class BuyMaxButton {

	static metadata = {
		displayName: 'Buy Max Button',
		description: 'Add a button to all town store items to buy all items at once',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() {
	}
	inArmedSurplus(url) {
		this._modifiySellBox();
	}
	inPharmacy(url) {
		this._modifiySellBox();
	}
	inMateos(url) {
		this._modifiySellBox();

		// Also modify the Buy Points box
		const form = document.querySelector('form[action="/Town/buyPoints/"]');
		const inputElem = form.querySelector('input#pointsToBuy');
		if (!inputElem) return;

		const maxAmount = Math.floor(parseInt(inputElem.getAttribute('max')));
		if (maxAmount === 0) return;

		const BuyMaxButton = this._createBuyMaxButton(maxAmount, form);

		form.appendChild(BuyMaxButton);
	}
	inDiablos(url) {
		this._modifiySellBox();
	}
	inCarDealership(url) {
		this._modifiySellBox();
	}
	inPetshop(url) {
		this._modifiySellBox();
	}
	_modifiySellBox(){
		const sellBoxElem = document.querySelector('div.container.inventoryWrapper');
		const items = sellBoxElem.querySelectorAll('div.inventoryItemWrapper');
		if (items.length === 0) return;

		for (const item of items) {
			const inputGroupElem = item.querySelector('div:nth-of-type(6) > div.input-group');
			const inputElem = inputGroupElem.querySelector('input');
			// Sold out or can't afford
			if (!inputElem) continue;

			const maxItems = Math.floor(parseInt(inputElem.getAttribute('max')));
			if (maxItems === 0) return;

			const BuyMaxButton = this._createBuyMaxButton(maxItems, inputGroupElem);

			inputGroupElem.appendChild(BuyMaxButton);
		}
	}

	_createBuyMaxButton(amount, inputGroupElem) {
		const btnMaxElem = document.createElement('button');
		btnMaxElem.textContent = 'MAX';
		btnMaxElem.classList = 'btn btn-sm btn-success';

		btnMaxElem.addEventListener('click', () => {
			const inputElem = inputGroupElem.querySelector('input');
			inputElem.value = amount;
			// Update the buy-button
			inputElem.dispatchEvent(new Event('change'));

			// Trigger a click on the buy button
			const originalButton = inputGroupElem.querySelector('button');
			originalButton.disabled = false;
			originalButton.dispatchEvent(new Event('click'));

		});

		return btnMaxElem;
	}
}


class BuyPointsLink {

	static metadata = {
		displayName: 'Buy Points Link',
		description: 'Add a link to Mateo\'s store',
		settings: {
			active: {
				inSupporter: {
					description: 'Add a link to Mateo\'s store to the energy refill card'
				}
			},
			custom: {
			}
		}
	}

	constructor() {
		this.add = `<div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Buy Points</h2></div></div></div><div class="card-body"><p class="card-text">Go to the <a class="text-white" href="/market?p=Points">Item Market</a> to buy points.</p></div>`;
	}

	inSupporter(url) {
		// Find the container (updated from the previous class names)
		let container = document.querySelector("div.col-12"); // Adjust this selector if needed
		if (!container) return;

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


class CartelMemberRep {

	static metadata = {
		displayName: 'Cartelmember Reputation',
		description: 'Display how much reputation each member earned',
		settings: {
			active: {
				inAttackLog: {
					description: 'Store the reputation earned by each member'
				},
				inCartel: {
					description: 'Display the reputation earned by each member'
				},
			},
			custom: {
			}
		}
	}

	constructor() {
		this.attackList = this.getAttackList();
		if (this.attackList === null) {
			this.attackList = [];
			this.setAttackList(this.attackList);
		}
	}
	getAttackList() {
		return getValue('cartelMemberRep', 'attackList');
	}
	setAttackList(list) {
		setValue('cartelMemberRep', 'attackList', list);
		console.debug(`Set cartelMemberRep_attackList to ${JSON.stringify(list)}`);
		return list;
	}
	getMemberRep(memberID) {
		return getNumericValue('cartelMemberRep', memberID);
	}
	setMemberRep(memberID, rep) {
		setValue('cartelMemberRep', memberID, rep);
		console.debug(`Set cartelMemberRep_${memberID} to ${rep.toLocaleString("en-US")}`);
		return rep;
	}
	processLogs(rows) {
		for (const row of rows) {
			const [date, data] = row.children;
			const ID = parseInt(data.children[2].href.match(/\d+/)[0]);
			if (!/\(\+\d+\)/.test(data.textContent)) {
				date.classList.add("text-muted"); // Doesn't need to be done
				continue;
			} else if (this.attackList.includes(ID)) {
				date.classList.add("text-muted"); // Signal that it's already been done
				continue;
			}
			this.attackList.push(ID);
			this.setAttackList(this.attackList);

			const rep = parseInt(/\(\+(\d+)\)/.exec(data.innerText)[1]);
			const attackerID = data.children[0].href.match(/\d+/)[0];
			const oldRep = this.getMemberRep(attackerID);
			this.setMemberRep(attackerID, oldRep === null ? rep : oldRep + rep);
		}
	}
	inAttackLog(url) {
		const rows = document.querySelectorAll("table#eventsTable tbody tr");
		if (rows?.length <= 0) return;
		
		this.processLogs(rows);
	}
	inCartel(url) {
		const attackTable = document.querySelectorAll("table#eventsTable tbody")[1];
		const rows = attackTable.querySelectorAll("tr");
		this.processLogs(rows);

		const table = document.querySelector("div.card-body > div.container-fluid");
		if (table === null) return;

		const tableHead = table.querySelector(".row-header");
		let levelCol = tableHead.querySelectorAll(".col")[1]; // Already reduced to col-xl-1 by stat estimate
		let roleCol = tableHead.querySelectorAll(".col-3")[0];
		let daysCol = tableHead.querySelectorAll('.col')[3];
		let repCol = document.createElement("div");
		repCol.classList.add("col", "col-xl-1");
		repCol.innerText = "Added Rep";
		tableHead.insertBefore(repCol, levelCol);
		roleCol.classList = 'col-3 col-xl-2';
		daysCol.classList = 'col col-xl-1';

		const entries = table.querySelectorAll(".row.align-middle");
		for (const entry of entries) {
			const cols = entry.querySelectorAll(".col");
			levelCol = cols[0];
			roleCol = cols[3];
			repCol = document.createElement("div");
			repCol.classList.add("col", "col-xl-1");
			roleCol.classList.remove("col-xl-2");
			roleCol.classList.add("col-xl-1");

			const userLink = entry.querySelector('div.d-none > a');
			const userID = userLink.href.match(/\d+$/)[0];

			const rep = this.getMemberRep(userID);
			repCol.innerText = rep === null ? 0 : rep.toLocaleString("en-US");
			entry.insertBefore(repCol, levelCol);
		}
	}
}


class CenterTabs {

	static metadata = {
		displayName: 'Center Tabs',
		description: 'Center tabs and spread them to the full length of their container',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() {}

	inExpeditions() {
		this._centerTabs();
	}
	inMarket() {
		this._centerTabs();
	}
	inEstateAgent() {
		this._centerTabs();
	}
	inCartelPerks() {
		this._centerTabs();
	}
	inHighscores() {
		this._centerTabs();
	}
	inProperty() {
		this._centerTabs();
	}
	inSettings() {
		this._centerTabs();
	}
	_centerTabs() {
		const tabs = document.querySelectorAll(".nav-tabs");
		for (const tab of tabs) tab.classList.add("nav-justified");

		GM_addStyle(".nav-tabs .nav-link.active { border-bottom: 3px solid #0d6efd !important }");
	}
}


class CenterText {

	static metadata = {
		displayName: 'Center Text',
		description: 'Center the text',
		settings: {
			active: {
				inTown: {
					description: 'Center the name and text of each location'
				},
				inAnywhere: {
					description: 'Center the name of each chat'
				},
			},
			custom: {
			}
		}
	}

	constructor() { }
	inTown(url) {
		const places = document.querySelectorAll("div.equipmentModule p.card-text.flex-grow-1");
		for (const place of places) place.classList.add("text-center");
	}
	inAnywhere() {
		const chatRows = document.querySelector("div.chats.row");
		const chatObserver = e => {
			for (const ev of e) {
				if (ev.target !== chatRows) continue;

				for (const addedChat of ev.addedNodes) {
					let header = addedChat.querySelector("div.header h6");
					header.classList.add("text-center");
				}
			}
		};
		observeDOM(chatRows, chatObserver);

		const headers = chatRows.querySelectorAll("div.header h6");
		for (const header of headers) header.classList.add("text-center");
	}
}

class ColorChatNames {

	static metadata = {
		displayName: 'Color Names',
		description: 'Color friend names green and enemie names red',
		settings: {
			active: {
				inConnections: {
					description: 'Store the list of friends / enemies'
				},
				inUserProfile: {
					description: 'Update the stored list when you add / remove a friend / enemy'
				},
				inBountyOrOtherCartel: {
					description: 'Color names in the member list / bounty list'
				},
				inTrade: {
					description: 'Color the names in the trade list'
				},
				inMail: {
					description: 'Color the names in the mail list'
				},
				inMarket: {
					description: 'Color the names in the offer list'
				},
				inForumCategory: {
					description: 'Color the name of the authors'
				},
				inForumPost: {
					description: 'Color both author- and comment names'
				},
				inAnywhere: {
					description: 'Color names when they appear with a link to the user profile'
				},
			},
			custom: {
			}
		}
	}

	constructor() {
		this.ownID = user_id;
	}
	ownColor(l) {
		return `hsl(200, 70%, ${l}%)`;
	}
	getList(friends = true) {
		const list = getValue('connections', friends ? 'friends' : 'enemies');
		return list === null ? [] : list;
	}
	setList(list, friends = true) {
		setValue('connections', friends ? 'friends' : 'enemies', list);
		console.debug(`Set connections_${friends ? "friends" : "enemies"} to ${JSON.stringify(list)}`);
		return list;
	}
	inConnections(url) {
		const lists = document.querySelectorAll("div.card-body  div.tab-content");
		if (lists.length < 2) return;

		const friends = lists[0].querySelectorAll("a.fw-bold");
		const enemies = lists[1].querySelectorAll("a.fw-bold");
		let list = [];
		for (const user of friends) {
			list.push(user.href.match(/\d+$/)[0]);
		}
		this.setList(list, true);
		list = [];
		for (const user of enemies) {
			list.push(user.href.match(/\d+$/)[0]);
		}
		this.setList(list, false);
	}
	inUserProfile(url) {
		const text = document.querySelector("div.card p.card-text.fw-bold");
		if (text === null) return;

		const textSplit = text.innerText.split(' ');
		const userID = url.replace('#', "").match(/\d+\/?$/)[0];
		if (userID.endsWith('/')) userID = userID.slice(0, -1);

		if (textSplit[textSplit.length - 1] === "enemy") {
			let list = this.getList(false);
			if (textSplit[textSplit.length - 3] === "Added") {
				list.push(userID);
				let otherList = this.getList(true);
				otherList = otherList.filter(ID => ID !== userID);
				this.setList(otherList, true);
			} else if (textSplit[textSplit.length - 3] === "Removed")
				list = list.filter(ID => ID !== userID);
			this.setList(list, false);
		} else if (textSplit[textSplit.length - 1] === "friend") {
			let list = this.getList(true);
			if (textSplit[textSplit.length - 3] === "Added") {
				list.push(userID);
				let otherList = this.getList(false);
				otherList = otherList.filter(ID => ID !== userID);
				this.setList(otherList, false);
			} else if (textSplit[textSplit.length - 3] === "Removed")
				list = list.filter(ID => ID !== userID);
			this.setList(list, true);
		}
	}
	inBountyOrOtherCartel(url) {
		this.applyStyleChanges();
	}
	inTrade(url) {
		this.applyStyleChanges();
	}
	inMail(url) {
		this.applyStyleChanges();
	}
	inMarket(url) {
		this.applyStyleChanges();
	}
	inForumCategory(url) {
		this.applyStyleChanges();
	}
	inForumPost(url) {
		this.applyStyleChanges();
	}
	inAnywhere(url) {
		this.applyStyleChanges();
	}
	applyStyleChanges() {
		GM_addStyle(`[data-bs-theme="dark"] a.text-decoration-none[href$="/${this.ownID}"] > h3.user { color: ${this.ownColor(50)} }`);
		GM_addStyle(`[data-bs-theme="light"] a.text-decoration-none[href$="/${this.ownID}"] > h3.user { color: ${this.ownColor(45)} }`);
		const friends = this.getList(true);
		const enemies = this.getList(false);
		for (const userID of friends) {
			GM_addStyle(`a.text-decoration-none[href$="/${userID}"] > h3.user { color: rgb(var(--bs-success-rgb)) !important }`);
		}
		for (const userID of enemies) {
			GM_addStyle(`a.text-decoration-none[href$="/${userID}"] > h3.user { color: rgb(var(--bs-danger-rgb)) !important }`);
		}
	}
}


class ColorStats {

	static metadata = {
		displayName: 'Color Stats',
		description: 'Color different statistics',
		settings: {
			active: {
				inForumPost: {
					description: 'Color the forum respect'
				},
				inHighscores: {
					description: 'Color the highscore stat'
				},
				inHomepage: {
					description: 'Color your reputation, intelligence and battle stats'
				},
				inGym: {
					description: 'Color your battle stats'
				},
				inUniversity: {
					description: 'Color your intelligence'
				},
				inPersonalStats: {
					description: '(Broken) Color your reputation, intelligence and battle stats'
				},
				inInventory: {
					description: 'Color the item quality'
				},
				inMarket: {
					description: 'Color the item quality'
				}
			},
			custom: {
			}
		}
	}

	constructor() {
		const configManger = ConfigManager.getInstance();
		this.brightness = configManger.darkmode ? 50 : 45;
		this.maxInt = getNumericValue('perks', 'Max Int') || 1200;
	}
	calcGym(stat) {
		return Math.min(1, 12.5 / 120 * Math.log(stat / 51000 + 1)); // Arbitrary calculation, reaches 120 at ~750 mil (per stat)
	}
	calcInt(currentInt) {
		return 1 - Math.pow(this.maxInt - currentInt, 2) / Math.pow(this.maxInt, 2);
	}
	calcNetworth(networth) {
		return Math.min(1, networth / 600000000); // Arbitrary calculation, reaches max at 600 mil
	}
	calcAttacksWon(won) {
		return Math.min(1, won / 3000); // Arbitrary calculation, reaches max at 3000
	}
	calcRep(rep) {
		return Math.min(1, Math.log(rep / 420000 + 1)); // Arbitrary calculation, reaches max at ~720000
	}
	calcLevel(lvl) {
		return Math.min(1, lvl / 50); // Arbitrary calculation, reaches max at 50
	}
	calcRevives(revives) {
		return Math.min(1, revives / 1000); // Uses revive achievement, reaches max at 1000
	}
	calcCartelRep(rep) {
		return Math.min(1, Math.log(rep / 1300000 + 1)); // Arbitrary calculation, reaches max at ~2.22 mil
	}
	calcRespect(resp) {
		return Math.max(0, 226 - resp * (resp < 0 ? 15 : 3.7)); // Arbitrary calculation, reaches max at ~-15 if negative, or ~61 if positive
	}
	calcQuality(qualChance) {
		return Math.min(1, 1 - qualChance / 100); // Reaches max at top 0%, min at top 100%
	}
	poz(z) {
		let y, x, w;
		if (z == 0.0) return 0.5;

		y = 0.5 * Math.abs(z);
		if (y > (4 * 0.5)) { // Was previously 6 * 0.5
			x = 1.0;
		} else if (y < 1.0) {
			w = y * y;
			x = ((((((((0.000124818987 * w
				- 0.001075204047) * w + 0.005198775019) * w
				- 0.019198292004) * w + 0.059054035642) * w
				- 0.151968751364) * w + 0.319152932694) * w
				- 0.531923007300) * w + 0.797884560593) * y * 2.0;
		} else {
			y -= 2.0;
			x = (((((((((((((-0.000045255659 * y
				+ 0.000152529290) * y - 0.000019538132) * y
				- 0.000676904986) * y + 0.001390604284) * y
				- 0.000794620820) * y - 0.002034254874) * y
				+ 0.006549791214) * y - 0.010557625006) * y
				+ 0.011630447319) * y - 0.009279453341) * y
				+ 0.005353579108) * y - 0.002141268741) * y
				+ 0.000535310849) * y + 0.999936657524;
		}
		return z > 0.0 ? ((x + 1.0) * 0.5) : ((1.0 - x) * 0.5);
	}
	changeQuality(elem) {
		if (elem === null) return;

		const percent = elem.textContent.replace(/^\s+\w+\s+/, "");
		if (percent !== elem.textContent && elem.textContent.trim().split(/\s/)[0] !== "Quality")
			return;
		if (percent === "" || percent === "N/A") return;

		const qual = parseFloat(percent.slice(0, -1));
		const qualChance = (this.poz((50 - qual) / 12.5) * 100).toString(); // mean = 50, std = 12.5
		if (qualChance === "NaN") return;

		const first4 = qualChance.slice(0, 4);
		elem.innerHTML += ` <span style="color: hsl(${this.calcQuality(qualChance) * 120}, 67%, ${this.brightness}%)">(top ${qualChance.slice(0, first4 === "0.00" ? 5 : first4 === "99.9" ? (qualChance.slice(0, 5) === "99.99" ? 6 : 5) : 4)}%)</span>`;
	}
	changeHsThing(content, selector, lambda, valFunc, calcFunc) {
		const rows = content.querySelectorAll(selector);
		for (const row of rows) {
			const thing = row.children[2];
			const val = parseFloat(lambda(thing.textContent));
			thing.style.color = `hsl(${calcFunc(valFunc(val)) * 120}, 67%, ${this.brightness}%)`;
		}
	}
	changePsThing(elem, lambda, valFunc, calcFunc) {
		const val = parseFloat(lambda(elem.textContent));
		elem.innerHTML = `<span style="color: hsl(${calcFunc(valFunc(val)) * 120}, 67%, ${this.brightness}%)">${elem.textContent}</span>`;
	}
	inForumPost(url) {
		const respects = document.querySelectorAll(".mb-2 p.card-text");
		for (const respText of respects) {
			const resp = parseInt(respText.textContent.split(' ')[0].replaceAll(',', ""));
			const colorVal = this.calcRespect(resp);
			respText.innerHTML = `<span style="color: rgba(${resp < 0 ? 222 : colorVal}, ${resp < 0 ? colorVal : 226}, ${colorVal}, 0.75)">${resp.toLocaleString("en-US")}</span> Respect`;
		}
	}
	inHighscores(url) {
		const noCommas = text => text.replaceAll(',', "");
		const changeBattlestats = content => this.changeHsThing(content, "tr.fw-bold", noCommas, val => val / 4, this.calcGym.bind(this));
		const battlestats = document.querySelector("div#v-content-battlestats");
		changeBattlestats(battlestats);
		observeDOM(battlestats, e => changeBattlestats(e[0].target));

		const changeRep = (content, calcFunc) => this.changeHsThing(content, "tbody tr", noCommas, val => val, calcFunc);
		const repContainer = document.querySelector("div#v-content-reputation");
		changeRep(repContainer, this.calcRep.bind(this));
		observeDOM(repContainer, e => changeRep(e[0].target, this.calcRep));
		const cartelRepContainer = document.querySelector("div#v-content-cartelreputation");
		changeRep(cartelRepContainer, this.calcCartelRep.bind(this));
		observeDOM(cartelRepContainer, e => changeRep(e[0].target, this.calcCartelRep.bind(this)));

		const changeNetworth = content => this.changeHsThing(content, "tbody tr", text => noCommas(text.slice(1)), val => val, this.calcNetworth.bind(this));
		const networthContainer = document.querySelector("div#v-content-networth");
		changeNetworth(networthContainer);
		observeDOM(networthContainer, e => changeNetworth(e[0].target));

		const changeAttacksWon = content => this.changeHsThing(content, "tbody tr", noCommas, val => val, this.calcAttacksWon.bind(this));
		const attacksWonContainer = document.querySelector("div#v-content-attackswon");
		changeAttacksWon(attacksWonContainer);
		observeDOM(attacksWonContainer, e => changeAttacksWon(e[0].target));

		const changeLevel = content => this.changeHsThing(content, "tbody tr", noCommas, val => val, this.calcLevel.bind(this));
		const levelContainer = document.querySelector("div#v-content-level");
		changeLevel(levelContainer);
		observeDOM(levelContainer, e => changeLevel(e[0].target));

		const changeRevives = content => this.changeHsThing(content, "tbody tr", noCommas, val => val, this.calcRevives.bind(this));
		const revivesContainer = document.querySelector("div#v-content-revives");
		changeRevives(revivesContainer);
		observeDOM(revivesContainer, e => changeRevives(e[0].target));
	}
	inHomepage(url) {
		const stats = document.querySelectorAll(".col-md-6.d-flex.align-items-stretch.col-xxl-4");
		if (stats.length < 2) return;

		const leftStats = stats[0].querySelectorAll(".form-data-inset.p-2.mb-0.rounded");
		for (let i = 0; i !== 2; ++i) {
			const theStat = leftStats[i === 0 ? 2 : 6];
			const text = theStat.textContent;
			const val = parseFloat(text.replaceAll(',', ""));
			theStat.innerHTML = `<span style="color: hsl(${(i === 0 ? this.calcRep(val) : this.calcInt(val)) * 120}, 67%, ${this.brightness}%)">${text}</span>`;
		}

		const trs = stats[1].querySelectorAll(".form-data-inset.p-2.mb-0.rounded");
		if (trs.length < 5) return;

		for (let i = 0; i !== 5; ++i) {
			const td = trs[i];
			const valText = td.textContent.match(/^[\d\.,]+/)[0];
			const val = parseFloat(valText.replaceAll(',', ""));
			const colorVal = i === 4 ? this.calcGym(val / 4) : this.calcGym(val);
			const effectiveStats = td.children[0];
			if (effectiveStats)
				effectiveStats.classList.add("float-end");
			td.innerHTML = `<span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">${valText}</span>${td.innerHTML.replace(/^[\d\.,]+/, "")}`;
		}
	}
	inGym(url) {
		let statCols = document.querySelector("div.row.row-cols-2.row-cols-lg-4.row-cols-md-2.mt-2.mb-4.g-4");
		if (statCols === null) return;

		statCols = statCols.children;

		const totalStats = document.querySelector("p.card-text.fw-bold.text-muted"); // Is the first one
		const textSplit = totalStats.textContent.split(' ');
		const totalStatVal = parseFloat(textSplit[0].slice(1).replaceAll(',', ""));
		totalStats.innerHTML = `(<span style="color: hsl(${this.calcGym(totalStatVal / 4) * 120}, 67%, ${this.brightness}%)">${textSplit[0].slice(1)}</span> ${textSplit.slice(1).join(' ')}`;

		for (const col of statCols) {
			const stat = col.children[0].children[2];
			const textSplit = stat.textContent.split(' ');
			const statVal = parseFloat(textSplit[0].slice(1).replaceAll(',', ""));
			stat.innerHTML = `(<span style="color: hsl(${this.calcGym(statVal) * 120}, 67%, ${this.brightness}%)">${textSplit[0].slice(1)}</span> ${textSplit[1].slice(0, -1)}: ${(statVal / totalStatVal * 100).toFixed(1)}%)`;
		}
	}
	inUniversity(url) {
		const container = document.querySelector("div.text-center.d-flex.flex-column.align-items-center");
		if (container === null) return;

		const currentInt = container.querySelector("p.card-text.fw-bold.text-muted");

		const textSplit = currentInt.textContent.split(' ');
		const currentIntVal = parseFloat(textSplit[0].slice(1));
		currentInt.innerHTML = `(<span style="color: hsl(${this.calcInt(currentIntVal) * 120}, 67%, ${this.brightness}%)">${textSplit[0].slice(1)}</span> ${textSplit.slice(1).join(' ')}`;
	}
	inPersonalStats(url) {
		const stats = document.querySelectorAll(".list-group .list-group-item ~ .list-group-item .col-4 ~ .col-4");
		if (stats.length === 0) return;

		const noCommas = text => text.replaceAll(',', "");
		for (let i = 0; i < 2; ++i) {
			this.changePsThing(stats[i], noCommas, val => val, this.calcRep.bind(this));
			this.changePsThing(stats[i + 2], noCommas, val => val, this.calcInt.bind(this));
			this.changePsThing(stats[i + 12], noCommas, val => val / 4, this.calcGym.bind(this));
			const resp = parseInt(noCommas(stats[i + 14].textContent));
			const colorVal = this.calcRespect(resp);
			stats[i + 14].innerHTML = `<span style="color: rgba(${resp < 0 ? 222 : colorVal}, ${resp < 0 ? colorVal : 226}, ${colorVal}, 0.75)">${resp.toLocaleString("en-US")}</span>`;
		}
		for (let i = 0; i < 8; ++i) {
			this.changePsThing(stats[i + 4], noCommas, val => val, this.calcGym.bind(this));
		}
	}
	inInventory(url) {
		const itemList = document.querySelectorAll("div.container.inventoryWrapper > div.inventoryItemWrapper");
		if (itemList?.length <= 0) return;

		for (const item of itemList) {
			if (item.children.length < 7) continue;

			this.changeQuality(item.children[4]);
			const otherElem = item.children[6].querySelector(".align-items-center .col-xl-2");
			this.changeQuality(otherElem);
		}
	}
	inMarket(url) {
		const container = document.querySelector("nav#itemMarketNav > div.tab-content");
		if (container === null) return;

		for (const section of container.children)
			observeDOM(section, e => {
				const list = e[0]?.addedNodes[2];
				if (!list || list.classList === undefined || !list.classList.contains("offerListWrapper"))
					return;

				const listings = list.querySelectorAll(".offerItemWrapper");
				for (const listing of listings) {
					const qualElem = listing.children[3];
					if (qualElem.textContent.slice(-1) !== "%") continue;

					this.changeQuality(qualElem);
				}
				const collapsed = list.querySelectorAll(".collapse, .collapsing");
				for (const listing of collapsed) {
					this.changeQuality(listing.querySelector(".col-xl-2"));
				}
			});

		const ownOffers = document.querySelectorAll(".card-body > .offerListWrapper .inventoryItemWrapper");
		for (const offer of ownOffers) {
			this.changeQuality(offer.children[3]);
		}
	}
}


class DisableThrow {

	static metadata = {
		displayName: 'Disable Throw',
		description: 'Disable the throw button',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() {
		this.throwText = "Throw Away";
	}
	inInventory(url) {
		const buttons = document.querySelectorAll("button.btn.action-btn.ms-1.float-end");
		for (const button of buttons) {
			if (button.title !== this.throwText) continue;

			button.setAttribute("disabled", true);
		}
	}
}


class DisplayPerks {

	static metadata = {
		displayName: 'Display Perks',
		description: 'Display various perk effects',
		settings: {
			active: {
				inHomepage: {
					description: 'Store the perk values'
				},
				inGym: {
					description: 'Display the gym gain boni'
				},
				inInventory: {
					description: 'Adjust the medical item effect text to account for perk effects'
				},
				inMarket: {
					description: 'Adjust the medical item effect text to account for perk effects'
				},
				inPharmacy: {
					description: 'Adjust the medical item effect text to account for perk effects'
				}
			},
			custom: {
			}
		}
	}

	constructor() {
		this.statGains = ["Accuracy", "Agility", "Defence", "Strength"];
		this.hospTime = 'Hospital Time';
		this.prod = "Production Profit";
		this.medEffectiveness = "Med Effectiveness";
		this.medCooldown = "Med Cooldown";
		this.maxInt = "Max Int";
		this.intGains = "Int Gains";
		this.jobProfits = "Job Profits";
		this.standardJobRep = "Standard Job Rep";
		this.streetCrimeProfit = "Street Crime Profit";

		this.all = "Territory";
		this.medProgram = "Medical Program";
	}
	getPerk(type) {
		return getValue('perks', type);
	}
	setPerk(type, perk) {
		setValue('perks', type, perk);
		console.debug(`Set perks_${type} to ${perk}`);
		return perk;
	}
	changeHospitalTime(texts) {
		const effectText = texts[texts.length - 1];
		if (effectText === undefined || !effectText.textContent.includes("Hospital timer"))
			return;
		const textSplit = effectText.textContent.split(' ');

		let lifePercent = parseInt(textSplit[1].slice(0, -1));
		lifePercent *= 1 + this.getPerk(this.medEffectiveness) / 100;

		let medCooldown = parseInt(textSplit[8]);
		medCooldown *= 1 - this.getPerk(this.medCooldown) / 100;
		const medCooldownText = this.formatTime(medCooldown);

		let hospTime = parseInt(textSplit[textSplit.length - 2]);
		hospTime *= 1 + this.getPerk(this.medEffectiveness) / 100;
		const hospTimeText = this.formatTime(hospTime);

		const medEffectivenessApplied = `<span class="text-success">(+${this.getPerk(this.medEffectiveness)}% applied)</span>`;
		const medCooldownApplied = `<span class="text-success">(-${this.getPerk(this.medCooldown)}% applied)</span>`;

		const result = `Restores ${lifePercent}% of Life ${this.getPerk(this.medEffectiveness) === 0 ? '' : medEffectivenessApplied}. \
Increases Medical cooldown by ${medCooldownText} ${this.getPerk(this.medCooldown) === 0 ? '' : medCooldownApplied} and reduces \
Hospital timer by ${hospTimeText} ${this.getPerk(this.medEffectiveness) === 0 ? '' : medEffectivenessApplied}.`;

		effectText.innerHTML = result;

	}
	formatTime(time) {
		let result = '';
		if (time >= 60) {
			const hours = Math.floor(time / 60);
			result += `${hours} hour${hours === 1 ? "" : 's'}${time % 60 ? " and" : ""}`;
		}
		if (time % 60)
			result += ` ${time % 60} minute${time % 60 === 1 ? "" : 's'}`;

		return result;
	}
	inHomepage(url) {
		// Ensure that all perks are visible
		const perkSelect = document.querySelector('#perkCategoryFilter');
		if (perkSelect?.selectedOptions?.[0]?.value !== 'all') return;
		
		// Grab the perk items from the updated structure
		const perks = document.querySelectorAll(".col-12.d-flex.align-items-stretch.col-xxl-4 .perk-item");
		if (perks?.length <= 0) return;

		const museumVals = {
			"Small": 50,
			"Large": 100,
			"Basic": 150,
			"Superior": 200
		};

		let allStats = 0;
		let medEffectiveness = 0;
		let prodEffectiveness = 0;
		let standardJobRep = 0;

		for (const perk of perks) {
			const perkName = perk.querySelector(".perkTitle").textContent; // Get perk name
			const perkDesc = perk.querySelector(".perkDescription").textContent; // Get perk description

			const textSplit = perkDesc.split(' '); // Split description into words


			// Check for different perk types and apply logic accordingly
			if (perkName === this.all) {
				if (perkDesc.startsWith("Increase all Gym gains by"))
					allStats += parseFloat(textSplit[textSplit.length - 1].slice(0, -1));
			} else if (perkName === this.medProgram) {
				if (perkDesc.endsWith("more effective Medicine"))
					medEffectiveness += parseFloat(textSplit[0].slice(0, -1));
			} else if (perkDesc.endsWith("Street Crime Profit"))
				this.setPerk(this.streetCrimeProfit, parseFloat(textSplit[0].slice(0, -1)));
			else if (perkDesc.endsWith("increase to production profits"))
				prodEffectiveness += parseFloat(textSplit[0].slice(0, -1));
			else if (perkDesc.endsWith("increase to all Gym gains"))
				allStats += parseFloat(textSplit[0].slice(0, -1));
			else if (perkDesc.startsWith("Increases the Intelligence stat cap"))
				this.setPerk(this.maxInt, 1000 + museumVals[perkName.split(' ')[0]]);
			else if (perkDesc.startsWith("Increases all Intelligence gains"))
				this.setPerk(this.intGains, parseFloat(textSplit[textSplit.length - 1].slice(0, -1).replaceAll(',', "")));
			else if (perkDesc.endsWith("increase to Job profits"))
				this.setPerk(this.jobProfits, parseFloat(textSplit[0].slice(0, -1)));
			else if (perkDesc.endsWith("less Medical cooldown added by items"))
				this.setPerk(this.medCooldown, parseFloat(textSplit[0].slice(0, -1)));
			else if (perkDesc.endsWith("increase to medical item effectiveness"))
				medEffectiveness += parseFloat(textSplit[0].slice(0, -1));
			else if (perkDesc.endsWith("Reputation on Standard Jobs"))
				// e.g. +50% or 24%
				standardJobRep += parseFloat(textSplit[0].match(/\+?\d+%$/)[0]);
			else if (perkDesc.startsWith("Increases target hospital time by"))
				this.setPerk(this.hospTime, parseFloat(textSplit.at(-1).slice(0, -1)));
		}

		// Update stat gains after processing perks
		const statGains = [allStats, allStats, allStats, allStats];
		for (const perk of perks) {
			const perkDesc = perk.querySelector(".perkDescription").textContent;
			for (let i = 0; i < this.statGains.length; ++i) {
				// Dynamically check if a perk description ends with one of the stat gain descriptions
				if (perkDesc.endsWith(`increase to ${this.statGains[i]} gains`))
					statGains[i] += parseInt(perkDesc.split(' ')[0].slice(0, -1)); // Assuming the first part of the description is the percentage value
			}
		}

		// Set the final stats
		for (let i = 0; i < this.statGains.length; ++i)
			this.setPerk(`${this.statGains[i]} Gain`, statGains[i]);

		// Set the other perks
		this.setPerk(this.medEffectiveness, medEffectiveness);
		this.setPerk(this.prod, prodEffectiveness);
		this.setPerk(this.standardJobRep, standardJobRep);
	}

	inGym(url) {
		let statCols = document.querySelector("div.row.row-cols-2.row-cols-lg-4.row-cols-md-2.mt-2.mb-4.g-4");
		if (statCols === null) return;

		statCols = statCols.children;

		for (const col of statCols) {
			const perkGainText = `${col.children[0].children[0].textContent}Gain`;
			const perkGain = this.getPerk(perkGainText);
			if (perkGain === null) continue;

			const extraGains = document.createElement("p");
			extraGains.classList.add("extraGains", "card-text");
			extraGains.innerHTML = `(+${perkGain}% gains)`;

			col.children[0].insertBefore(extraGains, col.children[0].children[3]);
		}
	}
	inInventory(url) {
		if (!this.getPerk(this.medEffectiveness)) return;

		const itemList = document.querySelectorAll("div.container.inventoryWrapper.pt-2 > div.inventoryItemWrapper");

		for (const item of itemList) {
			const texts = item.querySelectorAll("div.card-text > div.card-text");
			this.changeHospitalTime(texts);
		}
	}
	inMarket(url) {
		const medItems = document.querySelector("div#content-medical");
		if (!medItems) return;
		
		observeDOM(medItems, e => {
			const list = e[0]?.addedNodes[2];
			if (list?.classList === undefined || !list.classList.contains("offerListWrapper"))
				return;

			let doit = false;
			for (let itemNum = 1; itemNum < list.children.length; ++itemNum) {
				const listing = list.children[itemNum];
				const listingName = listing.children[1].textContent;
				if (itemNum % 2)
					doit = ["Bandage", "Small Medical Kit", "Large Medical Kit", "Basic Trauma Kit", "Large Trauma Kit"].includes(listingName);
				else if (doit) {
					const texts = listing.querySelectorAll("div.card-text > div.card-text");
					this.changeHospitalTime(texts);
				}
			}
		});
	}
	inPharmacy(url) {
		const itemList = document.querySelectorAll("div.container.inventoryWrapper.mb-4 > div.inventoryItemWrapper");

		for (const item of itemList) {
			const texts = item.querySelectorAll('div.col-xl-4.col-lg-6.col-12.mb-3 > div > p');
			this.changeHospitalTime(texts);
		}
	}
}


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


class DPEnergyRefillReminder {

	static metadata = {
		displayName: 'Supporter Pack Energy Refill Reminder',
		description: 'Add warning to not use energy refill when energy is not zero or max energy is not 200',
		settings: {
			active: {
				inSupporter: {
					description: 'Add warning to not use energy refill when energy is not zero or max energy is not 200'
				}
			},
			custom: {
			}
		}
	}

	constructor() { }
	inSupporter(url) {
		const modalText = document.querySelector("#useRefillConfirm p.card-text.modal-bodyText");
		if (!modalText) return;

		const modalObserver = e => {
			const textSplit = e[0].target.innerText.split(' ');
			const option = textSplit[textSplit.length - 1];
			if (option !== "Energy?") return;

			if (document.querySelector("#maxEnergy").innerText !== "200")
				modalText.innerHTML += `<br><span class="text-warning">Your max energy isn't 200!</span>`;
			else if (document.querySelector("#currentEnergy").innerText !== "0")
				modalText.innerHTML += `<br><span class="text-danger">Your current energy isn't 0!</span>`;
		};
		observeDOM(modalText, modalObserver);
	}
}


class EstateLevelInfo {

	static metadata = {
		displayName: 'Estate Level Info',
		description: 'Display bonus effects of upgrades',
		settings: {
			active: {
				inEstateAgent: {
					description: 'Display bonus effects of upgrades'
				}
			},
			custom: {
			}
		}
	}

	constructor() {
		const configManger = ConfigManager.getInstance();
		this.brightness = configManger.darkmode ? 50 : 45;

		this.prefixes = ["", "", '${POUND}', '-', '+', '+', '+'];
		this.postfixes = ["", "", 'M', '%', '%', " INT", '%'];
		this.values = [
			[], // Plot cost, nothing to process here
			[], // Best house type, nothing to process here
			[0, 10, 50, 150, 250, 500, 2000, 5000], // Max safe, between 0 and 5bil
			[0, 1, 2, 4, 6, 8, 10], // Uni course time reduction, between 0% and 10%
			[0, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75], // Gym bonus, between 0% and 0.75%
			[0, 50, 100, 150, 200], // Intelligence cap bonus, between 0 and 200 int
			[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.75] // Int gain bonus, between 0% and 0.75%
		];
	}
	inEstateAgent(url) {
		const containers = document.querySelectorAll("#v-content-plots div.accordion-body");

		for (let i = 0; i < containers.length; ++i) {
			const container = containers[i];
			const numbers = container.querySelectorAll("div.col-6 p:not(.mb-0)");
			for (let j = 2; j < numbers.length; ++j) {
				let numberP = numbers[j];
				const number = parseInt(numberP.textContent);
				const val = this.values[j][number];
				if (val === undefined) return;

				const colorVal = val / this.values[j][this.values[j].length - 1];
				numberP.innerHTML += ` <span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">(${this.prefixes[j]}${val.toLocaleString("en-US")}${this.postfixes[j]})</span>`;
			}
		}
	}
}


class EstimatedIntGains {

	static metadata = {
		displayName: 'Estimated Intelligence Gains',
		description: 'Calculate and display your estimated intelligence gains',
		settings: {
			active: {
				inUniversity: {
					description: 'Display the estimated int gains and the energy to max int'
				}
			},
			custom: {
			}
		}
	}

	constructor() {
		const configManger = ConfigManager.getInstance();
		this.brightness = configManger.darkmode ? 50 : 45;

		this.improperWay = false; // Instead of using ^energy, Diablo used to use *energy incorrectly
		this.constant = this.improperWay ? 36715 : 36667;
		this.base = 1 + 1 / this.constant;
		this.ID = "expectedIntGains";

		this.maxInt = getNumericValue('perks', 'Max Int') || 1200;
		const extraIntGains = getNumericValue('perks', 'Int Gains') || 0; // percentage
		this.extraGainsFactor = 1 + extraIntGains / 100;
	}
	calcGain(energy, currentInt) {
		if (this.improperWay)
			return Math.min(this.maxInt - currentInt, currentInt * (this.base - 1) * energy * this.extraGainsFactor);
		else
			return Math.min(this.maxInt - currentInt, currentInt * (Math.pow(this.base, energy * this.extraGainsFactor) - 1));
	}
	genText(value, currentInt) {
		return `Expected gain: <span class="fw-bold">${value === 0 ? '0' : '~' + value.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>`;
	}
	genToMaxText(currentInt) {
		const eToMax = Math.log(this.maxInt / currentInt) / Math.log(this.base) / this.extraGainsFactor;
		return `<span class="fw-bold">~${Math.round(eToMax).toLocaleString("en-US")}</span> energy until ${this.maxInt.toLocaleString("en-US")}`;
	}
	inUniversity(url) {
		const container = document.querySelector("div.text-center.d-flex.flex-column.align-items-center");
		if (container === null) return;

		// Look for the form or the "too tired" message
		let targetElement = container.querySelector("form.input-group");
		if (targetElement === null) {
			targetElement = container.querySelector("p.card-text.text-danger");
			// Exit if neither the form nor the message is found
			if (targetElement === null) return;
		}

		let currentIntVal = 0;
		const currentInt = container.querySelector("p.card-text.fw-bold.text-muted");
		if (currentInt !== null) {
			currentIntVal = parseFloat(currentInt.textContent.split(' ')[0].slice(1));
		} else return; // Exit if currentInt is not found

		let energy = 50;
		if (targetElement.tagName === 'FORM') {
			const energyInput = targetElement.querySelector("input.form-control");
			if (energyInput !== null) energy = parseInt(energyInput.value);

			let value = this.calcGain(energy, currentIntVal);

			const expectedIntGains = document.createElement("p");
			expectedIntGains.id = this.ID;
			expectedIntGains.classList.add("card-text", "mt-2");
			expectedIntGains.innerHTML = this.genText(value, currentIntVal);

			// Insert the expected gain element after the form
			targetElement.insertAdjacentElement("afterend", expectedIntGains);

			// Add event listener for energy input changes
			if (energyInput === null) return;

			energyInput.addEventListener("input", e => {
				const energyText = e.target.value;
				if (energyText === "" || energyText.trim()[0] === '-') return;

				energy = parseInt(energyText);
				value = this.calcGain(energy, currentIntVal);
				expectedIntGains.innerHTML = this.genText(value, currentIntVal);
			});
		}

		// Always create and insert the "energy until maximum" element
		const eToMaxText = document.createElement("p");
		eToMaxText.classList.add("card-text", "mb-0");
		eToMaxText.innerHTML = this.genToMaxText(currentIntVal);

		// Insert the "energy until maximum" element after the targetElement
		targetElement.insertAdjacentElement("afterend", eToMaxText);

		const usedGainBox = document.querySelector("div.mb-4.card.border-success p.card-text.fw-bold.text-white");
		if (usedGainBox === null) return;

		const textSplit = usedGainBox.innerText.split(' ');
		if (textSplit[textSplit.length - 1] !== "Intelligence") return;

		const prevIntVal = currentIntVal - parseFloat(textSplit[7]);
		const expected = this.calcGain(parseInt(textSplit[4]), prevIntVal);
		usedGainBox.innerHTML += ` <span class="text-muted">(expected ${expected.toLocaleString("en-US", { minimumFractionDigits: 2 })})</span>`;
	}

}


class ExpeditionChances {

	static metadata = {
		displayName: 'Expedition Chances',
		description: 'Display expedition chances in the dropdown',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() { }
	inExpeditions(URL) {
		const teamStats = this.getTeamStats();
		if (!teamStats) return;

		const expeds = document.querySelectorAll(".expeditionButton");
		for (const exped of expeds) {
			// Skip active missions
			if (exped.children.length < 5) continue;

			const teamChances = this.getTeamChances(exped, teamStats);

			teamChances.forEach((c, i) => {
				console.debug(`Success chance of team ${i + 1}: ${c * 100}`);
			});

			this.updateUI(exped, teamChances);
		}
	}
	getTeamStats() {
		const teamStats = [[], [], [], [], []];
		for (let team_i = 0; team_i < teamStats.length; team_i++) {
			const stats = document.querySelectorAll(`#v-content-team${team_i + 1} > .justify-content-center span:not(.fw-bold)`);
			if (stats.length !== 4) return;

			for (const statElem of stats) {
				const statText = statElem.textContent.replaceAll(',', "");
				const stat = parseInt(statText);
				teamStats[team_i].push(stat);
			}
		}
		return teamStats;
	}
	getTeamChances(exped, teamStats) {
		const chances = [1, 1, 1, 1, 1];
		const statElements = exped.querySelectorAll(`div.col-5 > div.card-text`);

		// Don't factor in speed (last value) since it only affects expedition time not success rate
		for (let i = 0; i < 3; ++i) {
			const statText = statElements[i].textContent.replaceAll(',', "");
			const stat = parseInt(statText);
			for (const team_i in chances)
				chances[team_i] = Math.min(chances[team_i], teamStats[team_i][i] / stat);
		}
		return chances;
	}
	updateUI(exped, chances) {
		const options = exped.querySelectorAll("select.expeditionTeamSelector option");
		for (const opt of options) {
			const team_i = parseInt(opt.value);
			if (team_i === 0) continue;

			opt.textContent += ` - ${Math.floor(chances[team_i - 1] * 100)}%`;
		}
	}
}


class GreenMoney {

	static metadata = {
		displayName: 'Green Money',
		description: 'Color money values green',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

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
				&& poundSymbol.textContent.includes('£')) poundSymbol.style.color = this.color;
		});
	}
}


class HighlightExcessHealth {

	static metadata = {
		displayName: 'Highlight Excess Health',
		description: 'Show health over maximum in red and bold',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() { }
	inUserProfile(url) {
		const trs = document.querySelectorAll("table.table tbody tr");
		if (trs.length < 6) return;

		const lifeTd = trs[5].children[1];
		const life = lifeTd.textContent;
		const curHealth = parseInt(life.split(" / ")[0].replaceAll(',', ""));
		const maxHealth = parseInt(life.split(" / ")[1].replaceAll(',', ""));
		if (curHealth > maxHealth)
			lifeTd.classList.add("text-danger", "fw-bold");
	}
}


class HighlightInactives {

	static metadata = {
		displayName: 'Highlight Inactives',
		description: 'Color the names of inactive users',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() {
		this.yellowBy = 1; // in days
		this.redBy = 2; // in days

		this.endings = new Map([
			['Active', 0],
			['minute ago', 1 / (24 * 60)],
			['minutes ago', 1 / (24 * 60)],
			['hour ago', 1 / 24],
			['hours ago', 1 / 24],
			['day ago', 1],
			['days ago', 1],
			['month ago', 30],
			['months ago', 30],
			['No Activity', 90],
		]);
	}
	inCartel(url) {
		const table = document.querySelector("div.card-body > div.container-fluid");
		if (!table) return;
		
		const rows = table.querySelectorAll(".row.align-middle");

		for (const row of rows) {
			const cols = row.querySelectorAll(".col:not(.fw-bold)");
			const activity = cols[cols.length - 2];

			let days = parseInt(activity.innerText.match(/\d+/)?.[0] || '0');
			for (const [time_id, factor] of this.endings.entries()) {
				if (!activity.textContent.endsWith(time_id)) continue;

				days *= factor;
				break;
			}
			if (days >= this.redBy)
				activity.classList.add("text-danger");
			else if (days >= this.yellowBy)
				activity.classList.add("text-warning");
		}
	}
}


class HighlightUnequipped {

	static metadata = {
		displayName: 'Highlight Unequipped',
		description: 'Color unequipped slots red and bold',
		settings: {
			active: {
				inInventory: {
					description: 'Highlight unequipped weapons / armor'
				},
				inProduction: {
					description: 'Highlight empty narco slots'
				}
			},
			custom: {
			}
		}
	}

	constructor() { }

	inInventory(url) {
		const titles = document.querySelectorAll("h6.card-title");

		for (const title of titles) {
			if (['Fists', 'None', 'No Armour'].includes(title.textContent))
				title.classList.add("fw-bold", "text-danger");
		}
	}
	inProduction(url) {
		const idle = document.querySelector("p.idleNarcos");
		if (idle === null) return;
		
		const setColor = text => {
			if (text === "0") idle.classList.remove("fw-bold", "text-danger");
			else idle.classList.add("fw-bold", "text-danger");
		};

		setColor(idle.innerText);
		observeDOM(idle, e => setColor(e[0].target.innerText));
	}
}


class HighscoreChanges {

    static metadata = {
		displayName: 'Highscore Changes',
		description: 'Shows changes of compared stat',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}


	constructor() {
		this.hoursLate = 2;
		this.cacheNames = [
			'Battlestats_self',
			'Networth_self',
			'Reputation',
			'Cartel Reputation',
			'Attacks Won',
			'Level',
			'Revives'
		];
        // Cache format: [previous, latest]
        // with previous / latest = [<date>, {<id>: <stat>} or <stat> if self]
		this.cacheNames.forEach(cacheName => {
			if (this.getCache(cacheName) === null)
				this.setCache(cacheName, [null, null]);
		});

		this.hoverColor = "rgba(var(--bs-emphasis-color-rgb), 0)";
	}
	getCache(type) {
		return getValue('highscoreCache', type);
	}
	setCache(type, cache) {
		setValue('highscoreCache', type, cache);
		console.debug(`Set highscoreCache_${type} to ${JSON.stringify(cache)}`);
		return cache;
	}
	timeFunc(now) {
		return new Date(now - this.hoursLate * 1000 * 60 * 60).toLocaleDateString("en-GB", { timeZone: "UTC" });
	}
	changeSelfOnly(content, type) {
		const ownRow = content.querySelector("tbody tr.fw-bold");
		if (ownRow === null) return;

		const timeNow = this.timeFunc(Date.now());
		const curCache = this.getCache(`${type}_self`);

        const ownStats = ownRow.lastChild;
        const newVal = parseInt(ownStats.textContent.replaceAll(/[,\u00a3]/g, ''));

        // If latest is null, update latest
		if (curCache[1] === null) curCache[1] = [timeNow, newVal];
        // If latest is outdated, move it to previous and update it
		else if (curCache[1][0] !== timeNow) {
			curCache[0] = curCache[1];
			curCache[1] = [timeNow, newVal];
		}
        // If both current and previous exist, display the change
		if (curCache[0] !== null && curCache[1] !== null) {
			const diff = curCache[1][1] - curCache[0][1];
			if (diff > 0) ownStats.innerHTML += this._getChangeText(diff, type);
		}
		this.setCache(`${type}_self`, curCache);
	}
    _getChangeText(diff, type) {
        const prefix = type === 'Networth' ? POUND : '';
        const colorClass = diff > 0 ? 'text-success' : diff < 0 ? 'text-danger' : 'text-muted';
        return `<span class="${colorClass} small">&nbsp;&nbsp;${diff > 0 ? '+' : ''}${prefix}${diff.toLocaleString('en-us')}</span>`;
    }
	change(content, type) {
		const rows = content.querySelectorAll("tbody tr");
		const timeNow = this.timeFunc(Date.now());
		const curCache = this.getCache(type);

		let newStats = {};
        // If latest cache is up-to-date, copy it into newStats
		if (curCache[1] !== null && curCache[1][0] === timeNow)
			newStats = curCache[1][1];
		for (const row of rows) {
			let user = row.children[1];
			const userID = user.children.length ? parseInt(user.children[0].href.match(/\d+$/)[0]) : "self";
			newStats[userID] = parseInt(row.lastChild.textContent.replaceAll(/[,\u00a3]/g, ''));
		}
        // If latest is null, update latest
		if (curCache[1] === null) curCache[1] = [timeNow, newStats];
        // If latest is outdated, move it to previous and update it
		else if (curCache[1][0] !== timeNow) {
			curCache[0] = curCache[1];
			curCache[1] = [timeNow, newStats];
		}
        // If both current and previous exist, display the change
		if (curCache[0] !== null && curCache[1] !== null) {
			for (const row of rows) {
				const user = row.children[1];
				const userID = user.children.length ? parseInt(user.children[0].href.match(/\d+$/)[0]) : "self";
				if (!(userID in curCache[0][1] && userID in curCache[1][1])) return;

				const diff = curCache[1][1][userID] - curCache[0][1][userID];
                row.lastChild.innerHTML += this._getChangeText(diff, type);
			}
		}
		this.setCache(type, curCache);
	}
	inHighscores(url) {
		const battlestatsContainer = document.querySelector("div#v-content-battlestats");
		this.changeSelfOnly(battlestatsContainer, "Battlestats");
		observeDOM(battlestatsContainer, e => this.changeSelfOnly(e[0].target, "Battlestats"));

		const networthContainer = document.querySelector("div#v-content-networth");
		this.changeSelfOnly(networthContainer, "Networth");
		observeDOM(networthContainer, e => this.changeSelfOnly(e[0].target, "Networth"));

		const repContainer = document.querySelector("div#v-content-reputation");
		this.change(repContainer, "Reputation");
		observeDOM(repContainer, e => this.change(e[0].target, "Reputation"));

		const cartelRepContainer = document.querySelector("div#v-content-cartelreputation");
		this.change(cartelRepContainer, "Cartel Reputation");
		observeDOM(cartelRepContainer, e => this.change(e[0].target, "Cartel Reputation"));

		const attacksWonContainer = document.querySelector("div#v-content-attackswon");
		this.change(attacksWonContainer, "Attacks Won");
		observeDOM(attacksWonContainer, e => this.change(e[0].target, "Attacks Won"));

		const levelContainer = document.querySelector("div#v-content-level");
		this.change(levelContainer, "Level");
		observeDOM(levelContainer, e => this.change(e[0].target, "Level"));

		const revivesContainer = document.querySelector("div#v-content-revives");
		this.change(revivesContainer, "Revives");
		observeDOM(revivesContainer, e => this.change(e[0].target, "Revives"));

		GM_addStyle(`#highscoresTable tr:hover td > span { background-color: ${this.hoverColor} !important }`);
	}
}

class HospTimeEstimate {

	static metadata = {
		displayName: 'Hospital Time Estimate',
		description: 'Show the expected hospital time when attacking someone',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() {
        
        const hospTimePerk = getNumericValue('perks', 'Hospital Time') || 0;
        const hospTimeMultiplier = 1 + (hospTimePerk / 100);

        this.defaultTimes = {
			Attack: 50,
			Mug: 12.5,
			Hospitalise: 100 * hospTimeMultiplier
		}
	}

	inUserProfile(url) {

        const attackConfirmModal = document.getElementById('attackConfirmModal');
        attackConfirmModal.addEventListener('show.bs.modal', async (event) => {
            // Skip one event-loop cycle to let game's listener fire first
            // hacky solution, please fix later
            await wait(0);
            const button = event.relatedTarget;
            if (!button) return;

            const attackType = button.getAttribute('data-bs-attack-type');
            const bodyText = attackConfirmModal.querySelector('.modal-bodyText');

            bodyText.innerHTML += `<br>Estimated hospital time: <span class="fw-bold">${this.defaultTimes[attackType]}min</span>.`;
        });
    }
}


class IntPerWeek {

	static metadata = {
		displayName: 'Intelligence Per Week',
		description: 'Display the int gain per week for each study course',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() {
		const configManger = ConfigManager.getInstance();
		this.brightness = configManger.darkmode ? 50 : 45;

		this.stats = window.location.href[window.location.href.length - 1] === '2';
	}
	inUniversityPage(url) {
		const courses = document.querySelectorAll("div#classAccordion div.accordion-item");
		if (courses?.length <= 0) return;
		
		let intPerDay = [];
		let maxIpd = 0;
		let minIpd = Infinity;

		for (const course of courses) {
			const body = course.querySelector('div.accordion-collapse > div.accordion-body');
			const lengthElem = body.querySelector('div.row.pb-4 > div.col-6 > p.card-text:nth-of-type(2)');
			const length = parseInt(lengthElem.textContent.split(' ')[2]);
			const intGainElem = body.querySelector('div:nth-child(2) > div:nth-child(2) > p:nth-child(2)');
			const intGainText = intGainElem.textContent.match(/\d+\s/g);
			let intGain = 0;
			for (const text of intGainText) intGain += parseInt(text);

			// One combat course gives int rather than stats; ignore it
			if (this.stats && intGainElem.textContent.includes("intelligence"))
				intGain = 0;

			const ipd = 7 * intGain / length;
			intPerDay.push(ipd);
			maxIpd = Math.max(maxIpd, ipd);
			minIpd = Math.min(minIpd, ipd);
		}

		this.updateUI(courses, intPerDay, minIpd, maxIpd);
	}

	updateUI(courses, intPerDay, minIpd, maxIpd) {
		for (let i = 0; i < courses.length; ++i) {
			const ipd = intPerDay[i];
			const colorVal = (ipd - minIpd) / (maxIpd - minIpd);
			const infoTextElem = courses[i].querySelector('h2 > button > div:last-of-type > span');
			infoTextElem.innerHTML += ` <span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">(${ipd.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${this.stats ? "stats" : "INT"}/week)</span>`;
		}
	}
}


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
					defaultValue: 7
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
		// Weed, Alc, Coke
		this.narcosPerProd = [25, 10, 60];
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
			.querySelectorAll("div.prodContainer > div.equipmentModule > div.row.flex-column")
			.values()
			.toArray()
			.slice(2);
		if (containers === null) return;

		for (let i = 0; i < containers.length; i++) {
			const container = containers[i];
			const prodReqsText = container.querySelector('p.card-text.text-center.mb-0');
			// Matches x<number> <name>
			const regexResult = prodReqsText.textContent.match(/^x(\d+) (.+$)/);
			const prodReqValue = parseInt(regexResult?.[1]);
			const prodReqName = regexResult?.[2];

			const prodCount = this._getProdCount(container);
			const assignedText = container.querySelector("input.assignNarcoInput");
			const assigned = parseInt(assignedText.value);
			const prodReq = Math.ceil(assigned / (this.narcosPerProd[i] * prodCount)) * prodReqValue;
			
			this.setReq(prodReqName, prodReq);
		}
	}
	_getProdCount(container) {
		const prodCountText = container.querySelectorAll("tbody tr.align-middle th");
		if (prodCountText.length === 0) return 1;
		return parseInt(prodCountText[1].textContent) || 1;
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

class LargerGymGraph {

	static metadata = {
		displayName: 'Larger Gym Graph',
		description: 'Make the gym graph larger',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() {
		this.newHeight = 400;
		this.factor = 1.12;
	}
	inGym(url) {
		const container = document.querySelector("div#graphContainer > div.card-body > div");
		if (container === null) return;

		container.style.maxHeight = `${this.newHeight * this.factor}px`;
		const graph = container.querySelector("canvas#gymGraph");
		graph.style.height = `${this.newHeight * this.factor}px`;
		graph.height = this.newHeight;
	}
}


class PropertyPageAgentLink {

	static metadata = {
		displayName: 'Property Agent Page Link',
		description: 'Add a link to the estate agent to the property page',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() {
		this.add = `
            <div class="row">
                <div class="col-12">
                    <div class="header-section">
                        <h2>Estate Agent</h2>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="card-text">Go to the <a class="text-white" href="/Town/EstateAgent">Estate Agent</a> to view other properties.</p>
            </div>`;
	}

	inProperty(url) {
		// Find the correct container for the tabs and content
		const container = document.querySelector("#cartelPerksNav");
		console.debug("Container element found:", container);

		if (!container) {
			console.error("Container not found!");
			return;
		}

		// Remove the default button
		const defaultButton = container.querySelector("div.gap-2.d-flex");
		if (defaultButton !== null) {
			console.debug("Removing default button.");
			defaultButton.remove();
		} else console.warn("No default button found.");

		// Check if combined content already exists
		if (container.querySelector("#combined-content")) {
			console.debug("Combined content already exists, skipping creation.");
			return; // If it exists, exit the function
		}

		// Locate the tabs and their corresponding content
		const tabs = container.querySelectorAll(".nav-link");
		const tabContents = container.querySelectorAll(".tab-content .tab-pane");

		console.info("Tabs found:", tabs.length);
		console.info("Tab contents found:", tabContents.length);

		// Create the estate agent section
		const agentSection = document.createElement("div");
		agentSection.classList.add("mb-4", "card");
		agentSection.innerHTML = this.add;

		// Create the combined card with all content
		const combinedCard = document.createElement("div");
		combinedCard.id = "combined-content"; // Add an ID for easier reference
		combinedCard.classList.add("mb-4", "card");
		combinedCard.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <h4 class="header-section">Home Details</h4>
                    <div class="card-body">
                        ${document.querySelector("#v-content-home")?.innerHTML || 'No home content available.'}
                    </div>
                </div>
                <div class="col-12">
                    <h5 class="header-section">Vault</h5>
                    <div class="card-body">
                        ${document.querySelector("#v-content-safe")?.innerHTML || 'No vault content available.'}
                    </div>
                </div>
                <div class="col-12">
                    <h5 class="header-section">Upgrades</h5>
                    <div class="card-body">
                        ${document.querySelector("#v-content-upgrades")?.innerHTML || 'No upgrades content available.'}
                    </div>
                </div>
            </div>
        `;

		// Hide tabs
		tabs.forEach((tab, index) => {
			console.debug(`Hiding tab ${index}:`, tab);
			tab.classList.add('d-none');
		});

		// Remove all existing tab content
		tabContents.forEach((content, index) => {
			console.debug(`Removing tab content ${index}:`, content);
			content.remove();
		});

		// Check if there is any element with the class 'mb-4 card border-success'
		const successCard = container.querySelector('.mb-4.card.border-success');
		console.debug("Success card found:", successCard);

		if (!successCard) {
			// If no such element exists, append the estate agent section first
			console.warn("No success card found, appending agent section at the top.");
			container.insertBefore(agentSection, container.firstChild);
		} else {
			// Otherwise, insert it after the 'mb-4 card border-success' element
			console.debug("Success card found, inserting agent section after it.");
			container.insertBefore(agentSection, successCard.nextSibling);
		}

		// Append the new combined card
		console.debug("Appending combined card.");
		container.appendChild(combinedCard);
	}
}


class RoundedCards {

	static metadata = {
		displayName: 'Rounded Cards',
		description: 'Make the corners of cards round',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() { }

	inAnywhere() {
		GM_addStyle(".contentColumn .card.border-success > .card-body.bg-success, .contentColumn .card.border-danger > .card-body.bg-danger, .contentColumn .card.border-warning > .card-body.bg-warning { border-radius: 10px !important }");
	}
}


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

class StatEstimate {

	static metadata = {
		displayName: 'Stat Estimate',
		description: 'Estimate the total stats of your opponents',
		settings: {
			active: {
				inStatEstimate: {
					description: 'A page to manage your stat estimates'
				},
				inSearch: {
					description: 'Display stat estimates'
				},
				inBountyOrOtherCartel: {
					description: 'Display stat estimates'
				},
				inCartelWar: {
					description: 'Display stat estimates'
				},
				inHomepage: {
					description: 'Store your own stats after applying perk boni'
				},
				inGym: {
					description: 'Store your own stats after applying perk boni'
				},
				inFight: {
					description: 'Calculate and display your opponent\'s stats'
				},
				inUserProfile: {
					description: 'Display the user\'s stats'
				},
				inEvents: {
					description: 'Display stat estimates in the attack logs'
				}
			},
			custom: {
			}
		}
	}

	constructor() {
		const configManger = ConfigManager.getInstance();
		this.brightness = configManger.darkmode ? 50 : 45;
		this.statEstimateLink = "/StatEstimates";
		this.statEstimateRegex = /^statestimates(\/|(\/\d+\/?)?(\?.+)?)?/;

		this.currentList = this.getList();
		if (this.currentList === null) {
			this.currentList = [];
			this.setList([]);
		}
		this.ownID = user_id;
		this.ownName = user_name;
		this.ownStats = this.getEst("self");

		this.constant = 8 / 3;
		this.maxFF = 3;
		this.minFF = 1;
		this.cutoff = 0.01; // Can't be certain whether it truncates or rounds, use the more conservative estimate
		this.repQuadratic = false;
		if (this.repQuadratic) {
			this.repA = 53 / 990;
			this.repC = 48 / 3;
		} else {
			this.repM = 0.049;
			this.repC = 2.7;
		}
		this.minStats = 400;
		this.multMug = 1 / 2;
		this.multHosp = 3 / 4;
		this.perPage = 50;
	}
	getEst(ID = 'self') {
		return getValue('statEstimate', ID);
	}
	setEst(ID, estimate) {
		setValue('statEstimate', ID, estimate);
		console.debug(`Set statEstimate_${ID} to "${estimate}"`);
		return estimate;
	}
	getList() {
		return getValue('statEstimate', 'list');
	}
	setList(list) {
		setValue('statEstimate', 'list', list);
		return list;
	}
	getName(ID) {
		return getValue('name', ID);
	}
	setName(ID, name) {
		setValue('name', ID, name);
		console.debug(`Set name_${ID} to "${name}"`);
		return name;
	}
	calcFairFight(ownStats, theirStats) {
		return Math.min(this.maxFF, Math.max(this.minFF, 1 + this.constant * theirStats / ownStats));
	}
	estimateRep(level, fairFight) {
		return (this.repQuadratic ? Math.pow(level + 1, 2) * this.repA + this.repC : Math.exp(level * this.repM + this.repC)) * fairFight;
	}
	estimateYouAttacked(ownStats, fairFight) {
		if (fairFight === this.minFF)
			return ['<', Math.ceil(this.cutoff / this.constant * ownStats).toLocaleString("en-US")];
		return [fairFight === this.maxFF ? '>' : '~', Math.floor(Math.max(this.minStats, (fairFight - 1) / this.constant * ownStats)).toLocaleString("en-US")];
	}
	estimateAttackedYou(ownStats, fairFight) {
		if (fairFight === this.minFF)
			return ['>', Math.floor(this.constant * ownStats / this.cutoff).toLocaleString("en-US")];
		return [fairFight === this.maxFF ? '<' : '~', Math.ceil(Math.max(this.minStats, this.constant * ownStats / (fairFight - 1))).toLocaleString("en-US")];
	}
	AattackedB(knownStatsText, fairFight, knownIsA) {
		const knownChar = knownStatsText[0];
		const knownStats = parseInt(knownStatsText.split(' ')[0].slice(1).replaceAll(',', ""));
		const theirStats = (knownIsA ? this.estimateYouAttacked : this.estimateAttackedYou).bind(this)(knownStats, fairFight);
		if (knownChar === '~') return theirStats;
		else if (knownChar === '>' && fairFight === (knownIsA ? this.minFF : this.maxFF))
			return [];
		else if (knownChar === '<' && fairFight === (knownIsA ? this.maxFF : this.minFF))
			return [];
		return [knownChar, theirStats[1]];
	}
	dontOverride(curStatEst, newStatEst, curChar, newChar) {
		if (curChar === '>' && newChar === '>' && curStatEst > newStatEst)
			return true;
		else if (curChar === '~' && newChar !== '~') {
			if (newChar === '>' && curStatEst > newStatEst) return true;
			else if (newChar === '<' && curStatEst > newStatEst) return true;
		}
		return false;
	}
	colorVal(ownStats, theirStats) {
		return ownStats ? ownStats / (ownStats + theirStats) : 0.5;
	}
	unColorVal(ownStats, theirStats) {
		return ownStats ? 67 * ownStats / (ownStats + theirStats) : 0;
	}
	scriptFunc() {
		$(() => {
			$("#userSearchName").on("input", target => {
				$.get(`/User/SearchName?search=${target.currentTarget.value}`, result => {
					if (result && result.status == 204) {
						$("#userInput").attr("value", "");
						$("#userInputActual").attr("value", "");
						$("#userName").attr("value", "");
					} else {
						$("#userInput").attr("value", result.userId);
						$("#userInputActual").attr("value", result.userId);
						$("#userName").attr("value", result.name.toUpperCase());
					}
					validateSend();
				});
			});

			$("#stats").on("input", () => validateSend());
		});
		function validateSend() {
			let allValid = true;

			if ((typeof $("#userName").attr("value")) === "undefined") {
				allValid = false;
				$("#userInput").removeClass("is-invalid");
			} else if ($("#userName").attr("value") == "") {
				$("#userInput").addClass("is-invalid");
				allValid = false;
			} else $("#userInput").removeClass("is-invalid");

			let statsInput = document.getElementById("stats");
			if (!statsInput) {
				allValid = false;
				$("#stats").removeClass("is-invalid");
			} else if (statsInput.value.length === 0 || !/^\d[\d,]*$/.test(statsInput.value)) {
				$("#stats").addClass("is-invalid");
				allValid = false;
			} else {
				$("#stats").removeClass("is-invalid");
				statsInput.value = parseInt(statsInput.value.replaceAll(',', "")).toLocaleString("en-US");
			}

			if (allValid) $("#addEstimate").attr("disabled", false);
			else $("#addEstimate").attr("disabled", true);
		}
	}
	inStatEstimate(url) {
		document.title = "Stat Estimates | Cartel Empire";
		const ownName = user_name;
		if (!this.ownStats) {
			const errorText = document.querySelector("div.content-container.contentColumn strong");
			errorText.innerHTML = `You haven't set your own stats yet! Visit <a class="text-white" href="/Gym">the gym</a> or <a class="text-white" href="/user">the homepage</a>`;
			return;
		}
		const container = document.querySelector("div.content-container.contentColumn");

		const urlParams = new URLSearchParams(window.location.search);
		const userID = urlParams.get("userId");
		const userName = urlParams.get("userName");
		const statEst = urlParams.get("stats");
		const deleteID = urlParams.get("delete");
		if (ownName !== userName && userID !== null && userName !== null && statEst !== null) {
			this.setEst(userID, `~${statEst} ${Date.now()} 0`);
			if (!this.currentList.includes(parseInt(userID))) {
				this.currentList.push(parseInt(userID));
				this.setList(this.currentList);
			}
			this.setName(userID, userName);
			container.innerHTML = `<div class="col-12 col-md-10"><div class="mb-4 card border-success"><div class="card-body text-center bg-success"><p class="card-text fw-bold text-white">Set the stat estimate for <a class="text-white" href="/User/${userID}">${userName}</a> to ${statEst}</p></div></div></div>`;
			window.history.replaceState({}, document.title, this.statEstimateLink); // remove params from URL
		} else if (deleteID !== null) {
			GM_deleteValue(`statEstimate_${deleteID}`);
			this.currentList = this.currentList.filter(estID => estID !== parseInt(deleteID));
			this.setList(this.currentList);
			const userName = this.getName(deleteID);
			container.innerHTML = `<div class="col-12 col-md-10"><div class="mb-4 card border-success"><div class="card-body text-center bg-success"><p class="card-text fw-bold text-white">Removed the stat estimate for <a class="text-white" href="/User/${deleteID}">${userName}</a></p></div></div></div>`;
			window.history.replaceState({}, document.title, this.statEstimateLink); // remove params from URL
		} else container.innerHTML = "";

		const extractedData = [];
		const ownData = [ownName, "self", '~', this.ownStats, "---", 0];
		extractedData.push(ownData);
		for (const ID of this.currentList) {
			const estimate = this.getEst(ID);
			if (estimate === null) {
				this.currentList = this.currentList.filter(estID => estID !== ID);
				continue;
			}
			const textSplit = estimate.split(' ');
			extractedData.push([this.getName(ID) || "???", ID, estimate[0], parseInt(textSplit[0].slice(1).replaceAll(',', "")), parseInt(textSplit[1]), parseInt(textSplit[2])]);
		}
		extractedData.sort((a, b) => {
			if (a[3] !== b[3]) return b[3] - a[3];
			else if (a[2] === '>' && b[2] !== '>') return -1;
			else if (b[2] === '>' && a[2] !== '>') return 1;
			else if (b[2] === '<' && a[2] !== '<') return -1;
			else if (a[2] === '<' && b[2] !== '<') return 1;
			return 0;
		});
		const ownRank = extractedData.indexOf(ownData);
		const pageNumText = url.replace('#', "").match(/\/\d+\/?$/);
		let pageNum = pageNumText === null ? Math.ceil(ownRank / this.perPage) : parseInt(pageNumText[0].replaceAll('/', ""));
		if (pageNum === 0) pageNum = 1;

		let navHTML = "";
		let insert = "";
		let muted = false;
		let added = false;
		for (let i = (pageNum - 1) * this.perPage; i >= 0 && i < extractedData.length && i !== pageNum * this.perPage; ++i) {
			added = true;
			const data = extractedData[i];
			if (!muted && data[3] < this.ownStats * (this.maxFF - 1) / this.constant)
				muted = true;
			if (data[1] === "self")
				insert += `<tr class="align-middle fw-bold"><td>${i + 1}</td><th><a class="fw-bold" href="/user">${ownName}</a></th><td><span style="color: hsl(60, 67%, ${this.brightness}%)">${this.ownStats.toLocaleString("en-US")}</span></td><td>---</td><td></td></tr>`;
			else {
				insert += `<tr class="align-middle"><td${muted ? " class='text-muted'" : ""}>${i + 1}</td><th><a class="fw-bold" href="/User/${data[1]}">${data[0]}</a></th><td><span class="fw-bold">${data[2] === '~' ? "" : data[2].replace('>', "&gt;").replace('<', "&lt;")}</span><span style="color: hsl(${this.ownStats / (this.ownStats + data[3]) * 120}, 67%, ${this.brightness}%)">${data[3].toLocaleString("en-US")}</span></td>`;
				const dateStr = new Date(data[4]).toLocaleDateString("en-GB", { timeZone: "Europe/London" });
				if (data[5] === 0)
					insert += `<td><span style="color: rgba(var(--bs-link-color-rgb), var(--bs-link-opacity, 1))">${dateStr}</span></td>`;
				else
					insert += `<td><a href="/Fight/${data[5]}">${dateStr}</a></td>`;
				insert += `<td><button onclick="window.location.href += '?delete=${data[1]}'" title="Delete" aria-label="Delete stat estimate for ${data[0]}" class="btn btn-sm btn-outline-dark action-btn fw-normal p-0"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" height="20" width="20"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path></svg></button></td></tr>`;
			}
		}
		if (!added)
			insert = `<p class="card-text mt-4">You have no estimates</p>`;
		else {
			insert = `<table class="table align-items-center table-flush table-hover dark-tertiary-bg" id="statEstimateTable"><thead class="thead-light"><tr><th>Rank</th><th>Name</th><th>Estimate</th><th class="d-none d-lg-table-cell">Date of Estimate</th><th class="d-table-cell d-lg-none">Date</th><th>Delete</th></tr></thead><tbody>${insert}</tbody></table>`;
			const lastPageNum = Math.ceil(extractedData.length / this.perPage);
			navHTML = `<nav aria-label="Stat Estimates Page"><ul class="pagination justify-content-center"><li class="page-item${pageNum === 1 ? " active" : ""} pageNav"> <a class="page-link" href="${this.statEstimateLink}/1" data-page="1">1</a></li>`;
			if (pageNum >= 5)
				navHTML += `<li class="page-item pageNav"><a class="page-link" href="${this.statEstimateLink}/${pageNum - 1}" data-page="${pageNum - 1}">&lt;- </a></li>`;
			for (let i = Math.max(2, pageNum - 2); i <= Math.min(lastPageNum - 1, pageNum + 2); ++i)
				navHTML += `<li class="page-item${pageNum === i ? " active" : ""} pageNav"> <a class="page-link" href="${this.statEstimateLink}/${i}" data-page="${i}">${i}</a></li>`;
			if (pageNum <= lastPageNum - 4)
				navHTML += `<li class="page-item pageNav"><a class="page-link" href="${this.statEstimateLink}/${pageNum + 1}" data-page="${pageNum + 1}">-&gt; </a></li>`;
			if (lastPageNum !== 1)
				navHTML += `<li class="page-item${pageNum === lastPageNum ? " active" : ""} pageNav"> <a class="page-link" href="${this.statEstimateLink}/${lastPageNum}" data-page="${lastPageNum}">${lastPageNum}</a></li>`;
			navHTML += `</ul></nav>`;
		}

		const script = document.createElement("script");
		script.type = "text/javascript";
		script.innerHTML = this.scriptFunc.toString().replace(/^[^{]*{/, "").replace(/}[^}]*$/, "");
		document.head.appendChild(script);

		const fileInput = document.createElement("input");
		fileInput.id = "fileInput";
		fileInput.type = "file";
		fileInput.classList.add("d-none");
		fileInput.addEventListener("input", async (e) => {
			const file = e.target.files[0];
			if (file.type !== "application/json") return;

			const contentText = await file.text();
			const content = JSON.parse(contentText);
			for (const [userName, userID] of content) {
				if (userID == this.ownID) continue;

				if (userName !== "???" && userName !== this.getName(userID))
					this.setName(userID, userName);
				const curEst = this.getEst(userID);
				if (curEst !== null || entry[4] <= parseInt(curEst.split(' ')[1])) continue;

				this.setEst(userID, `${entry[2]}${entry[3].toLocaleString("en-US")} ${entry[4]} ${entry[5]}`);
				if (this.currentList.includes(userID)) continue;

				this.currentList.push(userID);
				this.setList(this.currentList);
			}
			window.location.reload();
		});

		const exportText = JSON.stringify(extractedData.filter(data => data[1] !== "self"));
		const fileBlob = new Blob([exportText], { type: "application/octet-binary" });
		const exportURL = window.URL.createObjectURL(fileBlob);
		const exportImport = `<div class="row align-items-center mb-4"><span class="text-center fw-bold">Export/Import Estimates</span></div><div class="row align-items-center mx-2 mb-2"><a class="btn btn-outline-dark w-100" href="${exportURL}" download="stat_estimates.json">Export</a></div><div class="row align-items-center mx-2 mb-2"><a class="btn btn-outline-dark w-100" onclick="document.getElementById('fileInput').click()">Import and Merge</a></div>`;
		const newEntryHTML = `<div class="row"><div class="col-12 col-sm-8 mb-3"><form id="addEstimateForm" class="mt-auto"><div class="row align-items-center mb-2"><div class="col-12 col-sm-3"><label class="form-label fw-bold" for="userId" id="searchLabel">Search</label></div><div class="col-12 col-sm-9"><div class="input-group"> <input class="form-control" type="text" placeholder="Diablo" autofill="false" id="userSearchName"></div></div></div><div class="row align-items-center mb-2"><div class="col-12 col-sm-3"><label class="form-label fw-bold" for="userId" id="usernameLabel">Player</label></div><div class="col-12 col-sm-9"><div class="input-group"> <input class="form-control is-invalid" name="userId" type="number" placeholder="1" min="1" disabled="" id="userInput" value=""><input class="form-control d-none" name="userId" type="number" placeholder="1" min="1" id="userInputActual" value=""><input class="form-control" name="userName" type="text" placeholder="Diablo" id="userName" value="" readonly></div></div></div><div class="row align-items-center"><div class="col-12 col-sm-3"><label class="form-label fw-bold" for="stats">Stats</label></div><div class="col-12 col-sm-9"><input class="form-control is-invalid" name="stats" type="text" placeholder="Enter player's stats" maxlength="20" required="true" autofill="false" id="stats"></div></div><input class="btn btn-outline-dark w-100 mt-4" type="submit" value="Add estimate" disabled="" id="addEstimate"></form></div><div class="col-12 col-sm-4">${exportImport}</div></div>`;
		container.innerHTML += `<div class="col-12 col-md-10"><div class="card mb-2"><div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Battlestat Estimates</h2></div></div></div><div class="card-body">${newEntryHTML}<hr><div class="tab-pane fade active show" role="tabpanel"><div class="row mb-2 align-items-center">${navHTML}<div class="container">${insert}</div></div></div></div></div></div>`;
		container.appendChild(fileInput);
	}
	inSearch(url) {
		const table = document.querySelector("#userTable");

		const tableHeadTr = table.querySelector("thead tr");
		let ageCol = tableHeadTr.querySelectorAll("th")[2];
		let statEstCol = document.createElement("th");
		statEstCol.setAttribute("scope", "col");
		statEstCol.innerText = "Stat Estimate";
		tableHeadTr.insertBefore(statEstCol, ageCol);

		const entries = table.querySelectorAll("tbody tr");
		for (const entry of entries) {
			ageCol = entry.querySelectorAll("td")[1];
			statEstCol = document.createElement("td");

			const userLink = entry.querySelector("th").children[1];
			const userID = userLink.href.match(/\d+$/)[0];

			const statEst = this.getEst(userID);
			if (statEst !== null) {
				const theirStatsText = statEst.split(' ')[0];
				const theirStats = parseInt(theirStatsText.slice(1).replaceAll(',', ""));
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(${this.colorVal(this.ownStats, theirStats) * 120}, 67%, ${this.brightness}%); text-decoration: none">${theirStatsText.replace('>', "&gt;").replace('<', "&lt;")}</a>`;

				const userName = userLink.textContent; // Don't really need username of everyone
				if (userName !== this.getName(userID))
					this.setName(userID, userName);
			} else if (userID === this.ownID && this.ownStats)
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(60, 67%, ${this.brightness}%); text-decoration: none">${this.ownStats.toLocaleString("en-US")}</a>`;
			else {
				statEstCol.classList.add("text-muted");
				statEstCol.textContent = "---";
			}
			entry.insertBefore(statEstCol, ageCol);
		}
	}
	inBountyOrOtherCartel(url) {
		const table = document.querySelector("div.table-responsive table.table");
		if (table === null) return;

		const tableHeadTr = table.querySelector("thead tr");
		let levelCol = tableHeadTr.querySelectorAll("th")[1];
		let statEstCol = document.createElement("th");
		if (/^cartel/.test(url)) statEstCol.setAttribute("scope", "col");

		statEstCol.innerText = "Stat Estimate";
		tableHeadTr.insertBefore(statEstCol, levelCol);

		let entries;
		let start = 0;
		let linkIdx = 1;
		if (/^cartel/.test(url)) {
			entries = table.querySelectorAll("tbody tr");
			if (/\d\/?$/.test(url)) linkIdx = 0;
		} else {
			entries = table.querySelectorAll("thead tr");
			start = 1;
			linkIdx = 0;
		}
		for (let i = start; i !== entries.length; ++i) {
			const entry = entries[i];
			const tds = entry.querySelectorAll("td");
			levelCol = tds[1];
			statEstCol = document.createElement("td");

			const userLink = tds[0].querySelector('a');
			const userID = userLink.href.match(/\d+$/)[0];

			const statEst = this.getEst(userID);
			if (statEst !== null) {
				const theirStatsText = statEst.split(' ')[0];
				const theirStats = parseInt(theirStatsText.slice(1).replaceAll(',', ""));
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(${this.colorVal(this.ownStats, theirStats) * 120}, 67%, ${this.brightness}%); text-decoration: none">${theirStatsText.replace('>', "&gt;").replace('<', "&lt;")}</a>`;

				const userName = userLink.textContent; // Don't really need username of everyone
				if (userName !== this.getName(userID))
					this.setName(userID, userName);
			} else if (userID === this.ownID && this.ownStats)
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(60, 67%, ${this.brightness}%); text-decoration: none">${this.ownStats.toLocaleString("en-US")}</a>`;
			else {
				statEstCol.classList.add("text-muted");
				statEstCol.innerText = "---";
			}
			entry.insertBefore(statEstCol, levelCol);
		}
	}
	inCartelHomepage(url) {
		const table = document.querySelector("div.card-body > div.container-fluid");
		if (table === null) return;

		const tableHead = table.querySelector(".row-header");
		let levelCol = tableHead.querySelectorAll(".col")[1];
		let roleCol;
		let daysCol = tableHead.querySelectorAll(".col")[2];

		let statEstCol = document.createElement("div");
		statEstCol.classList.add("col", "col-xl-1");
		statEstCol.innerText = "Stat Estimate";
		tableHead.insertBefore(statEstCol, levelCol);

		levelCol.classList.remove("col-xl-2");
		levelCol.classList.add("col-xl-1");
		daysCol.classList.remove("col-xl-2");
		daysCol.classList.add("col-xl-1");

		const entries = table.querySelectorAll(".row.align-middle");
		for (const entry of entries) {
			const cols = entry.querySelectorAll(".col");

			levelCol = cols[0];
			roleCol = cols[1];
			daysCol = cols[2];

			statEstCol = document.createElement("div");
			const statEstColHeader = document.createElement("div");
			statEstCol.classList.add("col", "col-3", "col-xl-1");

			statEstColHeader.classList.add("col-3", "d-xl-none", "fw-bold");
			levelCol.classList.remove("col-xl-2", "col-3");
			levelCol.classList.add("col-xl-1", "col-2");
			daysCol.classList.remove("col-xl-2", "col-3");
			daysCol.classList.add("col-xl-1", "col-2");
			roleCol.classList.remove("col-3");
			roleCol.classList.add("col-2");
			
			statEstColHeader.innerText = "Stat Estimate";

			const userLink = entry.querySelector('a');
			const userID = userLink.href.match(/\d+$/)[0];

			const statEst = this.getEst(userID);
			if (statEst !== null) {
				const theirStatsText = statEst.split(' ')[0];
				const theirStats = parseInt(theirStatsText.slice(1).replaceAll(',', ""));
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(${this.colorVal(this.ownStats, theirStats) * 120}, 67%, ${this.brightness}%); text-decoration: none">${theirStatsText.replace('>', "&gt;").replace('<', "&lt;")}</a>`;

				const userName = userLink.innerText; // Don't really need username of everyone
				if (userName !== this.getName(userID))
					this.setName(userID, userName);
			} else if (userID === this.ownID && this.ownStats)
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(60, 67%, ${this.brightness}%); text-decoration: none">${this.ownStats.toLocaleString("en-US")}</a>`;
			else {
				statEstCol.classList.add("text-muted");
				statEstCol.innerText = "---";
			}
			entry.insertBefore(statEstCol, levelCol);
		}
	}
	inCartelWar(url) {
		const war = document.querySelector("div#warReportModule");
		if (!war) return;

		let cols = war.querySelectorAll("div.col-12.col-lg-6");
		cols[0].classList.remove("col-lg-6");
		cols[0].classList.add("col-lg-7");
		cols[1].classList.remove("col-lg-6");
		cols[1].classList.add("col-lg-5");

		const theirTable = cols[0].querySelector("table.table");
		const tableHeadTr = theirTable.querySelector("thead tr");
		let levelCol = tableHeadTr.querySelectorAll("th")[1];

		let statEstCol = document.createElement("th");
		statEstCol.setAttribute("scope", "col");
		statEstCol.innerText = "Stat Estimate";
		tableHeadTr.insertBefore(statEstCol, levelCol);

		const tableBody = theirTable.querySelector("tbody");

		observeDOM(theirTable, e => {
			if (e[0].target !== tableBody) return;

			const trs = tableBody.querySelectorAll("tr");
			for (const tr of trs) {
				const tds = tr.querySelectorAll("td");
				levelCol = tds[1];
				statEstCol = document.createElement("td");

				const statusCol = tds[2];
				if (statusCol.innerText === "Active") // Highlight actives in war
					statusCol.classList.add("fw-bold");
				else
					statusCol.classList.add("text-muted");

				const userLink = tds[0].querySelector('a');
				const userID = userLink.href.match(/\d+$/)[0];

				const statEst = this.getEst(userID);
				if (statEst !== null) {
					const theirStatsText = statEst.split(' ')[0];
					const theirStats = parseInt(theirStatsText.slice(1).replaceAll(',', ""));
					statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="text-decoration: none">${theirStatsText.replace('>', "&gt;").replace('<', "&lt;")}</a>`;

					const userName = userLink.innerText;
					if (userName !== this.getName(userID))
						this.setName(userID, userName);
				} else {
					statEstCol.classList.add("text-muted");
					statEstCol.innerText = "---";
				}
				tr.insertBefore(statEstCol, levelCol);
			}
		});
	}
	inHomepage(url) {
		try {
			// Grab the stats container and rows
			const stats = document.querySelectorAll("div.mb-4.card.flex-fill")[1];
			const statRows = stats?.querySelectorAll(".row.align-items-center.gy-2.mb-2");

			// Ensure stats and rows are found
			if (!stats || statRows?.length <= 0) {
				console.error("Stats or stat rows not found");
				return;
			}
			const fifthSpan = statRows[0].querySelector("div:last-of-type > p"); // Get last p in the first row
			const statText = (fifthSpan.lastChild ?? fifthSpan)?.textContent.replace(/\D/g, "");
			const statValue = statText ? parseInt(statText, 10) : 0;

			// If value has changed, update
			if (this.ownStats === statValue || statValue === 0) return;

			console.info("Updating ownStats");
			this.setEst("self", statValue);
		} catch (error) {
			console.error("Error in inHomepage:", error);
		}
	}
	inGym(url) {
		const totalStats = document.querySelector("p.card-text.fw-bold.text-muted"); // Total is the first one
		if (totalStats === null) return;

		const totalStatsVal = parseInt(totalStats.textContent.split(' ')[0].slice(1).replaceAll(',', ""));

		if (this.ownStats !== totalStatsVal) this.setEst("self", totalStatsVal);
	}
	inFight(url) {
		const showEsts = (nameA, nameB, A_ID, B_ID, Anew = false, Bnew = false) => {
			let container = document.querySelector("div.contentColumn");
			const fightReport = container.querySelector("div.col-12.col-md-10");
			let ests = document.createElement("div");
			ests.classList.add("col-12", "col-md-10");
			const estA = A_ID === "self" ? (this.ownStats ? this.ownStats.toLocaleString("en-US") : "???") : (this.getEst(A_ID) || "???");
			const estB = this.getEst(B_ID) || "???";
			let inner = `<div class="row"><div class="col-md-6 col-12"><div class="mb-4 card"><div class="row mb-0"><div class="col-12"><div class="header-section text-center"><h2>`;
			inner += nameA === "You" ? "You" : `<a class="text-white" href="/${A_ID === "self" ? "user" : ("User/" + A_ID)}">${nameA}</a>`;
			inner += `</h2></div></div></div><div class="card-body"><p class="card-text text-center">Stat estimate: `;
			if (estA === "???") inner += `<span class="text-muted">???</span>`;
			else {
				const Astats = parseInt(estA.split(' ')[0].replace(/[,<>~]/g, ""));
				inner += `<span class="fw-bold" style="color: hsl(${this.colorVal(this.ownStats, Astats) * 120}, 67%, ${this.brightness}%)">${estA.split(' ')[0].replace('>', "&gt;").replace('<', "&lt;")}</span>${Anew ? " (new)" : ""}`;
			}
			inner += `</p></div></div></div><div class="col-md-6 col-12"><div class="mb-4 card"><div class="row mb-0"><div class="col-12"><div class="header-section text-center"><h2><a class="text-white" href="/${"User/" + B_ID}">${nameB}</a></h2></div></div></div><div class="card-body"><p class="card-text text-center">Stat estimate: `;
			if (estB === "???") inner += `<span class="text-muted">???</span>`;
			else {
				const Bstats = parseInt(estB.split(' ')[0].replace(/[,<>~]/g, ""));
				inner += `<span class="fw-bold" style="color: hsl(${this.colorVal(this.ownStats, Bstats) * 120}, 67%, ${this.brightness}%)">${estB.split(' ')[0].replace('>', "&gt;").replace('<', "&lt;")}</span>${Bnew ? " (new)" : ""}`;
			}
			inner += `</p></div></div></div></div>`;
			ests.innerHTML = inner;
			container.insertBefore(ests, fightReport);
		};

		const firstRow = document.querySelector("div.fightTable tbody tr td");
		if (!firstRow) return;
		
		const youAttacked = firstRow.textContent.startsWith("You ");
		const attackedYou = firstRow.textContent.endsWith(" you");
		const estimate = youAttacked ? this.estimateYouAttacked.bind(this) : attackedYou ? this.estimateAttackedYou.bind(this) : this.AattackedB.bind(this);

		const headers = document.querySelectorAll("div.card-body p.card-text.fw-bold");
		if (!this.ownStats || headers.length < 3 || (headers[0].textContent.split(' ')[2] === "Loss" && !attackedYou)) {
			if (firstRow.children.length === 1) {
				const other = firstRow.children[0];
				showEsts("You", other.textContent, "self", other.href.match(/\d+$/)[0]);
			} else {
				const userA = firstRow.children[0];
				const userB = firstRow.children[1];
				showEsts(userA.textContent, userB.textContent, userA.href.match(/\d+$/)[0], userB.href.match(/\d+$/)[0]);
			}
			return;
		}
		const fairFightText = headers[1];
		const fairFight = parseFloat(fairFightText.children[0].textContent.slice(1));
		const dateText = headers[headers.length - 1].textContent.slice(7).split(/[ :\/]/g);
		const fightDate = Date.UTC(dateText[5], parseInt(dateText[4]) - 1, dateText[3], dateText[0], dateText[1], dateText[2]);

		let fightID = url.replace('#', "").match(/\d+\/?$/)[0];
		if (fightID.endsWith('/')) fightID = fightID.slice(0, -1);

		// Method: replace old log with new log, but only if it's more extreme OR specific
		if (youAttacked || attackedYou) {
			const userLink = firstRow.children[0];
			const againstID = userLink.href.match(/\d+$/)[0];
			const currentEstimate = this.getEst(againstID);

			const userName = userLink.textContent;
			if (userName !== this.getName(againstID))
				this.setName(againstID, userName);

			if (currentEstimate === null || fightDate > parseInt(currentEstimate.split(' ')[1])) {
				const est = estimate(this.ownStats, fairFight);
				const newStatEst = parseInt(est[1].replace(',', ""));
				if (currentEstimate !== null) {
					const curStatEst = parseInt(currentEstimate.split(' ')[0].slice(1).replace(',', ""));
					if (this.dontOverride(curStatEst, newStatEst, currentEstimate[0], est[0])) {
						showEsts("You", userName, "self", againstID);
						return;
					}
				}

				this.setEst(againstID, `${est[0]}${est[1]} ${fightDate} ${fightID}`);
				if (!this.currentList.includes(parseInt(againstID))) {
					this.currentList.push(parseInt(againstID));
					this.setList(this.currentList);
				}
			}
			showEsts("You", userName, "self", againstID, false, true);
		} else {
			// Indirect attack logs
			const userA = firstRow.children[0];
			const userB = firstRow.children[1];
			const A_ID = userA.href.match(/\d+$/)[0];
			const B_ID = userB.href.match(/\d+$/)[0];
			const Astats = this.getEst(A_ID);
			const Bstats = this.getEst(B_ID);
			if (Astats !== null && Bstats !== null) {
				const Adate = parseInt(Astats.split(' ')[1]);
				const Bdate = parseInt(Bstats.split(' ')[1]);
				if (Adate === Bdate || fightDate <= Adate || fightDate <= Bdate) {
					showEsts(userA.textContent, userB.textContent, A_ID, B_ID);
					return;
				}

				const newerStats = Adate > Bdate ? Astats : Bstats;
				const otherEst = estimate(newerStats, fairFight, Adate > Bdate);
				if (otherEst.length === 0) {
					showEsts(userA.textContent, userB.textContent, A_ID, B_ID);
					return;
				}
				const oldEst = Adate > Bdate ? Bstats : Astats;
				console.info(parseInt(oldEst.split(' ')[0].slice(1).replaceAll(',', "")), parseInt(otherEst[1].replaceAll(',', "")), oldEst[0], otherEst[0]);
				if (this.dontOverride(parseInt(oldEst.split(' ')[0].slice(1).replaceAll(',', "")), parseInt(otherEst[1].replaceAll(',', "")), oldEst[0], otherEst[0])) {
					showEsts(userA.textContent, userB.textContent, A_ID, B_ID);
					return;
				}
				const otherID = Adate > Bdate ? B_ID : A_ID;
				this.setEst(otherID, `${otherEst[0]}${otherEst[1]} ${newerStats.split(' ')[1]} ${fightID}`);
				if (!this.currentList.includes(parseInt(otherID))) {
					this.currentList.push(parseInt(otherID));
					this.setList(this.currentList);
				}
				showEsts(userA.textContent, userB.textContent, A_ID, B_ID, Adate <= Bdate, Adate > Bdate);
			} else if ((Astats !== null && Bstats === null) || (Astats === null && Bstats !== null)) {
				const knownStats = Astats !== null ? Astats : Bstats;
				const knownDate = parseInt(knownStats.split(' ')[1]);
				if (fightDate <= knownDate) {
					showEsts(userA.textContent, userB.textContent, A_ID, B_ID);
					return;
				}

				const otherEst = estimate(knownStats, fairFight, Astats !== null);
				if (otherEst.length === 0) {
					showEsts(userA.textContent, userB.textContent, A_ID, B_ID);
					return;
				}
				const otherID = Astats !== null ? B_ID : A_ID;
				this.setEst(otherID, `${otherEst[0]}${otherEst[1]} ${knownDate} ${fightID}`);
				if (!this.currentList.includes(parseInt(otherID))) {
					this.currentList.push(parseInt(otherID));
					this.setList(this.currentList);
				}
				showEsts(userA.textContent, userB.textContent, A_ID, B_ID, Astats === null, Astats !== null);
				const otherUser = Astats !== null ? userB : userA;
				const userName = otherUser.textContent;
				if (userName !== this.getName(otherID))
					this.setName(otherID, userName);
			}
			else
				showEsts(userA.textContent, userB.textContent, A_ID, B_ID);
		}
	}
	inUserProfile(url) {
		let userID = url.replace('#', "").match(/\d+\/?$/)[0];
		if (userID.endsWith('/')) userID = userID.slice(0, -1);
		if (userID === this.ownID) return;

		const statsTable = document.querySelector("div.card-body tbody");
		const estimate = this.getEst(userID);

		const attackText = document.querySelector("div#attackConfirmModal p.card-text");
		const level = parseInt(statsTable.children[4].children[1].textContent);
		const repMultipliers = {
			Attack: 1,
			Mug: this.multMug,
			Hospitalise: this.multHosp
		};
		let prefix = "";
		let append = "";
		let expectedRep = 0;

		if (estimate !== null) {
			const textSplit = estimate.split(' ');
			const statEstimate = textSplit[0];
			const date = new Date(parseInt(textSplit[1])).toLocaleDateString("en-GB", { timeZone: "Europe/London" });

			const theirStats = parseInt(statEstimate.slice(1).replaceAll(',', ""));
			statsTable.innerHTML += `<tr><th>Stat Estimate:</th><td><a href="${this.statEstimateLink}" class="fw-bold" style="color: hsl(${this.colorVal(this.ownStats, theirStats) * 120}, 67%, ${this.brightness}%)">${statEstimate.replace('>', "&gt;").replace('<', "&lt;")}</a> (${date})</td></tr>`;

			expectedRep = this.ownStats ? this.estimateRep(level, this.calcFairFight(this.ownStats, theirStats)) : "???";
			prefix = statEstimate[0].replace('~', "");
		} else {
			statsTable.innerHTML += `<tr><th>Stat Estimate:</th><td><a href="${this.statEstimateLink}" class="text-muted">No attacks recorded</a></td></tr>`;
			expectedRep = this.estimateRep(level, this.maxFF);
			append = " with 3x fair fight modifier";
		}
		const attackConfirmModal = document.getElementById('attackConfirmModal');
        attackConfirmModal.addEventListener('show.bs.modal', async (e) => {
            // Skip one event-loop cycle to let game's listener fire first
            // hacky solution, please fix later
            await wait(0);
			const textSplit = e.relatedTarget?.childNodes[0].textContent.split(' ');
			let attackType = textSplit[textSplit.length - 2];
			const bodyText = attackConfirmModal.querySelector('.modal-bodyText');
			attackType = attackType.charAt(0).toUpperCase() + attackType.slice(1);
			if (!["Attack", "Mug", "Hospitalise"].includes(attackType))
				return;
			bodyText.innerHTML += `<br>Expected rep gain: <span class="fw-bold">${prefix.replace('>', "&gt;").replace('<', "&lt;")}${expectedRep === "???" ? "???" : Math.round(expectedRep * repMultipliers[attackType])}</span>${append}`;
        });

		const userName = document.querySelector("div.header-section > .profileNameTitle").textContent;
		if (userName !== this.getName(userID)) this.setName(userID, userName);
	}
	inEvents(url) {
		const urlParams = new URLSearchParams(window.location.search);
		const category = urlParams.get("filter");
		if (category !== "Attack") return;

		const eventList = document.querySelector("div.container.eventWrapper").children;
		for (let i = 2; i !== eventList.length; ++i) {
			const ev = eventList[i];
			ev.children[0].classList.value = "col-2 col-lg-2 col-md-2 col-sm-2"; //"col-2 col-lg-2 col-md-2 col-sm-2";
			ev.children[1].classList.value = "col-5 col-lg-6 col-md-7 col-sm-7"; //"col-5 col-lg-6 col-md-5 col-sm-6";
			ev.children[2].classList.value = "col-3 col-lg-2 d-none d-lg-inline"; //"col-3 col-lg-2 col-md-3 col-sm-2";

			const estCol = document.createElement("div");
			const mergedCol = document.createElement("div");
			estCol.classList.value = "col-2 col-lg-2 d-none d-lg-inline"; //"col-2 col-lg-2 col-md-2 col-sm-2";
			mergedCol.classList.value = "col-3 col-md-3 col-sm-3 d-lg-none"; // new

			if (i === 2) {
				estCol.textContent = "Stat Estimate";
				mergedCol.textContent = "Date/Est";
				ev.insertBefore(estCol, ev.children[2]);
				ev.appendChild(mergedCol);
				continue;
			}
			const userID = parseInt(ev.children[1].querySelector("a").href.match(/\d+$/)[0]);
			const theirStats = this.getEst(userID);
			if (theirStats !== null) {
				estCol.style.color = `hsl(${this.colorVal(this.ownStats, parseInt(theirStats.split(' ')[0].slice(1).replaceAll(',', ""))) * 120}, 67%, ${this.brightness}%)`;
				estCol.textContent = theirStats.split(' ')[0];
				mergedCol.innerHTML = `${ev.children[2].textContent}<br><span style="color: ${estCol.style.color}">${estCol.innerText}</span>`;
			} else {
				estCol.classList.add("text-muted");
				estCol.textContent = "???";
				mergedCol.innerHTML = `${ev.children[2].textContent}<br><span class="text-muted">${estCol.textContent}</span>`;
			}
			ev.insertBefore(estCol, ev.children[2]);
			ev.appendChild(mergedCol);
		}
	}
}


class TotalListingValue {

	static metadata = {
		displayName: 'Total Listing Value',
		description: 'Calculate and display the total value of your listed items',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() { }

	inMarket(url) {
		const ownOffers = document.querySelector("div.offerListWrapper:first-of-type");
		if (ownOffers === null) return;

		const header = ownOffers.querySelector("div.row.row-cols-3.row-header");
		const offerItems = ownOffers.querySelectorAll('div.inventoryItemWrapper');

		const totalVal = this.getTotalValue(offerItems);

		const totalValCard = document.createElement("div");
		totalValCard.classList.add("card-body", "mb-2");
		totalValCard.innerHTML = `<p class="card-text">The total value of your listings is <span class="fw-bold">${POUND}${totalVal.toLocaleString("en-US")}</span>.</p>`;
		ownOffers.insertBefore(totalValCard, header);
	}
	getTotalValue(offerItems) {
		let totalVal = 0;
		for (const item of offerItems) {
			if (item.children.length < 5) continue;

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

	static metadata = {
		displayName: 'Transparent Chats',
		description: 'Make chats slightly transparent',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() { }

	inAnywhere() {
		GM_addStyle("div.chats.row label.chat-btn { opacity: 0.9 }");
	}
}


class TrueKDR {

	static metadata = {
		displayName: 'True Kill / Death Ratio',
		description: 'Calculate and display the true fights won / fights lost ratio',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() { }

	inHomepage(url) {
		const stats = document.querySelectorAll(".col-md-6.d-flex.align-items-stretch.col-xxl-4");
		if (stats.length < 2) return;

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


class ConfigManager {
    static instance;

    constructor() {
        this.MODULES = [
            AchievementStats,
            AddItemButtons,
            AddLinks,
            BankDepositTax,
            BetterItemValues,
            BetterMoneyInputs,
            BetterProgressBars,
            BlackjackHelper,
            BuyMaxButton,
            BuyPointsLink,
            CartelMemberRep,
            CenterTabs,
            CenterText,
            ColorChatNames,
            ColorStats,
            DisableThrow,
            DisplayPerks,
            DisplayTownCaches,
            DPEnergyRefillReminder,
            EstateLevelInfo,
            EstimatedIntGains,
            ExpeditionChances,
            GreenMoney,
            HighlightExcessHealth,
            HighlightInactives,
            HighlightUnequipped,
            HighscoreChanges,
            HospTimeEstimate,
            IntPerWeek,
            ItemCache,
            LargerGymGraph,
            PropertyPageAgentLink,
            RoundedCards,
            ScriptSettings,
            StatEstimate,
            TotalListingValue,
            TransparentChats,
            TrueKDR
        ];

        this.PAGE_DATA = [
            [/^achievements\/?.*$/, 'inAchievements', 'In Achievements'],
            [/^gym\/?$/, 'inGym', 'In Gym'],
            [/^university\/?$/, 'inUniversity', 'In Univesity'],
            [/^university\/[132]\/?$/, 'inUniversityPage', 'In Univserity Course'],
            [/^jail\/?$/, 'inJail', 'In Jail'],
            [/^bank\/?$/, 'inBank', 'In Bank'],
            [/^expedition/, 'inExpeditions', 'In Expeditions'],
            [/^market/, 'inMarket', 'In Market'],
            [/^supporter\/?$/, 'inSupporter', 'In Supporter'],
            [/^town\/?$/, 'inTown', 'In Town'],
            [/^town\/estateagent\/?/, 'inEstateAgent', 'In Estate Agent'],
            [/^town\/pharmacy\/?$/, 'inPharmacy', 'In Pharmancy'],
            [/^town\/armedsurplus\/?$/, 'inArmedSurplus', 'In Armed Surplus'],
            [/^town\/diablos\/?$/, 'inDiablos', 'In Diablo\'s Underground Weapon Store'],
            [/^town\/dealership\/?$/, 'inCarDealership', 'In Car Dealership'],
            [/^town\/club\/?$/, 'inSicarios', 'In Scicarios Store'],
            [/^town\/mateos\/?$/, 'inMateos', 'In Mateo\'s Store'],
            [/^town\/policeauction\/?$/, 'inPoliceAuction', 'In Police Auction'],
            [/^town\/.+\/?$/, 'inTownStore', 'In Town Store'],
            [/^petshop\/?$/, 'inPetshop', 'In Pet Store'],
            [/^trade\/view/, 'inTradeView', 'In Trade View'],
            [/^trade\/?$/, 'inTrade', 'In Trade'],
            [/^trade\/additems/, 'inAddItems', 'In Add Items'],
            [/^cartel\/\d+\/?$/, 'inBountyOrOtherCartel', 'In Bounty or Other Cartel'],
            [/^cartel\/?$/, 'inCartel', 'In Own Cartel'],
            [/^cartel\/armou?ry\/deposit\/?$/, 'inAddItems', 'In Add Items of Armory'],
            [/^cartel\/armou?ry/, 'inCartelArmory', 'In Cartel Armory'],
            [/^cartel\/armou?ry\/bulkeditarmou?ry/, 'inCartelArmoryEditor', 'In Cartel Bulk Armory Editor'],
            [/^cartel\/territory\/?$/, 'inCartelWar', 'In Cartel War'],
            [/^cartel\/perks\/?$/, 'inCartelPerks', 'in Cartel Perks'],
            [/^cartel\/allfights/, 'inAttackLog', 'In Cartel Attack Logs'],
            [/^events/, 'inEvents', 'In Events'],
            [/^production\/?$/, 'inProduction', 'In Production'],
            [/^jobs\/?$/, 'inJobs', 'In Jobs'],
            [/^inventory/, 'inInventory', 'In Inventory'],
            [/^casino\/?$/, 'inCasino', 'In Casino'],
            [/^casino\/spinner\/?$/, 'inCasinoSpinner', 'In Casino Spinner'],
            [/^casino\/blackjack\/?$/, 'inBlackjack', 'In Blackjack'],
            [/^casino\/blackjackstats(\/|\/?\?.+)?/, 'inBlackjackStats', 'In Blackjack Stats'],
            [/^highscores/, 'inHighscores', 'In Highscores'],
            [/^(home|user)\/?$/, 'inHomepage', 'In Homepage'],
            [/^user\/\d+\/?$/, 'inUserProfile', 'In User Profile'],
            [/^user\/stats/, 'inPersonalStats', 'In Personal Stats'],
            [/^gallery\/\d+\/?$/, 'inGallery', 'In Gallery'],
            [/^property\/?$/, 'inProperty', 'In Property'],
            [/^statestimates(\/|(\/\d+\/?)?(\?.+)?)?/, 'inStatEstimate', 'In Stat Estimates'],
            [/^(advanced)?search/, 'inSearch', 'In Search'],
            [/^bounty/, 'inBountyOrOtherCartel', 'In Bounty or Other Cartel'],
            [/^fight/, 'inFight', 'In Fight'],
            [/^connections$/, 'inConnections', 'In Connections'],
            [/^forum\/\d+\/\d+|^forum\/thread\/\d+/, 'inForumPost', 'In Forum Post'],
            [/^forum\/\d+/, 'inForumCategory', 'In Forum Category'],
            [/^inbox|^outbox/, 'inMail', 'In Mail'],
            [/^settings/, 'inSettings', 'In Settings'],
            [/./, 'inAnywhere', 'Anywhere']
        ];

        // Maps the page regex to the method name
        this.URL_MAP = new Map(this.PAGE_DATA.map(page_data => [page_data[0], page_data[1]]));
        
        const updatedSettings = this.updateSettings(getValue('script', 'settings'));
        if (updatedSettings) setValue('script', 'settings', updatedSettings);

        this.STRIKETHROUGH = false; // Display the normally-displayed price as well, striked-through
        this.ALWAYS_COLOR_NAMES = [ "FN SCAR-H", "Desert Eagle", "Full-Body Armour" ];
        this.DAYS = 7; // Number of days of production materials to stock up
        this.darkmode = document.querySelector("html").getAttribute("data-bs-theme") === "dark";
    }

    updateSettings(current) {
		const settings = current || {};
		for (const module of this.MODULES) {
            if (!settings[module.name])
			    settings[module.name] = {'active': {}, 'custom': {}};
            if (!settings[module.name]['active'])
                settings[module.name]['active'] = {}
            if (!settings[module.name]['custom'])
                settings[module.name]['custom'] = {}

            // Populate page active settings
			const methods = Object.getOwnPropertyNames(module.prototype);
			const allMethods = this.URL_MAP.values().toArray();
			const availableMethods = new Set(allMethods).intersection(new Set(methods));

			for (const method of availableMethods.values()) {
                if (settings[module.name]['active'][method] === undefined)
				    settings[module.name]['active'][method] = true;
			}

            // Populate custom settings
            const meta = module.metadata;
            const customSettings = meta?.settings?.custom;
            if (!customSettings) return;

            for (const [settingName, setting] of Object.entries(customSettings)) {
                if (settings[module.name]['custom'][settingName] === undefined)
				    settings[module.name]['custom'][settingName] = setting?.defaultValue;
			}
		}
		return settings;
	}

    getCustomSetting(moduleInstance, settingName) {
        const moduleName = moduleInstance.constructor.name;
        const allSettings = getSettings(moduleName);
        if (allSettings === null) return null;

        const setting = allSettings['custom']?.[settingName];
        if (setting === undefined || setting === null) return null;
        return setting;
    }
    
    static getInstance() {
        if (this.instance) return this.instance;

        this.instance = new ConfigManager();
        return this.instance;
    }
}

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
 
 
(function(links, strikethrough, alwaysColorNames, days) {
	const URL = window.location.href.split(/\/|\?/g).slice(3).join('/').replace(/#[^\?\/]*$/, "").toLowerCase() || "home";
	const darkMode = document.querySelector("html").getAttribute("data-bs-theme") === "dark";

	const configManger = ConfigManager.getInstance();

	configManger.MODULES.forEach(__class__ => {
		const methods = Object.getOwnPropertyNames(__class__.prototype);
		const settings = getSettings(__class__.name);

		let instance;
		for (const [regex, method] of configManger.URL_MAP.entries()) {
			if (!regex.test(URL)) continue;
			if (!methods.includes(method)) continue;
			if (!settings['active'][method]) continue;

			instance ??= new __class__();
			instance[method](URL);
		}
		
	});
 
	return darkMode; // Just for confusion for decompilers
})(LINKS, STRIKETHROUGH, ALWAYS_COLOR_NAMES, DAYS);

