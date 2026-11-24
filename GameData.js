class Item {
    /** @type {string} Internal ID of the item*/
	#id;

	/** @type {string} Name of the item*/
	#name;

    /** @type {string} Item description as given in the api*/
	#description;

	/** @type {string} Item effect as given in the api*/
	#effect;

	/** @type {string} Type of the item*/
	#type;

	/** @type {number} Default price of the item*/
	#value;

    /** @type {string} Hover value of the Use' button in the inventory in CE*/
	#action;

	/** @type {number} ImageURL of the item*/
	#imageURL;

	constructor(id, name, description, effect, type, value, action, imageURL, extra) {
        this.#id = id;
        this.#name = name;
        this.#description = description;
        this.#effect = effect;
        this.#type = type;
        this.#value = value;
        this.#action = action;
        this.#imageURL = imageURL;

        if (extra) {
            // Set additional attributes for some items (e.g. drug CD for coke)
            for (const [key, value] of Object.entries(extra)) {
                this[key] = value;
            }
        }

	}

    get id() {
        return this.#id;
    }
    get name() {
		return this.#name;
	}
	get description() {
		return this.#description;
	}
    get effect() {
		return this.#effect;
	}
    get type() {
		return this.#type;
	}
    get value() {
        return this.#value;
    }
    get action() {
		return this.#action;
	}
	get imageURL() {
		return this.#imageURL;
	}

    set id(value) {
        this.#id = value;
    }
    set name(value) {
		this.#name = value;
	}
	set description(value) {
		this.#description = value;
	}
    set effect(value) {
		this.#effect = value;
	}
    set type(value) {
		this.#type = value;
	}
    set value(value) {
        this.#value = value;
    }
    set action(value) {
		this.#action = value;
	}
	set imageURL(value) {
		this.#imageURL = value;
	}
}

class Job {
    name;
    group;
    duration;
    avg_rep;
    avg_money;
    item_rewards;

    constructor(name, group, duration, avg_money, avg_rep, item_rewards) {
        this.name = name;
        this.group = group;
        this.duration = duration;
        this.avg_money = avg_money;
        this.avg_rep = avg_rep;
        this.item_rewards = item_rewards;
    }
}

/**
 * Class to hold formulas and default values of the game.
 * Acts as a single source of truth for these values.
 */
class GameData {

    constructor() {}

    static ITEMS = new Map([
        ['mini_supporter_pack', new Item(1, 'Mini-Supporter Pack', 'This miniature Supporter Pack is a special item awarded to Angels friends. It grants 3 days of Supporter status, granting various benefits. Check out the Supporter page for all the details!', 'Adds 3 days of Supporter status', 'Special', 0, 'Use', 'https://cartelempire.online/images/items/1.png')],
        ['supporter_pack', new Item(2, 'Supporter Pack', 'The Supporter Pack is a special item that grants the player 31 days of Supporter status and 50 Points. With this status, players gain access to a variety of bonuses and perks. By purchasing the Supporter Pack, players support the development and maintenance of the game. Whether you\'re a new player or a seasoned veteran, it\'s a valuable investment that unlocks a world of possibilities.', 'Adds 31 days of Supporter status and 50 Points', 'Special', 9500000, 'Use', 'https://cartelempire.online/images/items/2.png')],
        ['personal_favour', new Item(3, 'Personal Favour', 'The Personal Favour is granted to players by El Capo, the boss of bosses. It\'s a valuable asset that can be used to get a narco out of jail when they find themselves in a tight spot with the law. With this favour, narcos bypass the usual legal processes and secure their freedom with just a single phone call to El Capo.', 'Releases you from Jail', 'Special', 1099453, 'Use', 'https://cartelempire.online/images/items/3.png')],
        ['corana', new Item(100, 'Corana Beer', 'Often served with a wedge of lime, what better way to take the edge of a hard day of crime than by sitting down to a cool Corana Beer. Provides a minor boost to energy.', 'Increases energy by 5. Increases Booster cooldown by 2 hours', 'Alcohol', 188676, 'Drink', 'https://cartelempire.online/images/items/100.png', {energyBoost: 5})],
        ['mexcal', new Item(101, 'Mexcal Beer', 'One of the most common beers in the region. A unique bitterness gives it it\'s destinctive flavour. Fun for all the \'family\'! Provides a minor boost to energy.', 'Increases energy by 10. Increases Booster cooldown by 2 hours', 'Alcohol', 519141, 'Drink', 'https://cartelempire.online/images/items/101.png', {energyBoost: 10})],
        ['blancoda', new Item(102, 'Blancoda Tequila', 'When lifes got you down and the boss is riding your back, a glass of Blancoda Tequila is all you need. Provides a small energy boost.', 'Increases energy by 15. Increases Booster cooldown by 2 hours', 'Alcohol', 1075357, 'Drink', 'https://cartelempire.online/images/items/102.png', {energyBoost: 15})],
        ['repose', new Item(103, 'Repose Tequila', 'Repose is aged for 12 months to give it a complex taste with a subtle balance of agave and wood aromas or so the bottle says... Provides a large boost to energy.', 'Increases energy by 20. Increases Booster cooldown by 2 hours', 'Alcohol', 2991265, 'Drink', 'https://cartelempire.online/images/items/103.png', {energyBoost: 20})],
        ['anejo', new Item(104, 'Anejo Tequila', 'Strong enough to strip the guilt of your crimes, only the finest Narco\'s can afford Anejo Tequila! Provides a very large boost to energy.', 'Increases energy by 25. Increases Booster cooldown by 2 hours', 'Alcohol', 5830203, 'Drink', 'https://cartelempire.online/images/items/104.png', {energyBoost: 25})],
        ['raicilla', new Item(105, 'Raicilla', 'Produced by only the wildest of back-mountain "rusticos". This Raicilla is as likely to turn you blind as it is to lead you into the wrong back alley. Provides a massive boost to energy.', 'Increases energy by 30. Increases Booster cooldown by 2 hours', 'Alcohol', 14289143, 'Drink', 'https://cartelempire.online/images/items/105.png', {energyBoost: 30})],
        ['bandage', new Item(200, 'Bandage', 'The Bandage is a basic first aid item that provides a small amount of life when used. Made of sterile gauze and adhesive tape, this item can be used to cover and protect small cuts and scrapes, or to stop bleeding from larger wounds.', 'Restores 5% of Life. Increases Medical cooldown by 10 minutes and reduces Hospital timer by 10 minutes.', 'Medical', 5202, 'Use', 'https://cartelempire.online/images/items/200.png', {hospitalReduction: 600})],
        ['small_med_kit', new Item(201, 'Small Medical Kit', 'The Small Medical Kit is a comprehensive first aid item that provides a minor amount of life when used. This kit includes a variety of medical supplies, such as antiseptics, bandages, painkillers, and other essential items, all packed into a compact and portable case.', 'Restores 10% of Life. Increases Medical cooldown by 15 minutes and reduces Hospital timer by 15 minutes.', 'Medical', 10000, 'Use', 'https://cartelempire.online/images/items/201.png', {hospitalReduction: 900})],
        ['large_med_kit', new Item(202, 'Large Medical Kit', 'The Large Medical Kit is an advanced first aid item that provides a significant amount of healing to the player when used. This kit includes a wide range of medical supplies, including advanced bandages, antibiotics, painkillers, and other essential items, all packed into a durable and sturdy case.', 'Restores 15% of Life. Increases Medical cooldown by 60 minutes and reduces Hospital timer by 60 minutes.', 'Medical', 76114, 'Use', 'https://cartelempire.online/images/items/202.png', {hospitalReduction: 3600})],
        ['basic_trauma_kit', new Item(203, 'Basic Trauma Kit', 'The Basic Trauma Kit is designed specifically to help individuals recover from bullet wounds and other serious injuries sustained in combat. This kit includes a wide range of cutting-edge medical supplies for stabilising people in the field.', 'Restores 20% of Life. Increases Medical cooldown by 80 minutes and reduces Hospital timer by 80 minutes.', 'Medical', 30000, 'Use', 'https://cartelempire.online/images/items/203.png', {hospitalReduction: 4800})],
        ['large_trauma_kit', new Item(204, 'Large Trauma Kit', 'The Large Trauma Kit is an advanced first aid item designed to help individuals recover from serious injuries sustained in combat or other dangerous situations. This kit includes cutting-edge medical supplies, including specialized bandages, advanced painkillers, hemostatic agents, and other essential items.', 'Restores 30% of Life. Increases Medical cooldown by 120 minutes and reduces Hospital timer by 120 minutes.', 'Medical', 50000, 'Use', 'https://cartelempire.online/images/items/204.png', {hospitalReduction: 7200})],
        ['tainted_cocaine', new Item(210, 'Tainted Cocaine', 'Unsuspecting users, beware! Inside its seemingly innocent packaging lies an unexpected twist – a dark secret that sends shockwaves through the Cartel community. At some point in the clandestine production process, a grave error was made, or perhaps a cunning rival Cartel seized the opportunity to spike the product. Regardless of its origins, this Tainted Cocaine will make your worst nightmares a reality.', 'Reduces Life to 0 and sends you to Hospital for up to 2 hour. Increases Medical cooldown by 3 hours.', 'Medical', 108549, 'Take', 'https://cartelempire.online/images/items/210.png')],
        ['tainted_cannabis', new Item(211, 'Tainted Cannabis', 'Feast your eyes on this freaky foliage, a concoction so tainted it practically has its own horror story. With a putrid green hue and white specks of what you suspect are mold, this bud will have you questioning your life choices faster than you can say "Holy Guacamole!"  Warning: Consuming will result in a series of misadventures you\'ll never forget (or maybe you\'ll forget some of them, who knows?). As the mold takes hold and your vision blurs, you\'ll find yourself stumbling through a psychedelic nightmare, unsure of what\'s real and what\'s just your imagination running wild.', 'Reduces Life to 0 and sends you to Hospital for up to 30 minutes. Increases Medical cooldown by 1 hour.', 'Medical', 78014, 'Take', 'https://cartelempire.online/images/items/211.png')],
        ['cannabis', new Item(300, 'Cannabis', 'Grown with love and expertise by only the most discerning narcos, carefully crafted to harmonize and create a delightful symphony of flavor and effect. With every toke, the grind softens — jobs finish a little sooner, though you might get a bit too mellow to stay sharp.', 'Shaves 15 minutes off your current Job timer (if active). Adds +10% Job fail chance for 15 minutes; each dose stacks the fail chance and extends the remaining duration. Increases Drug cooldown by 30 minutes. Possible overdose: -10% all Combat Stats and 30 minutes in Hospital.', 'Drug', 2093, 'Take', 'https://cartelempire.online/images/items/300.png')],
        ['cocaine', new Item(301, 'Cocaine', 'Unlike the shadows of tainted competitors, this cocaine embodies purity – a potent source of untamed energy, and unparalleled confidence. Time itself seems to bow to your will, granting you control over the universe and its secrets.  Cocaine serves as both reward and temptation, a double-edged sword that can either elevate you to greatness or lead you down a treacherous path to Hospital and reduced Combat Stats.', 'Increases Energy by 50. Increases drug cooldown by 3 hours. Possible overdose effect of -20% all Combat Stats', 'Drug', 133105, 'Take', 'https://cartelempire.online/images/items/301.png', {cooldown: 10800, odChance: 0.01})],
        ['rage_injector', new Item(302, 'Rage Injector', 'A street-cooked stimulant that floods the system with aggression. Strength surges — until it doesn\'t.', 'Increases Strength by 60% and grants 10% haymaker chance (double damage, bypasses armour) for 15 minutes. Increases Drug cooldown by 60 minutes. Possible overdose: -10% all Combat Stats and 6 hours in Hospital.', 'Drug', 80000, 'Take', 'https://cartelempire.online/images/items/302.png')],
        ['spring_serum', new Item(303, 'Sprint Serum', 'Thin amber fluid that sharpens reflexes and footwork. Popular with runners who need to not get caught.', 'Increases Agility by 50% for 15 minutes. Increases Drug cooldown by 60 minutes. Possible overdose: -10% all Combat Stats and 6 hours in Hospital.', 'Drug', 80000, 'Take', 'https://cartelempire.online/images/items/303.png')],
        ['focus_stimulant', new Item(304, 'Focus Stimulant', 'Keeps the sights steady and the hands calm. Marksmen swear by it; medics quietly stock it.', 'Increases Accuracy by 60% and grants 10% glancing blow chance (guaranteed hit for 30–60% damage) for 15 minutes. Increases Drug cooldown by 60 minutes. Possible overdose: -10% all Combat Stats and 6 hours in Hospital.', 'Drug', 80000, 'Take', 'https://cartelempire.online/images/items/304.png')],
        ['adrenaline_shot', new Item(305, 'Adrenaline Shot', 'All gas, no brakes. Blinding speed that leaves you wide open — exactly how some narcos prefer to fight.', 'Increases Agility by 80% and decreases Defence by 50% for 15 minutes. Increases Drug cooldown by 60 minutes. Possible overdose: -20% all Combat Stats and 6 hours in Hospital.', 'Drug', 120000, 'Take', 'https://cartelempire.online/images/items/305.png')],
        ['combat_stim', new Item(306, 'Combat Stim', 'War-day cocktail. Everything hits harder and lasts longer — at the cost of burning more Energy every attack.', 'Increases all Combat Stats by 50% and Attack Energy cost by 5 for 6 hours. Increases Drug cooldown by 12 hours. Possible overdose: -20% all Combat Stats and 6 hours in Hospital.', 'Drug', 500000, 'Take', 'https://cartelempire.online/images/items/306.png')],
        ['painkillers', new Item(307, 'Painkillers', 'Blunts the pain. Most hits sting less — and sometimes you barely feel them at all.', 'Reduces incoming damage by 10% and grants a 30% chance to reduce a hit to 1 damage for 15 minutes. Re-using extends duration (effects do not stack). Increases Drug cooldown by 60 minutes. Possible overdose: -15% all Combat Stats and 6 hours in Hospital. Overall damage reduction soft-caps at 50% with other sources.', 'Drug', 80000, 'Take', 'https://cartelempire.online/images/items/307.png')],
        ['hustle_pills', new Item(308, 'Hustle Pills', 'Shift fuel for the grind. Success, payouts, and experience come easier while your combat edge dulls for the rest of the day.', 'Increases Job success rate, Job rewards (including robbery supply items), and Job experience by 25% and decreases all Combat Stats by 20% for 6 hours. Increases Drug cooldown by 12 hours. Possible overdose: -20% Job success and 6 hours in Hospital.', 'Drug', 416160, 'Take', 'https://cartelempire.online/images/items/308.png')],
        ['adderall', new Item(309, 'Adderall', 'Pharmacy-grade focus tabs. Sharpens University study — while the shared Drug cooldown ticks up.', 'Increases Intelligence gains from University study by 60% for 15 minutes. Increases Drug cooldown by 6 hours.', 'Drug', 150000, 'Take', 'https://cartelempire.online/images/items/309.png')],
        ['defibrillator', new Item(310, 'Defibrillator', 'A portable defibrillator pack. Keeps your hands steady when every percent of revive chance counts.', 'Increases revive success chance by 30% for 15 minutes. Uses Medical cooldown (60 minutes).', 'Medical', 250000, 'Use', 'https://cartelempire.online/images/items/310.png')],
        ['narcan', new Item(311, 'Narcan', 'Emergency OD countermeasure from the back shelf. Blunts an active overdose and shaves time off the recovery clock.', 'With an active Overdose: removes 30% of Overdose debuff strength and 30% of remaining Overdose / Drug cooldown. Without an Overdose: still uses the item and Medical cooldown, but has no OD/Drug effect. Uses Medical cooldown (6 hours).', 'Medical', 200000, 'Use', 'https://cartelempire.online/images/items/311.png')],
        ['bulwark_shot', new Item(312, 'Bulwark Shot', 'A thick, metallic-tasting dose that hardens the body against impact. You feel heavier — and harder to drop.', 'Increases Defence by 50% for 15 minutes. Increases Drug cooldown by 60 minutes. Possible overdose: -10% all Combat Stats and 6 hours in Hospital.', 'Drug', 80000, 'Take', 'https://cartelempire.online/images/items/312.png')],
        ['fertiliser', new Item(400, 'Bag of Fertiliser', 'Fertiliser is a supply item for Weed Farms, without a steady supply of fertiliser even the best managed farms will barely produce.', 'Used by Weed Farm production building.', 'Production Supply', 161326, null, 'https://cartelempire.online/images/items/400.png')],
        ['agave', new Item(401, 'Agave Heart', 'Agave Hearts are an essential ingredient for crafting the region\'s famous tequila. Without a steady supply of these precious hearts, even the most well-managed alcohol stills will struggle to produce quality tequila.', 'Used by Alcohol Still production building.', 'Production Supply', 351996, null, 'https://cartelempire.online/images/items/401.png')],
        ['paste', new Item(402, 'Coca Paste', 'This highly sought-after paste is carefully extracted from the leaves of the coca plant, using a complex process that requires expert knowledge and specialized equipment. With its potent blend of active compounds, Coca Paste is the key to creating a superior quality cocaine product.', 'Used by Cocaine Factory production building.', 'Production Supply', 207748, null, 'https://cartelempire.online/images/items/402.png')],
        ['dog_food', new Item(501, 'Dog Food', 'Developed by Victor himself, this recipe features a unique blend of \'mystery meat\' and the finest grains, selected for their nutritional value and flavor. With no artificial additives or preservatives, you can rest assured that your furry friend is getting the very best in natural, wholesome nutrition.', 'Used to feed owned Dogs to increase loyalty each day', 'Food', 5000, null, 'https://cartelempire.online/images/items/501.png')],
        ['black_market_treat', new Item(502, 'Black Market Treat', 'This not-so-ordinary Dog treat is infused with a secret mixture of chemicals that promises to change how your Dogs brain is wired, shuffling their potential Trait like a deck of cards. The results may be somewhat unpredictable.', 'Changes a Dogs Trait', 'Food', 50000, 'Feed', 'https://cartelempire.online/images/items/502.png')],
        ['stree_quality_enhancement', new Item(600, 'Street-Quality Enhancement', 'A worn, grimy folder stuffed with hand-drawn diagrams, greasy notes, and improvised tools like wire, duct tape, and salvaged circuit parts. The documents hint of desperation and ingenuity.', 'Used in the Enhancement of Weapons and Armour', 'Enhancement', 74614, null, 'https://cartelempire.online/images/items/600.png')],
        ['syndicate_issued_enhancement', new Item(601, 'Syndicate-Issued Enhancement', 'A sleek, matte-black briefcase opens to reveal professionally printed schematics headed with the emblem of the Syndicate, one of Bolivias leading Shadow Cartels. Contains cleanly labeled upgrade components, and polished metallic tools, high-end microchips, laser-cut armor plating diagrams, and assosrtments of other minor miscellanea.', 'Used in the Enhancement of Weapons and Armour', 'Enhancement', 221085, null, 'https://cartelempire.online/images/items/601.png')],
        ['blacksite_prototype_enhancement', new Item(602, 'Blacksite Prototype Enhancement', 'A secure, high-tech case opensto reveal classified documents stamped with an obscure government logo you\'re unfamiliar with. Contains next-gen looking weapon & armour upgrade schematics, experimental nanotech vials, and encrypted data chips among other high-tech components.', 'Used in the Enhancement of Weapons and Armour', 'Enhancement', 1869958, null, 'https://cartelempire.online/images/items/602.png')],
        ['velvet', new Item(700, 'Velvet Mystery Gift', 'A small, square package enveloped in rich, deep-red velvet fabric, secured with a satin ribbon and a golden locket.', 'Increases Current Life up to 3x your normal Maximum Life. Increases Medical cooldown by 3 hours.', 'Special', 0, 'Open', 'https://cartelempire.online/images/items/700.png')],
        ['green_surprise_gift', new Item(701, 'Green Surprise Gift', 'A soft, plush package in cash green, complete with a giant, pastel-hued bow and a scent of freshly printed fake notes.', 'Contains between £50,000 to £500,000 in cash when opened.', 'Special', 0, 'Open', 'https://cartelempire.online/images/items/701.png')],
        ['glittering_gift', new Item(702, 'Glittering Gift', 'A medium-sized box wrapped in silver and gold paper, adorned with sparkling ribbons and a metallic bow.', 'Increases Energy by 100. Increases drug cooldown by 6 hours.', 'Drug', 0, 'Open', 'https://cartelempire.online/images/items/702.png'), {energyBoost: 100}],
        ['rustic_charm_gift', new Item(703, 'Rustic Charm Gift', 'A charming, eco-friendly gift wrapped in recycled brown paper, tied with twine, and adorned with a small sprig of fresh pine.', 'Removes any existing negative side-effects of Drug use such as BattleStat reduction. Does not remove OD effect.', 'Special', 0, 'Open', 'https://cartelempire.online/images/items/703.png')],
        ['golden_treasure_gift', new Item(704, 'Golden Treasure Gift', 'A luxurious, golden-wrapped box, adorned with ornate patterns and a regal, jewel-encrusted brooch.', 'Adds 3 days of Donator Status and 25 Points for Normal and Donators. Adds 50 Points for Subscribers.', 'Special', 0, 'Open', 'https://cartelempire.online/images/items/704.png')],
        ['weapons_n_armor_specialist_contact', new Item(801, 'Weapons & Armor Specialist Contact', 'This is the necessary contact information to hire a weapon/armor specialist for a single smuggling run.', null, 'Smuggling Enhancement', 5000000, null, 'https://cartelempire.online/images/items/801.png')],
        ['alcohol_specialist_contact', new Item(802, 'Alcohol Specialist Contact', 'This is the necessary contact information to hire an alcohol specialist for a single smuggling run.', null, 'Smuggling Enhancement', 5000000, null, 'https://cartelempire.online/images/items/802.png')],
        ['tech_specialist_contact', new Item(803, 'Tech Specialist Contact', 'This is the necessary contact information to hire a tech specialist for a single smuggling run.', null, 'Smuggling Enhancement', 5000000, null, 'https://cartelempire.online/images/items/803.png')],
        ['leadership_specialist_contact', new Item(804, 'Leadership Specialist Contact', 'This is the necessary contact information to hire a leadership specialist for a single smuggling run.', null, 'Smuggling Enhancement', 5000000, null, 'https://cartelempire.online/images/items/804.png')],
        ['ak_47', new Item(1000, 'AK-47', 'Developed in the Soviet Union by Russian small-arms designed Mikhail Kalashnikov, the AK-47 is one of the most popular and widely-used rifles in the world.', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 60', 'Weapon', 10000, 'Equip', 'https://cartelempire.online/images/items/1000.png')],
        ['m16a2', new Item(1001, 'M16A2 Rifle', 'Developed in America, the M16A2 has also been widely adopted by armed forces around the world for its reliability and accuracy.', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 75', 'Weapon', 13265, 'Equip', 'https://cartelempire.online/images/items/1001.png')],
        ['g36', new Item(1002, 'G36', 'The G36 lacks any fancy bells or whistles, but thanks to its world-renowned German engineering, it makes that up by being a rugged and modern yet lightweight and accurate weapon.', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 700', 'Weapon', 1908821, 'Equip', 'https://cartelempire.online/images/items/1002.png')],
        ['steyr_aug', new Item(1003, 'Steyr AUG', 'The Steyr Aug is an Austrian assault rifle with a signature look. Lightweight and reliable, it\'s a favourite of armies around the world due to its modular nature. It\'s also great for lefties!', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 1200', 'Weapon', 4500000, 'Equip', 'https://cartelempire.online/images/items/1003.png')],
        ['sig_sg_550', new Item(1004, 'SIG SG 550', 'Accurate and reliable as a Swiss watch, the SIG SG 550 is used by elite and special forces units across the world. It\'s known as one of the finest 5.56mm assault rifles ever made.', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 1400', 'Weapon', 7500000, 'Equip', 'https://cartelempire.online/images/items/1004.png')],
        ['fn_scar_h', new Item(1005, 'FN SCAR-H', 'Designed by Belgium for use by the US Special Operations Command, the FN SCAR-H is highly customisable for any purpose.', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 1750', 'Weapon', 17380154, 'Equip', 'https://cartelempire.online/images/items/1005.png')],
        ['bat', new Item(1100, 'Baseball Bat', 'This ain\'t no ordinary baseball bat, it\'s a real \'wise guy\' in the world of blunt force weapons. Made from the finest hardwood and with a weight that packs a punch, this bat is the perfect accessory for any budding Narco.', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 10', 'Weapon', 300, 'Equip', 'https://cartelempire.online/images/items/1100.png')],
        ['walther', new Item(1101, 'Walther P38', 'The Walther P38 is a semi-automatic pistol that was developed by Carl Walther as the service pistol of the Wehrmacht at the beginning of World War II. It\'s not going to turn any heads in the Cartel, but it\'ll do the job.', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 20', 'Weapon', 2000, 'Equip', 'https://cartelempire.online/images/items/1101.png')],
        ['m1911', new Item(1102, 'M1911', 'The M1911, produced by Colt, was the standard sidearm of the U.S. military from 1911 to 1985, marking one of the longest periods of of use for a standard weapon. The M1911 was used by U.S. soldiers in World War I, World War II, the Korean War, and the Vietnam War.', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 100', 'Weapon', 12500, 'Equip', 'https://cartelempire.online/images/items/1102.png')],
        ['magnum_revolver', new Item(1103, 'S&W Magnum Revolver', 'The S&W Magnum is renowned as one of the most powerful mass-produced revolvers in the world. As the name suggests, this firearm was designed by Smith & Wesson.', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 200', 'Weapon', 100000, 'Equip', 'https://cartelempire.online/images/items/1103.png')],
        ['glock', new Item(1104, 'Glock 18', 'As a true fully-automatic pistol, the G18 is one of the most specialized Glock models. With an external fire selector at the read of the slide, you can switch from semi-automatic to full-firing mode. It comes with an extended 19 round magazine for extra stopping power.', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 500', 'Weapon', 500000, 'Equip', 'https://cartelempire.online/images/items/1104.png')],
        ['desert_eagle', new Item(1105, 'Desert Eagle', 'The fact is, you\'ll never feel more confident than when you have this shiny, silver cannon in your pocket. When you\'ve got \'Desert Eagle point Five O\' written down the side, what else do you need?', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 1500', 'Weapon', 11423077, 'Equip', 'https://cartelempire.online/images/items/1105.png')],
        ['bazooka', new Item(1106, 'Bazooka', 'A Bazooka, with the name "Dan" scribbled on the side. Shoots incredibly powerful rockets because sometimes, diplomacy just isn\'t loud enough.', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 1500', 'Weapon', 25000000, 'Equip', 'https://cartelempire.online/images/items/1106.png')],
        ['covert_stab_vest', new Item(1200, 'Covert Stab Vest', 'A Covert Stab Vest lets you feel some protection without being too bulky.', 'Can be equipped to self to increase Defence, or assigned to Sicarios to increase their Caution by 20', 'Armour', 5000, 'Equip', 'https://cartelempire.online/images/items/1200.png')],
        ['ballistic_vest', new Item(1201, 'Ballistic Vest', 'Designed to reduce the impact of small-arms fire, the Ballistic Vest is a favourite with narcos for its fairly low price and high performance.', 'Can be equipped to self to increase Defence, or assigned to Sicarios to increase their Caution by 40', 'Armour', 10000, 'Equip', 'https://cartelempire.online/images/items/1201.png')],
        ['tactical_plate_armour', new Item(1202, 'Tactical Plate Armour', 'You can\'t go wrong with this well built tactical vest with solid steel plating built right in.', 'Can be equipped to self to increase Defence, or assigned to Sicarios to increase their Caution by 850', 'Armour', 2694577, 'Equip', 'https://cartelempire.online/images/items/1202.png')],
        ['full_body_armour', new Item(1203, 'Full-Body Armour', 'For the ultimate protective armour, look no further than this Full-Body Armour. Used by the country\'s elite response unit, it offers major protection."', 'Can be equipped to self to increase Defence, or assigned to Sicarios to increase their Caution by 1700', 'Armour', 6763507, 'Equip', 'https://cartelempire.online/images/items/1203.png')],
        ['trench_coat', new Item(1204, 'Trench Coat', 'A stylish and functional trench coat with hidden ballistic protection, suitable for discreet urban encounters.', 'Can be equipped to self to increase Defence, or assigned to Sicarios to increase their Caution by 10', 'Armour', 4000, 'Equip', 'https://cartelempire.online/images/items/1204.png')],
        ['kevlar_weave_vest', new Item(1205, 'Kevlar Weave Vest', 'Utilizing Kevlar technology for lightweight and flexible protection against ballistic threats.', 'Can be equipped to self to increase Defence, or assigned to Sicarios to increase their Caution by 60', 'Armour', 25000, 'Equip', 'https://cartelempire.online/images/items/1205.png')],
        ['carbon_fiber_vest', new Item(1206, 'Carbon Fiber Vest', 'Lightweight and durable, offering protection against small arms fire and shrapnel.', 'Can be equipped to self to increase Defence, or assigned to Sicarios to increase their Caution by 75', 'Armour', 40000, 'Equip', 'https://cartelempire.online/images/items/1206.png')],
        ['armoured_suit', new Item(1207, 'Armoured Suit', 'Seamlessly blends sophistication with unstoppable lethality for those who prefer their style to be as bulletproof as their resolve.', 'Can be equipped to self to increase Defence, or assigned to Sicarios to increase their Caution by 100', 'Armour', 50000, 'Equip', 'https://cartelempire.online/images/items/1207.png')],
        ['ceramic_plate_carrier_vest', new Item(1208, 'Ceramic Plate Carrier Vest', 'Plates made from advanced ceramics to provide excellent protection against armor-piercing rounds without sacrificing mobility.', 'Can be equipped to self to increase Defence, or assigned to Sicarios to increase their Caution by 300', 'Armour', 257296, 'Equip', 'https://cartelempire.online/images/items/1208.png')],
        ['riot_suit', new Item(1209, 'Riot Suit', 'Riot gear with carbon fiber reinforcements for increased durability and protection against blunt force trauma.', 'Can be equipped to self to increase Defence, or assigned to Sicarios to increase their Caution by 600', 'Armour', 597305, 'Equip', 'https://cartelempire.online/images/items/1209.png')],
        ['blast_suit', new Item(1210, 'Blast Suit', 'Designed to mitigate the impact of explosive blasts, with reinforced padding and shock-absorbing materials.', 'Can be equipped to self to increase Defence, or assigned to Sicarios to increase their Caution by 1000', 'Armour', 1000000, 'Equip', 'https://cartelempire.online/images/items/1210.png')],
        ['new_age_combat_fatigues', new Item(1211, 'New-Age Combat Fatigues', 'Although they look thin and somewhat low-quality, you\'ve been guaranteed that they\'ll stop a shotgun blast at mid-range.', 'Can be equipped to self to increase Defence, or assigned to Sicarios to increase their Caution by 1200', 'Armour', 1500000, 'Equip', 'https://cartelempire.online/images/items/1211.png')],
        ['mg34', new Item(1500, 'MG34', 'The MG34 is a German recoil-operated LMG. Although it was arguably one of the most advanced in its time, this particular model is definitely starting to show its age. Spray and pray, boys, spray and pray.', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 300', 'Weapon', 1526923, 'Equip', 'https://cartelempire.online/images/items/1500.png')],
        ['l86_lsw', new Item(1501, 'L86 LSW', 'In 1970, the British Army began to develop its next generation of infantry small arms. The result of this was the L86 LSW.', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 1000', 'Weapon', 2000000, 'Equip', 'https://cartelempire.online/images/items/1501.png')],
        ['mg5', new Item(1502, 'MG5', 'The modern, modular Bundeswehr LMG was made by Heckler & Koch and used primarily by German forces. This model includes a cast-steel exterior and a variable cyclic rate.', 'Can be equipped to self to increase Damage, or assigned to Sicarios to increase their Combat by 1600', 'Weapon', 9000000, 'Equip', 'https://cartelempire.online/images/items/1502.png')],
        ['frag_grenade', new Item(1600, 'Fragmentation Grenade', 'Used primarily for infantry combat and tactical engagements, the fragmentation grenade inflicts devastating injuries to enemies unlucky enough to be caught in its blast radius. Its effectiveness lies in its ability to strike adversaries in cover or behind obstacles, making it a formidable tool for clearing entrenched positions.', 'Causes a large amount of damage to the target, low accuracy', 'Thrown', 134510, 'Equip', 'https://cartelempire.online/images/items/1600.png')],
        ['flash_grenade', new Item(1601, 'Flash Bang Grenade', 'When activated, the flash bang grenade emits a brilliant, blinding flash of light, accompanied by a thunderous bang, shocking and overwhelming the senses of those within its vicinity. This intense burst of light and sound disrupts communication, balance, and coordination, rendering targets momentarily dazed and disoriented.', 'Reduces an opponents Accuracy by 1/6th for up to 3 minutes', 'Thrown', 7500, 'Equip', 'https://cartelempire.online/images/items/1601.png')],
        ['illuminating_grenade', new Item(1602, 'Illuminating Grenade', 'The illuminating grenade, a tactical lighting device, serves a unique role. This hand-thrown illumination tool is designed to provide a potent source of light, illuminating large areas with a powerful and sustained glow. As it reaches its peak height or hovers above the ground, it begins to emit a brilliant, steady light that can rival moonlight, effectively transforming the area below into a well-illuminated zone.', 'Reduces an opponents Agility by 1/6th for up to 3 minutes', 'Thrown', 103640, 'Equip', 'https://cartelempire.online/images/items/1602.png')],
        ['tear_grenade', new Item(1603, 'Tear Gas Grenade', 'The primary purpose of the tear gas grenade is to disperse crowds, quell riots, and regain control of situations where peaceful means have failed or where public safety is at risk. Law enforcement and military personnel often use tear gas grenades to establish a buffer zone between law enforcement and protestors, allowing for de-escalation and preventing direct confrontations.', 'Reduces an opponents Defence by 1/6th for up to 3 minutes', 'Thrown', 7500, 'Equip', 'https://cartelempire.online/images/items/1603.png')],
        ['stun_grenade', new Item(1604, 'Stun Grenade', 'When deployed, the stun grenade expels a combination of bright flashes of light and a deafening noise, creating a sudden and overwhelming sensory overload for those within its vicinity. The blinding flash of light temporarily impairs vision, while the deafening noise disrupts auditory perception, rendering targets momentarily disoriented and stunned.', 'Reduces an opponents Strength by 1/6th for up to 3 minutes', 'Thrown', 114625, 'Equip', 'https://cartelempire.online/images/items/1604.png')],
        ['nails', new Item(2000, 'Nails', 'Essential for securing and fastening materials in construction and woodworking projects', 'Used in Property construction/upgrades', 'Construction', 517451, null, 'https://cartelempire.online/images/items/2000.png')],
        ['bricks', new Item(2001, 'Bricks', 'Used for building sturdy and durable walls.', 'Used in Property construction/upgrades', 'Construction', 209887, null, 'https://cartelempire.online/images/items/2001.png')],
        ['concrete', new Item(2002, 'Concrete Bags', ' A fundamental building material for foundations, walls, and floors, offering strength and durability.', 'Used in Property construction/upgrades', 'Construction', 253379, null, 'https://cartelempire.online/images/items/2002.png')],
        ['steel', new Item(2003, 'Steel', 'Used for structural support, including beams and columns, as well as for reinforcing concrete.', 'Used in property construction/upgrades', 'Construction', 491692, null, 'https://cartelempire.online/images/items/2003.png')],
        ['renault', new Item(3000, 'Renault Espace', 'Spacious and ideal for large families or carrying large quantities of product.', 'Increases Sicario Speed by 5', 'Car', 3000, null, 'https://cartelempire.online/images/items/3000.png')],
        ['fiat', new Item(3001, 'Fiat Panda', 'Commonly known as a box on wheels, the Fiat Panda is the epitome of functionality over form.', 'Increases Sicario Speed by 10', 'Car', 4500, null, 'https://cartelempire.online/images/items/3001.png')],
        ['austin', new Item(3002, 'Austin Metro', 'This small British car is a favourite for boy racers and cheap second-hand car enthusiasts', 'Increases Sicario Speed by 15', 'Car', 6500, null, 'https://cartelempire.online/images/items/3002.png')],
        ['peugeot', new Item(3003, 'Peugeot 205 GTI', 'The Peugeot 205 was declared the car of the decade upon release, but in the decades since it has started to show some signs of wear.', 'Increases Sicario Speed by 30', 'Car', 9000, null, 'https://cartelempire.online/images/items/3003.png')],
        ['ford_sierra', new Item(3004, 'Ford Sierra', 'Experience the power and style of the 1980s with the Ford Sierra – a sleek, reliable ride that\'s a perfect blend of performance and classic design!', 'Increases Sicario Speed by 40', 'Car', 20000, null, 'https://cartelempire.online/images/items/3004.png')],
        ['vauxhall', new Item(3005, 'Vauxhall Cavalier', 'An iconic blend of style and reliability. Winner of the European Car of the Year award in 1981.', 'Increases Sicario Speed by 50', 'Car', 201260, null, 'https://cartelempire.online/images/items/3005.png')],
        ['fort_escort', new Item(3006, 'Ford Escort', 'A compact legend renowned for its reliability and affordability. A best-seller, it dominated rally circuits and city streets alike, leaving an indelible mark on automotive history. Your journey, redefined.', 'Increases Sicario Speed by 75', 'Car', 283666, null, 'https://cartelempire.online/images/items/3006.png')],
        ['honda', new Item(3007, 'Honda CRX', 'A sporty icon that seamlessly blends style and efficiency. This compact coupe not only turned heads with its aerodynamic design but also set the standard for fuel efficiency, making it a true trailblazer in its era.', 'Increases Sicario Speed by 100', 'Car', 713688, null, 'https://cartelempire.online/images/items/3007.png')],
        ['saab', new Item(3008, 'Saab 900 Turbo', 'Experience the sophistication and power of the 1980s in the Saab 900 Turbo. A Swedish masterpiece, it combined sleek design with turbocharged performance, defining luxury and innovation on the road.', 'Increases Sicario Speed by 150', 'Car', 924821, null, 'https://cartelempire.online/images/items/3008.png')],
        ['lancia', new Item(3009, 'Lancia Delta Integrale', 'Born for victory, this turbocharged powerhouse dominated World Rally Championships, seamlessly merging performance and precision. Own a piece of racing history with the iconic Delta Integrale.', 'Increases Sicario Speed by 200', 'Car', 1665682, null, 'https://cartelempire.online/images/items/3009.png')],
        ['toyota', new Item(3010, 'Toyota MR2', 'A mid-engine marvel delivering sporty thrills and sleek design. This iconic two-seater redefined driving dynamics, making every journey an exhilarating experience. Embrace the MR2 legacy, where performance meets style.', 'Increases Sicario Speed by 250', 'Car', 375000, null, 'https://cartelempire.online/images/items/3010.png')],
        ['audi', new Item(3011, 'Audi Quattro 1980', 'Embark on a thrilling journey with the Audi Quattro 1980 – a pioneering masterpiece that revolutionized rallying with its innovative all-wheel-drive technology. Unleash the power, conquer any terrain, and experience the pinnacle of performance in this iconic piece of automotive history.', 'Increases Sicario Speed by 350', 'Car', 500000, null, 'https://cartelempire.online/images/items/3011.png')],
        ['ford_capri', new Item(3012, 'Ford Capri 2.8i', 'This sports coupe, known for its muscular design and spirited performance, encapsulates the essence of a bygone era. Own the road with the timeless style and dynamic driving experience of the Capri 2.8i.', 'Increases Sicario Speed by 450', 'Car', 825481, null, 'https://cartelempire.online/images/items/3012.png')],
        ['volkswagen', new Item(3013, 'Volkswagen Golf GTI', 'A hot hatch pioneer, this iconic model blended performance and practicality, setting the standard for spirited driving. Join the legacy of the GTI – where fun meets function on every journey.', 'Increases Sicario Speed by 550', 'Car', 850000, null, 'https://cartelempire.online/images/items/3013.png')],
        ['bmw', new Item(3014, 'BMW M5', 'Born from precision engineering and performance, it seamlessly merged luxury with thrilling power. Own a piece of automotive excellence that defined the era, where sophistication met speed in the BMW M5.', 'Increases Sicario Speed by 600', 'Car', 1000000, null, 'https://cartelempire.online/images/items/3014.png')],
        ['porsche', new Item(3015, 'Porsche 959', 'Unleash the 1980s supercar marvel, the Porsche 959. A technological masterpiece with groundbreaking features, it dominated both on and off-road. Own the legacy of speed, precision, and innovation – where the Porsche 959 redefined the boundaries of automotive excellence.', 'Increases Sicario Speed by 650', 'Car', 1250000, null, 'https://cartelempire.online/images/items/3015.png')],
        ['ferrari', new Item(3016, 'Ferrari F40', 'With its aerodynamic design, lightweight build, and a roaring twin-turbo V8 engine, the F40 redefined supercars. Carbon fiber components, pop-up headlights, and a top speed of over 200 mph make it an enduring icon of automotive excellence.', 'Increases Sicario Speed by 700', 'Car', 2013951, null, 'https://cartelempire.online/images/items/3016.png')],
        ['lamborghini', new Item(3017, 'Lamborghini Countach', 'Its unmistakable wedge-shaped design, scissor doors, and a roaring V12 engine create an unparalleled visual and auditory spectacle. A true poster car, the Countach remains an enduring symbol of avant-garde automotive artistry.', 'Increases Sicario Speed by 750', 'Car', 4075321, null, 'https://cartelempire.online/images/items/3017.png')],
        ['diablo_tattoo', new Item(4000, 'Diablo Tattoo', 'The Diablo Tattoo is an exclusive and revered insignia bestowed upon new Sicarios. The Diablo Tattoo is strategically placed on the forearm, ensuring its visibility and serving as a constant reminder of the Sicario\'s allegiance to the cartel\'s cause.', 'Increases Sicario Morale by 10', 'Luxury', 3500, null, 'https://cartelempire.online/images/items/4000.png')],
        ['italian_shoes', new Item(4001, 'Italian Shoes', 'Lusso Strada Italiana Shoes, meticulously handcrafted for the true connoisseurs of style within the cartel, stand as an epitome of luxury and refinement. The distinctive hallmark of Lusso Strada Italiana Shoes is the cartel insignia discreetly embossed on the sole.', 'Increases Sicario Morale by 20', 'Luxury', 4000, null, 'https://cartelempire.online/images/items/4001.png')],
        ['cuban_cigar', new Item(4002, 'Cuban Cigar Set', 'The Havana Reserve Cartel Edition Cigar Set is a testament to the appreciation of the finer things in life, tailored exclusively for the discerning aficionados within the clandestine ranks. Crafted in the heart of Cuba, this limited edition set embodies the artistry and heritage of the world\'s most renowned cigar-producing region.', 'Increases Sicario Morale by 40', 'Luxury', 7500, null, 'https://cartelempire.online/images/items/4002.png')],
        ['eagle_cabernet', new Item(4003, 'Eagle Cabernet 1992', 'Bottled in a limited-edition, hand-blown crystal decanter adorned with the cartel\'s emblem, the Eagle Cabernet 1992 is a masterpiece of craftsmanship and viticulture. The deep crimson hue of the wine hints at the intensity within, a complexity that has matured and evolved over decades in carefully curated cellars.', 'Increases Sicario Morale by 60', 'Luxury', 9500, null, 'https://cartelempire.online/images/items/4003.png')],
        ['whiskey', new Item(4004, 'Whiskey Decanter', 'Crafted from the finest crystal, the decanter\'s design is a fusion of opulence and strength, adorned with the unmistakable insignia of the cartel. The stopper, fashioned from polished obsidian, adds an element of mystique and serves as a seal to preserve the precious amber elixir within.', 'Increases Sicario Morale by 75', 'Luxury', 25000, null, 'https://cartelempire.online/images/items/4004.png')],
        ['gold_grooming_kit', new Item(4005, 'Gold Grooming Kit', 'Housed in an intricately designed, gold-plated case adorned with the cartel\'s emblem, the Aurelian Elegance Kit is a symbol of distinction. The case itself is a work of art, featuring meticulous detailing and a seamless blend of functionality and elegance.', 'Increases Sicario Morale by 100', 'Luxury', 35000, null, 'https://cartelempire.online/images/items/4005.png')],
        ['gemstone', new Item(4006, 'Gemstone Cufflinks', 'Each cufflink is a miniature masterpiece, featuring a meticulously selected and rare gemstone, ensconced in a setting of the finest precious metals. The gems, chosen for their vibrancy and uniqueness, add a splash of color and mystique to the wearer\'s attire.', 'Increases Sicario Morale by 250', 'Luxury', 281947, null, 'https://cartelempire.online/images/items/4006.png')],
        ['lapis_lighter', new Item(4007, 'Lapis-Encrusted Lighter', 'The lighter is not merely a tool but a statement. The lapis lazuli stones, set against the backdrop of a gold or silver-plated body, symbolize the union of strength and sophistication, a reflection of the dual nature of those within the cartel.', 'Increases Sicario Morale by 300', 'Luxury', 720508, null, 'https://cartelempire.online/images/items/4007.png')],
        ['sattelite_phone', new Item(4008, 'Satellite Phone', 'Equipped with state-of-the-art satellite communication technology, this phone ensures unwavering connectivity in the most remote and inaccessible regions. Its encrypted channels and secure protocols make it the communication device of choice for those who navigate the shadowy world of power and secrecy.', 'Increases Sicario Morale by 400', 'Luxury', 1511111, null, 'https://cartelempire.online/images/items/4008.png')],
        ['club_membership', new Item(4009, 'Club VIP Lounge Membership', 'The benefits of the Julio\'s Club VIP Lounge Membership extend beyond the physical space. Members enjoy exclusive invitations to cartel gatherings, high-stakes events, and private parties hosted by the most influential figures within the organization', 'Increases Sicario Morale by 500', 'Luxury', 3088461, null, 'https://cartelempire.online/images/items/4009.png')],
        ['pearl_lighter', new Item(4010, 'Pearl-Encrusted Lighter', 'The body of the lighter is encrusted with lustrous pearls, meticulously arranged to create a stunning mosaic that catches and reflects ambient light. Each pearl, handpicked for its size and iridescence, adds a touch of opulence to the accessory, creating a visual masterpiece that captivates the eyes.', 'Increases Sicario Morale by 600', 'Luxury', 300000, null, 'https://cartelempire.online/images/items/4010.png')],
        ['diamond_watch', new Item(4011, 'Diamond Watch', 'The bezel of the watch is meticulously encrusted with an array of flawless diamonds, each carefully selected for its cut, clarity, and brilliance. The diamonds sparkle in unison, creating a celestial dance of light that captivates onlookers and draws attention to the refined craftsmanship of the timepiece.', 'Increases Sicario Morale by 700', 'Luxury', 450000, null, 'https://cartelempire.online/images/items/4011.png')],
        ['diamond_lighter', new Item(4012, 'Diamond-Encrusted Lighter', 'The body of the lighter is encased in platinum or gold, serving as a canvas for an intricate design meticulously embellished with an array of dazzling diamonds,', 'Increases Sicario Morale by 850', 'Luxury', 860551, null, 'https://cartelempire.online/images/items/4012.png')],
        ['bulletproof_suit', new Item(4013, 'Bulletproof Suit', 'Crafted from the finest wool or silk blends, the suit\'s exterior showcases the pinnacle of tailoring, adhering to the highest standards of luxury. However, beneath this veneer of refinement lies a concealed layer of advanced ballistic material, meticulously integrated into the fabric.', 'Increases Sicario Morale by 1000', 'Luxury', 850000, null, 'https://cartelempire.online/images/items/4013.png')],
        ['pet_jaguar', new Item(4014, 'Pet Jaguar', 'Whether prowling alongside its master or stationed as a sentinel in a hidden lair, the Jaguar embodies the untamed strength and calculated ferocity of those who operate in the Cartels.', 'Increases Sicario Morale by 1100', 'Luxury', 1250000, null, 'https://cartelempire.online/images/items/4014.png')],
        ['gold_pistol', new Item(4015, 'Gold-Plated Pistol', 'Possession of the Pistol is an honor reserved for the most accomplished Sicarios within the organization. Whether holstered during high-stakes negotiations or drawn in the face of adversaries, the gold-plated pistol is an unmistakable statement of the Sicario\'s prowess and the cartel\'s indomitable reach.', 'Increases Sicario Morale by 1200', 'Luxury', 1350000, null, 'https://cartelempire.online/images/items/4015.png')],
        ['platinum_credit_card', new Item(4016, 'Platinum Credit Card', 'Crafted from genuine platinum and adorned with the intricately embossed cartel crest, this credit card is a tangible representation of the Sicario\'s elevated status. The cardholder\'s name is discreetly engraved, a mark of distinction within the elite tier, and serves as the key to unlocking a world of unparalleled luxury and financial freedom.', 'Increases Sicario Morale by 1500', 'Luxury', 2750000, null, 'https://cartelempire.online/images/items/4016.png')],
        ['helicopter', new Item(4017, 'Personal Helicopter', 'The Sicario Executive Helicopter is equipped with state-of-the-art avionics, providing unparalleled navigation capabilities and ensuring a swift escape from any pursuit. The interior is a lavish sanctuary, featuring plush leather seating, climate control, and cutting-edge communication systems, creating an atmosphere of opulence even at high altitudes.', 'Increases Sicario Morale by 1750', 'Luxury', 3941278, null, 'https://cartelempire.online/images/items/4017.png')],
        ['candy_corn', new Item(7200, 'Candy Corn', 'Tri-colour kernels of sugar. Candy value 1. Eat for +5 Energy (+5 min Booster cooldown), or spend in the Halloween shop.', '+5 Energy, +5 min Booster cooldown', 'Special', 8000, 'Eat', 'https://cartelempire.online/images/items/7200.png')],
        ['candy_pumpkin_seed', new Item(7201, 'Candy Pumpkin Seed', 'A salted-sweet seed. Candy value 2. Eat for +8 Energy (+8 min Booster cooldown), or spend in the Halloween shop.', '+8 Energy, +8 min Booster cooldown', 'Special', 16000, 'Eat', 'https://cartelempire.online/images/items/7201.png')],
        ['blood_lollipop', new Item(7202, 'Blood Lollipop', 'Cherry-red on a stick. Candy value 2. Eat for +40 Life (+5 min Medical cooldown), or spend in the Halloween shop.', '+40 Life, +5 min Medical cooldown', 'Special', 16000, 'Eat', 'https://cartelempire.online/images/items/7202.png')],
        ['grave_gum', new Item(7203, 'Grave Gum', 'Chews like cemetery dirt, somehow minty. Candy value 3. Eat to shave 10 minutes of Medical cooldown and add 5 minutes of Booster cooldown, or spend in the Halloween shop.', '-10 min Medical cooldown, +5 min Booster cooldown', 'Special', 24000, 'Eat', 'https://cartelempire.online/images/items/7203.png')],
        ['witch_fudge', new Item(7204, 'Witch Fudge', 'Dense, spiced fudge. Candy value 3. Eat to shave 10 minutes of Booster cooldown and add 5 minutes of Medical cooldown, or spend in the Halloween shop.', '-10 min Booster cooldown, +5 min Medical cooldown', 'Special', 24000, 'Eat', 'https://cartelempire.online/images/items/7204.png')],
        ['sugar_skull', new Item(7205, 'Sugar Skull', 'Icing grin, hollow centre. Candy value 2. Eat for £8,000, or spend in the Halloween shop.', '+£8,000', 'Special', 16000, 'Eat', 'https://cartelempire.online/images/items/7205.png')],
        ['spider_taffy', new Item(7206, 'Spider Taffy', 'It stretches. Candy value 4. Eat for +12 Energy (+12 min Booster cooldown), or spend in the Halloween shop.', '+12 Energy, +12 min Booster cooldown', 'Special', 32000, 'Eat', 'https://cartelempire.online/images/items/7206.png')],
        ['ghost_mint', new Item(7207, 'Ghost Mint', 'Cold enough to fog the tongue. Candy value 5. Eat for +80 Life (+10 min Medical cooldown), or spend in the Halloween shop.', '+80 Life, +10 min Medical cooldown', 'Special', 40000, 'Eat', 'https://cartelempire.online/images/items/7207.png')],
        ['caramel_apple', new Item(7208, 'Caramel Apple', 'Sticky, festival-stand sweet. Candy value 4. Eat to shave 10 minutes of Drug cooldown and add 5 minutes of Booster cooldown, or spend in the Halloween shop.', '-10 min Drug cooldown, +5 min Booster cooldown', 'Special', 32000, 'Eat', 'https://cartelempire.online/images/items/7208.png')],
        ['bone_chocolate', new Item(7209, 'Bone Chocolate', 'White chocolate marbled like marrow. Candy value 5. Eat for £20,000, or spend in the Halloween shop.', '+£20,000', 'Special', 40000, 'Eat', 'https://cartelempire.online/images/items/7209.png')],
        ['pumpkin_candy', new Item(7210, 'Pumpkin Candy', 'The smash-only Candy. Candy value 12. Eat for +20 Energy (+20 min Booster cooldown), or spend in the Halloween shop. Combat, jobs, and revives never drop it.', '+20 Energy, +20 min Booster cooldown', 'Special', 96000, 'Eat', 'https://cartelempire.online/images/items/7210.png')],
        ['pumpkin_king_costume', new Item(7211, 'Pumpkin King Costume', '2026 smash costume: a carved pumpkin crown and gold-trimmed cloak. Display it on your porch for +1 Candy min and max, +5% Trick or haunted Spook chance, and +2% Good Ghost chance.', '+1 Candy min/max, +5% Spook, and +2% Good Ghost when displayed', 'Collectible', 500000, null, 'https://cartelempire.online/images/items/7211.png')],
        ['jack_o_lantern_suit', new Item(7212, 'Jack-o\'-Lantern Suit', '2026 smash costume: an orange-and-black suit with a glowing jack-o\'-lantern chest. Display it on your porch for +1 Candy min and max, +5% Trick or haunted Spook chance, and +2% Good Ghost chance.', '+1 Candy min/max, +5% Spook, and +2% Good Ghost when displayed', 'Collectible', 500000, null, 'https://cartelempire.online/images/items/7212.png')],
        ['candy_stall_mask', new Item(7213, 'Candy Stall Mask', 'A 2026 candy-shop carnival mask. Equip it to raise your chance of beating a Trick house by 8%, to reduce your chance of being Spooked by 10% when visiting, and to raise Good Ghost chance by 2%. Display it on your porch for +1 Candy min and max, +5% Trick or haunted Spook chance, and +2% Good Ghost chance.', 'Equip: +8% Trick success, -10% visitor Spook, +2% Good Ghost', 'Collectible', 750000, 'Equip', 'https://cartelempire.online/images/items/7213.png')],
        ['threetoothjoe_charm', new Item(7214, 'Threetoothjoe\'s Charm', 'A commemorative porch charm left by Threetoothjoe. Own it (inventory or gallery) for +5% Good Ghost chance. It does not add Candy or Spook.', '+5% Good Ghost chance while owned', 'Collectible', 500000, null, 'https://cartelempire.online/images/items/7214.png')],
        ['calavera mezcal', new Item(7215, 'Calavera Mezcal', 'Celia\'s festival mezcal from the Halloween stall. Drink for +20 Energy (+2 hours Booster cooldown). Cannot be traded, sent, or listed.', '+20 Energy, +2 hours Booster cooldown', 'Alcohol', 320000, 'Drink', 'https://cartelempire.online/images/items/7215.png')],
        ['el_chapo_head', new Item(9001, 'El Chapo\'s Head', 'Christmas 2022 Collectible - This limited edition collectible comes with a huge variety of catchphrases including "Silver or Lead?", "Don\'t give up", "I take care of you" and "Never regret", among other weirdly supportive comments for a Cartel Boss.<br><br>Who needs inspirational posters when you\'ve got your own little mob boss in your pocket.', null, 'Collectible', 0, null, 'https://cartelempire.online/images/items/9001.png')],
        ['pablo_hat', new Item(9002, 'Pablo\'s Hat', 'Christmas 2023/2024 Collectible - This limited edition collectible is a bit odd and raises more questions than it answers, how do we know it\'s Pablos? Why is it decorated in Christmas decorations? and why does it smell like reindeer?', null, 'Collectible', 0, null, 'https://cartelempire.online/images/items/9002.png')],
        ['quecheu_doll', new Item(9003, 'Quecheu Troll Doll', 'Meme Competition Collectible - The Quecheu Troll doll is famed across Bolivia and loved by children and child-like narcos throughout the country, this limited edition version is only given out a handfull of times each year by the Troll Company to special individuals. Rumour has it that Escobar has one!', null, 'Collectible', 0, null, 'https://cartelempire.online/images/items/9003.png')],
        ['easter_fuggly', new Item(9004, 'The Easter Fuggly', 'Easter 2024 Collectible - A grimy, unsettling doll fashioned in the likeness of the Easter Bunny, discarded by the peculiar figure who roamed Bolivia in 2024. Its once vibrant fur now matted and discolored, the doll\'s glassy eye seems to track observers with intensity, casting a pall of discomfort upon anyone who dares to hold it. A sense of unease settles over the room as the doll\'s presence lingers, leaving an inexplicable feeling of queasiness in its wake, prompting whispered tales of its haunting gaze among those who dare to speak of it.', null, 'Collectible', 0, null, 'https://cartelempire.online/images/items/9004.png')],
        ['green_elf', new Item(9005, 'Elf on a Shelf - Green', 'Christmas 2024 Collectible - Where the hell did this Elf come from? It just seemed to appear in your home through the night. Pressing its foot seems to activate a voice box, but it just cryptically mutters the phrase "You should\'ve never opened that door", leaving you wondering if you\'ve started something you can\'t undo.', null, 'Collectible', 0, null, 'https://cartelempire.online/images/items/9005.png')],
        ['red_elf', new Item(9006, 'Elf on a Shelf - Red', 'Christmas 2024 Collectible - Where the hell did this Elf come from? It just seemed to appear in your home through the night. Pressing its foot seems to activate a voice box, but it just menacingly repeats the phrase "You\'d like that wouldn\'t you", without ever clarifying.', null, 'Collectible', 0, null, 'https://cartelempire.online/images/items/9006.png')],
        ['padrino_egg', new Item(9007, 'Padrino\'s Egg', 'Easter 2025 Collectible - An eery reminder of El Padrino\'s power and Lucía\'s sacrifice.', null, 'Collectible', 0, null, 'https://cartelempire.online/images/items/9007.png')],
        ['crimson_star', new Item(9008, 'The Crimson Star', 'Christmas 2025 Collectible - A ruby-encrusted star-shaped brooch that symbolizes power and betrayal. Rumored to carry a curse, it is said to grant dominance to the wearer but at a terrible cost.', null, 'Collectible', 0, null, 'https://cartelempire.online/images/items/9008.png')],
        ['la_cara_roja_mask', new Item(9009, 'La Cara Roja Mask', 'Easter 2026 Collectible - The half-melted remains of the La Cara Roja mask, the sole reminder of how close the Executioner of the Gods came to ending the world as we know it', null, 'Collectible', 0, null, 'https://cartelempire.online/images/items/9009.png')],
    ]);

    // Job
    // Base rep for standard jobs doubled with https://cartelempire.online/Forum/1/7289
    static JOBS = new Map([
        // Standard
        ['intim', new Job('Intimidation', 'standard', 5, 1_650, 20,
            {'Personal Favour': 0.005})],
        ['arson', new Job('Arson', 'standard', 30, 14_000, 150,
            {'Personal Favour': 0.03})],
        ['gta', new Job('Grand Theft Auto', 'standard', 60, 55_000, 320,
            {'Personal Favour': 0.06})],
        ['drugs', new Job('Transport Drugs', 'standard', 180, 250_000, 980,
            {'Personal Favour': 0.18})],

        // Robbery
        ['farm', new Job('Farm Robbery', 'robbery', 15, 111, 21,
            {'Bag of Fertiliser': 6})],
        ['agave', new Job('Agave Storehouse Robbery', 'robbery', 30, 111, 50,
            {'Agave Heart': 3.5})],
        ['paste', new Job('Coca Paste Robbery', 'robbery', 60, 111, 82,
            {'Coca Paste': 12})],
        ['construction', new Job('Construction Robbery', 'robbery', 90, 260, 165, {
            'Nails': 12.5 * 0.4,
            'Bricks': 12.5 * 0.3,
            'Concrete Bags': 12.5 * 0.2,
            'Steel': 12.5 * 0.1
        })],

        // Advanced
        ['blackmail', new Job('Blackmail', 'advanced', 360, 700_000, 2_260,
            {'Personal Favour': 1/6})], // Estimate
        ['hacking', new Job('Hacking', 'advanced', 720, 2_250_000, 4640,
            {'Personal Favour': 1/3})] // Estimate
    ]);

    // Casino
    static SPIN_COST = 100_000;
	static LOTTERY_TICKET_COST = 10_000;
    static BLACKJACK_COST = [1_000, 1_000_000]; // Can range between 1k and 1mil

    // Formulas
    static calcRepFromLevel = (level) =>
        Math.floor(12000 * (Math.exp(level * Math.log(1.1)) - 1));

	static calcLevelFromRep = (reputation) => 
		Math.floor(Math.log(reputation / 12000 + 1) / Math.log(1.1));

    static calcIntelligenceEnergyCost = (gainFraction, extraGainFactor) =>
        Math.floor(
            Math.log(gainFraction) / Math.log(1.000027272479341)
                / extraGainFactor
        );
    
    static calcIntGain = (current, energy, base, extraGainFactor) =>
        current * (Math.pow(base, energy * extraGainFactor) - 1);

    static calcIntGainImproper = (current, energy, base, extraGainFactor) =>
        current * (base - 1) * energy * extraGainFactor;

    static calcEToMax = (maxInt, currentInt, base, extraGainFactor) =>
        Math.log(maxInt / currentInt) / Math.log(base) / extraGainFactor;

    static calcFFM = (ownStats, theirStats, constant) => 
        1 + constant * theirStats / ownStats;

    static calcRepEstimateExp = (level, repM, repC, ffm) => 
        Math.exp(level * repM + repC) * ffm;

    static calcRepEstimateQuad = (level, repA, repC, ffm) =>
        (Math.pow(level + 1, 2) * repA + repC) * ffm;

    static calcStatEstimate = (ffm, attackerStats, defenderStats, cutoff, constant) => {
        // Can't calculate with no stats
        if (attackerStats === undefined && defenderStats === undefined) return;

        // Use cutoff if FFM is at minimum
        const calcFFM = ffm === GameData.MIN_FFM ? cutoff : ffm - 1;

        // Determine constant for calculation
        // Attacker known -> FFM / constant
        // Defender known -> constant / FFM = 1 / (FFM / constant)
        let temp_const = calcFFM / constant;
        temp_const = attackerStats === undefined ? (1 / temp_const) : temp_const;

        return temp_const * (attackerStats ?? defenderStats);
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

    // Missions
    static MISSION_COUNT = {
        personal: {
            daily: 5,
            weekly: 2,
            global: 2
        },
        global: {
            daily: 0,
            weekly: 1,
            global: 1
        },
        cartel: {
            daily: 2,
            weekly: 1,
            global: 1
        }
    };

    // Estate
    static ESTATE_BONUS_VALUES = {
        save: [0, 10, 50, 150, 250, 500, 2_000, 5_000, 10_000], // Max safe, between 0 and 5bil
        uni_reduction: [0, 1, 2, 4, 6, 8, 10, 12], // Uni course time reduction, between 0% and 10%
        gym_bonus: [0, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75, 1.25, 1.5], // Gym bonus, between 0% and 0.75%
        int_cap: [0, 50, 100, 150, 200, 250], // Intelligence cap bonus, between 0 and 200 int
        int_bonus: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.75, 1], // Int gain bonus, between 0% and 0.75%
        dock: [
            {shop_bonus: 0},
            {shop_bonus: 5},
            {shop_bonus: 10},
            {shop_bonus: 15},
            {shop_bonus: 15, exped_bonus: 1},
            {shop_bonus: 15, exped_bonus: 1, personal_smuggling: 1}
        ]
    };

    // Attacks
    static MIN_STATS = 400;
    static MUG_REP_MULT = 1 / 2;
    static HOSP_REP_MULT = 3 / 4;

    static MIN_FFM = 1;
    static MAX_FFM = 3;

    // Bank
    static TAX_RATE = 2.5;

    // Productions
    static PROD_DEPRECATION = 2;
    static PROD_COKE_SCALING = [1, 1.75, 2.3125, 2.734375]; // Source: screenshot in the Coke suggestions thread

    static MAX_CANNABIS = 12;
    static MAX_COKE = 8;

    static PRODUCTIONS = {
        street_crimes: {
            narco_count: 1,
            money: 1_000,
            requirements: {},
            items: {},
        },
        doctors_office: {
            narco_count: 5,
            money: 0,
            requirements: {},
            items: {
                'Bandage': 0.5,
                'Small Medical Kit': 0.3,
                'Large Medical Kit': 0.15,
                'Basic Trauma Kit': 0.05,
                'Large Trauma Kit': 0.025
            },
        },
        weed_field: {
            narco_count: 25,
            money: 105_000,
            requirements: {'Bag of Fertiliser': 10},
            items: {
                // Max cannabis / 2 * cannabis chance
                'Cannabis': GameData.MAX_CANNABIS / 2 * 0.75,
                'Tainted Cannabis': GameData.MAX_CANNABIS / 2 * 0.25
            },
        },
        alcohol_still: {
            narco_count: 10,
            money: 70_000,
            requirements: {'Agave Heart': 5},
            items: {
                'Corana Beer': 0.259,
                'Mexcal Beer': 0.085,
                'Blancoda Tequila': 0.303,
                'Repose Tequila': 0.141,
                'Anejo Tequila': 0.095,
                'Raicilla': 0.031
            },
        },
        cocaine_factory: {
            narco_count: 60,
            money: 800_000,
            requirements: {'Coca Paste': 35},
            items: {
                // Max coke / 2 * coke chance
                'Cocaine': GameData.MAX_COKE / 2 * 0.75,
                'Tainted Cocaine': GameData.MAX_COKE / 2 * 0.25
            },
        }
    }

    // Misc
    static ATTACK_COST = 20; // Cost in energy
    static REVIVE_COST = 50; // Cost in energy

}