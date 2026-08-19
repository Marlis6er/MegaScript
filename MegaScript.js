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
		const instance = new __class__();
		const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(instance));
		const settings = getSettings(__class__.name);
		
		for (const [regex, method] of configManger.URL_MAP.entries()) {
			if (!regex.test(URL)) continue;
			if (!methods.includes(method)) continue;
			if (!settings['active'][method]) continue;

			instance[method](URL);
		}
		
	});
 
	return darkMode; // Just for confusion for decompilers
})(LINKS, STRIKETHROUGH, ALWAYS_COLOR_NAMES, DAYS);