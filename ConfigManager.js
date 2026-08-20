class ConfigManager {
    static instance;

    constructor() {
        this.MODULES = [
            AddItemButtons,
            AddLinks,
            BankDepositTax,
            BetterItemValues,
            BetterMoneyInputs,
            BetterProgressBars,
            BlackjackHelper,
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
            [/^town\/club\/?$/, 'inSicarios', 'In Scicarios Store'],
            [/^town\/mateos\/?$/, 'inMateos', 'In Mateo\'s Store'],
            [/^town\/.+\/?$/, 'inTownStore', 'In Town Store'],
            [/^petshop\/?$/, 'inPetshop', 'In Pet Store'],
            [/^trade\/view/, 'inTradeView', 'In Trade View'],
            [/^trade\/?$/, 'inTrade', 'In Trade'],
            [/^trade\/additems/, 'inAddItems', 'In Add Items'],
            [/^cartel\/\d+\/?$/, 'inBountyOrOtherCartel', 'In Bounty or Other Cartel'],
            [/^cartel\/?$/, 'inCartel', 'In Own Cartel'],
            [/^cartel\/armou?ry\/deposit\/?$/, 'inAddItems', 'In Add Items of Armory'],
            [/^cartel\/armou?ry/, 'inCartelArmory', 'In Cartel Armory'],
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
        setValue('script', 'settings', updatedSettings);

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