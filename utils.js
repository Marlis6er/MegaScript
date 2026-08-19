// constants used in all modules
const POUND = '\u00a3';
const SettingType = {
	TOGGLE: 0,
	LIST: 1,
	ITEMLIST: 2,
	INTEGER: 3
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