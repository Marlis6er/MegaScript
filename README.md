# Cartel Empire MegaScript
This is a tampermonkey script for Cartel Empire, originally created by K9er.

# Using the github version

(Should work with any browser)
To use this version, you have to:
1) Create a new tampermonkey script
2) Copy-paste the following template:
```
// ==UserScript==
// @name         MegaScript Modular github version
// @namespace    Cartel Empire
// @version      1.0.27
// @description  An updated version of the MegaScript by K9er
// @author       K9ER [781], Marlis [15746]
// @include      /https:\/\/cartelempire\.online\/?.*$/
// @icon         https://i.imgur.com/Zh7LX39.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @run-at       document-end
// @require      https://raw.githubusercontent.com/Marlis6er/MegaScript/refs/heads/modular/MegaScriptBundled.js
// ==/UserScript==
```

# Using local files

(Only works on chrome)
To use this version, you have to:
1) Clone or download the repo
2) Create a new tampermonkey script
3) Copy-paste the following template:
```
// ==UserScript==
// @name         AP megascript refactor version
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  MegaScript instance to fix known bugs and update outdated systems
// @author       K9er, Marlis
// @include      /https:\/\/cartelempire\.online\/?.*$/
// @icon         https://i.imgur.com/Zh7LX39.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @run-at       document-end
// @require      file://Path/to/your/folder/utils.js

// @require      file://Path/to/your/folder/modules/AchievementStats.js
// @require      file://Path/to/your/folder/modules/AddItemButtons.js
// @require      file://Path/to/your/folder/modules/AddLinks.js
// @require      file://Path/to/your/folder/modules/BankDepositTax.js
// @require      file://Path/to/your/folder/modules/BetterItemValues.js
// @require      file://Path/to/your/folder/modules/BetterMoneyInputs.js
// @require      file://Path/to/your/folder/modules/BetterProgressBars.js
// @require      file://Path/to/your/folder/modules/BlackjackHelper.js
// @require      file://Path/to/your/folder/modules/BuyMaxButton.js
// @require      file://Path/to/your/folder/modules/BuyPointsLink.js
// @require      file://Path/to/your/folder/modules/CartelMemberRep.js
// @require      file://Path/to/your/folder/modules/CenterTabs.js
// @require      file://Path/to/your/folder/modules/CenterText.js
// @require      file://Path/to/your/folder/modules/ColorChatNames.js
// @require      file://Path/to/your/folder/modules/ColorStats.js
// @require      file://Path/to/your/folder/modules/DisableThrow.js
// @require      file://Path/to/your/folder/modules/DisplayPerks.js
// @require      file://Path/to/your/folder/modules/DisplayTownCaches.js
// @require      file://Path/to/your/folder/modules/DPEnergyRefillReminder.js
// @require      file://Path/to/your/folder/modules/EstateLevelInfo.js
// @require      file://Path/to/your/folder/modules/EstimatedIntGains.js
// @require      file://Path/to/your/folder/modules/ExpeditionChances.js
// @require      file://Path/to/your/folder/modules/GreenMoney.js
// @require      file://Path/to/your/folder/modules/HighlightExcessHealth.js
// @require      file://Path/to/your/folder/modules/HighlightInactives.js
// @require      file://Path/to/your/folder/modules/HighlightUnequipped.js
// @require      file://Path/to/your/folder/modules/IntPerWeek.js
// @require      file://Path/to/your/folder/modules/ItemCache.js
// @require      file://Path/to/your/folder/modules/LargerGymGraph.js
// @require      file://Path/to/your/folder/modules/PropertyPageAgentLink.js
// @require      file://Path/to/your/folder/modules/RoundedCards.js
// @require      file://Path/to/your/folder/modules/ScriptSettings.js
// @require      file://Path/to/your/folder/modules/StatEstimate.js
// @require      file://Path/to/your/folder/modules/TotalListingValue.js
// @require      file://Path/to/your/folder/modules/TransparentChats.js
// @require      file://Path/to/your/folder/modules/TrueKDR.js

// @require      file://Path/to/your/folder/ConfigManager.js
// @require      file://Path/to/your/folder/MegaScript.js
// ==/UserScript==
```
And replace the `Path/to/your/folder` part with a path to the folder which contains all the scripts.