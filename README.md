# Cartel Empire MegaScript
This is a tampermonkey script for Cartel Empire, originally created by K9er.

**NOTE:** This is a temporary branch to refactor the script and split it into multiple files. It is usable, but the version the main-branch is a much more user-friendly version.

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
// @author       K9er
// @include      /https:\/\/cartelempire\.online\/?.*$/
// @icon         https://i.imgur.com/Zh7LX39.png
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @run-at       document-end
// @require      file://Path/to/your/folder/utils.js

// @require      file://Path/to/your/folder/AddItemButtons.js
// @require      file://Path/to/your/folder/AddLinks.js
// @require      file://Path/to/your/folder/BankDepositTax.js
// @require      file://Path/to/your/folder/BetterItemValues.js
// @require      file://Path/to/your/folder/BetterMoneyInputs.js
// @require      file://Path/to/your/folder/BetterProgressBars.js
// @require      file://Path/to/your/folder/BlackjackHelper.js
// @require      file://Path/to/your/folder/BuyPointsLink.js
// @require      file://Path/to/your/folder/CartelMemberRep.js
// @require      file://Path/to/your/folder/CenterTabs.js
// @require      file://Path/to/your/folder/CenterText.js
// @require      file://Path/to/your/folder/ColorChatNames.js
// @require      file://Path/to/your/folder/ColorStats.js
// @require      file://Path/to/your/folder/DisableThrow.js
// @require      file://Path/to/your/folder/DisplayPerks.js
// @require      file://Path/to/your/folder/DisplayTownCaches.js
// @require      file://Path/to/your/folder/DPEnergyRefillReminder.js
// @require      file://Path/to/your/folder/EstateLevelInfo.js
// @require      file://Path/to/your/folder/EstimatedIntGains.js
// @require      file://Path/to/your/folder/ExpeditionChances.js
// @require      file://Path/to/your/folder/GreenMoney.js
// @require      file://Path/to/your/folder/HighlightExcessHealth.js
// @require      file://Path/to/your/folder/HighlightInactives.js
// @require      file://Path/to/your/folder/HighlightUnequipped.js
// @require      file://Path/to/your/folder/HighscoreChanges.js
// @require      file://Path/to/your/folder/IntPerWeek.js
// @require      file://Path/to/your/folder/ItemCache.js
// @require      file://Path/to/your/folder/LargerGymGraph.js
// @require      file://Path/to/your/folder/PropertyPageAgentLink.js
// @require      file://Path/to/your/folder/RoundedCards.js
// @require      file://Path/to/your/folder/ScriptSettings.js
// @require      file://Path/to/your/folder/StatEstimate.js
// @require      file://Path/to/your/folder/TotalListingValue.js
// @require      file://Path/to/your/folder/TransparentChats.js
// @require      file://Path/to/your/folder/TrueKDR.js

// @require      file://Path/to/your/folder/MegaScript.js
// ==/UserScript==
```
And replace the `Path/to/your/folder` part with a path to the folder which contains all the scripts.