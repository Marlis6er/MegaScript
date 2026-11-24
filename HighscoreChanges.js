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
			ownStats.innerHTML += this._getChangeText(diff, type);
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
				if (!(userID in curCache[0][1] && userID in curCache[1][1])) continue;

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