files = [
	"utils.js",
	"AchievementStats.js",
	"AddItemButtons.js",
	"AddLinks.js",
	"BankDepositTax.js",
	"BetterItemValues.js",
	"BetterMoneyInputs.js",
	"BetterProgressBars.js",
	"BlackjackHelper.js",
    "BuyMaxButton.js",
	"BuyPointsLink.js",
	"CartelMemberRep.js",
	"CenterTabs.js",
	"CenterText.js",
	"ColorChatNames.js",
	"ColorStats.js",
	"DisableThrow.js",
	"DisplayPerks.js",
	"DisplayTownCaches.js",
	"DPEnergyRefillReminder.js",
	"EstateLevelInfo.js",
	"EstimatedIntGains.js",
	"ExpeditionChances.js",
	"GreenMoney.js",
	"HighlightExcessHealth.js",
	"HighlightInactives.js",
	"HighlightUnequipped.js",
    'HospTimeEstimate.js',
	"IntPerWeek.js",
	"ItemCache.js",
	"LargerGymGraph.js",
	"PropertyPageAgentLink.js",
	"RoundedCards.js",
	"ScriptSettings.js",
	"StatEstimate.js",
	"TotalListingValue.js",
	"TransparentChats.js",
	"TrueKDR.js",
	"ConfigManager.js",
	"MegaScript.js"
]

joined_file_name = 'MegaScriptBundled.js'

# read files into a temporary string
result = ''
for file in files:
    with open(file, mode='r', encoding='UTF-8') as f:
        result += f.read()
        f.close()
    result += '\n\n'

with open(joined_file_name, mode='+w', encoding='UTF-8') as f:
    f.write(result)
    f.close()

print('Finished file joining')