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
            HighscoreChanges,
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

        this.URL_MAP = new Map([
            [/^gym\/?$/, 'inGym'],
            [/^university\/?$/, 'inUniversity'],
            [/^university\/[132]\/?$/, 'inUniversityPage'],
            [/^jail\/?$/, 'inJail'],
            [/^bank\/?$/, 'inBank'],
            [/^expedition/, 'inExpeditions'],
            [/^market/, 'inMarket'],
            [/^supporter\/?$/, 'inSupporter'],
            [/^town\/?$/, 'inTown'],
            [/^town\/estateagent\/?/, 'inEstateAgent'],
            [/^town\/pharmacy\/?$/, 'inPharmacy'],
            [/^town\/club\/?$/, 'inSicarios'],
            [/^town\/mateos\/?$/, 'inMateos'],
            [/^town\/.+\/?$/, 'inTownStore'],
            [/^petshop\/?$/, 'inPetshop'],
            [/^trade\/view/, 'inTradeView'],
            [/^trade\/?$/, 'inTrade'],
            [/^trade\/additems/, 'inAddItems'],
            [/^cartel\/\d+\/?$/, 'inBountyOrOtherCartel'],
            [/^cartel\/?$/, 'inCartel'],
            [/^cartel\/armou?ry\/deposit\/?$/, 'inAddItems'],
            [/^cartel\/armou?ry/, 'inCartelArmory'],
            [/^cartel\/territory\/?$/, 'inCartelWar'],
            [/^cartel\/perks\/?$/, 'inCartelPerks'],
            [/^cartel\/allfights/, 'inAttackLog'],
            [/^events/, 'inEvents'],
            [/^production\/?$/, 'inProduction'],
            [/^jobs\/?$/, 'inJobs'],
            [/^inventory/, 'inInventory'],
            [/^casino\/?$/, 'inCasino'],
            [/^casino\/spinner\/?$/, 'inCasinoSpinner'],
            [/^casino\/blackjack\/?$/, 'inBlackjack'],
            [/^casino\/blackjackstats(\/|\/?\?.+)?/, 'inBlackjackStats'],
            [/^highscores/, 'inHighscores'],
            [/^(home|user)\/?$/, 'inHomepage'],
            [/^user\/\d+\/?$/, 'inUserProfile'],
            [/^user\/stats/, 'inPersonalStats'],
            [/^property\/?$/, 'inProperty'],
            [/^statestimates(\/|(\/\d+\/?)?(\?.+)?)?/, 'inStatEstimate'],
            [/^(advanced)?search/, 'inSearch'],
            [/^bounty/, 'inBountyOrOtherCartel'],
            [/^fight/, 'inFight'],
            [/^connections$/, 'inConnections'],
            [/^forum\/\d+\/\d+|^forum\/thread\/\d+/, 'inForumPost'],
            [/^forum\/\d+/, 'inForumCategory'],
            [/^inbox|^outbox/, 'inMail'],
            [/^settings/, 'inSettings'],
            [/./, 'inAnywhere']
        ]);

        this.STRIKETHROUGH = false; // Display the normally-displayed price as well, striked-through
        this.ALWAYS_COLOR_NAMES = [ "FN SCAR-H", "Desert Eagle", "Full-Body Armour" ];
        this.DAYS = 7; // Number of days of production materials to stock up
        this.darkmode = document.querySelector("html").getAttribute("data-bs-theme") === "dark";
    }

    static getInstance() {
        if (this.instance) return this.instance;

        this.instance = new ConfigManager();
        return this.instance;
    }
}