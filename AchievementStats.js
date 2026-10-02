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
			['simple', 'Point cost: ', 25 * getItemValue('Supporter Points')]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}20`,
			['simple', 'Refills left: '],
			['simple', 'Point cost: ', 25 * getItemValue('Supporter Points')]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}21`,
			['simple', 'Personal Favors left: '],
			['simple', 'PF cost: ', getItemValue('Personal Favour')]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}22`,
			['simple', 'Medical Items left: '],
			['min-item-cost', 'Minimum cost: ', this.medItems]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}23`,
			['simple', 'Alcohol Items left: '],
			['min-item-cost', 'Minimum cost: ', this.alcItems]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}24`,
			['simple', 'Drug Items left: '],
			['min-item-cost', 'Minimum cost: ', this.drugItems]
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
			['simple', 'Spin cost: ', this.spinCost]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}29`,
			['simple', 'Hands left: '],
			['simple', 'Min cost: ', this.blackjackCost]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}30`,
			['simple', 'Spins left: '],
			['simple', 'Min cost: ', this.blackjackCost]
		);
		this._modifyAchievement(
			`#${this.achievementIdPrefix}35`,
			['simple', 'Tickets left: '],
			['simple', 'Ticket cost: ', this.lotteryTicketCost]
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

	_getDiff(current, next, multiplier=1) {
		return (next - current) * multiplier;
	}

	_getRepDiff(current, next) {
		const currentRepElem = document.querySelector('div[aria-label="Reputation"] + div > span');
		const currentRep = parseInt(currentRepElem.textContent.replaceAll(',', ''));
		const effectiveLevel = this._calcLevelFromRep(currentRep);
		if (effectiveLevel >= next) return '0 - you can level up now';

		const nextLevelRep = this._calcRepFromLevel(next);
		return nextLevelRep - currentRep;
	}

	_getSupporterCost(current, next) {
		const diff = next - current;
		const spDaysLeftElem = document.querySelector('li.premiumIcon > a');
		const spDaysLeft = 
			spDaysLeftElem.parentElement.classList.contains('d-none') ? 
			0 : parseInt(spDaysLeftElem.getAttribute('data-bs-content')
				.match(/^\d+/)[0]);
		const spAmount = Math.ceil(Math.max(diff - spDaysLeft, 0) / 31);
		return spAmount * getItemValue('Supporter Pack');
	}

	_getMinItemCost(current, next, items) {
		const diff = next - current;

		const cheapestPrice = items.reduce((a, c) => {
			const curItemValue = getItemValue(c) || Infinity;
			return curItemValue < a ? curItemValue : a;
		}, Infinity);

		return diff * cheapestPrice;
	}

	_getGambleAmount(current, next, chance) {
		const diff = next - current;
		const avgTicketsTillGoal = Math.floor(diff * (1 / chance));

		return avgTicketsTillGoal;
	}

	_getIntEnergyCost(current, next) {
		const extraIntGains = getNumericValue('perks', 'Int Gains') || 0; // percentage
		const extraGainsFactor = 1 + extraIntGains / 100;
		const cost = Math.log(next / current) / Math.log(1.000027272479341) / extraGainsFactor
		return Math.floor(cost);
	}

	_getExpedTime(current, next) {
		const diff = next - current;
		const totalMin = diff * 20;
		const duration = new Temporal.Duration(
			0, //years
			0, // months
			0, // weeks
			Math.floor(totalMin / (60 * 24)), // days
			Math.floor(totalMin / 60) % 24 // hours
		);
		return diff > 0 ? duration : 0;
	}

	_getMissionTime(current, next) {
		const diff = next - current;
		// 7 daily (5 personal + 2 cartel),
		// 4 weekly (2 personal + 1 cartel + 1 global),
		// 4 monthly (2 personal + 1 cartel + 1 global)
		const avgMissionsPerDay = 7 + 4/7 + 4/30;
		const daysLeft = Math.ceil(diff / avgMissionsPerDay);
		const duration = new Temporal.Duration(
			Math.floor(daysLeft / 365), //years
			Math.floor(daysLeft / 30) % 12, // months
			0, // weeks
			daysLeft % 30
		);
		return diff > 0 ? duration : 0;
	}

	_getJobTime(current, next, minPerJob) {
		const diff = next - current;
		const minutesLeft = Math.ceil(diff * minPerJob);
		const duration = new Temporal.Duration(
			Math.floor(minutesLeft / (365 * 24 * 60)), //years
			Math.floor(minutesLeft / (30 * 24 * 60)) % 12, // months
			0, // weeks
			Math.floor(minutesLeft / (24 * 60)) % 30, // days
			Math.floor(minutesLeft / 60) % 24, // hours
		);
		return diff > 0 ? duration : 0;
	}

	_getDiffValue(type, amounts, params=[]) {
		switch (type) {
			case 'simple':
				return this._formatNumberOrDate(this._getDiff(...amounts, ...params));
			case 'level-rep':
				return this._formatNumberOrDate(this._getRepDiff(...amounts));
			case 'gamble-amount':
				return this._formatNumberOrDate(this._getGambleAmount(...amounts, ...params));
			case 'supporter-cost':
				return this._formatMoney(this._getSupporterCost(...amounts));
			case 'min-item-cost':
				return this._formatMoney(this._getMinItemCost(...amounts, ...params));
			case 'lottery-win-cost':
				return this._getLotteryWinCost(...amounts);
			case 'int-energy':
				return this._formatNumberOrDate(this._getIntEnergyCost(...amounts));
			case 'exped-time':
				return this._formatNumberOrDate(this._getExpedTime(...amounts));
			case 'mission-time':
				return this._formatNumberOrDate(this._getMissionTime(...amounts));
			case 'job-time':
				return this._formatNumberOrDate(this._getJobTime(...amounts, ...params));
			default:
				break;
		}
	}


}