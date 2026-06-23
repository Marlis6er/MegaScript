class HighscoreChanges {
	constructor() {
		this.hoursLate = 2;
		this.height = 16.75;
		this.cacheNames = [
			'Battlestats_self',
			'Networth_self',
			'Reputation',
			'Cartel Reputation',
			'Attacks Won',
			'Level',
			'Revives'
		];
		this.cacheNames.forEach(cacheName => {
			if (this.getCache(cacheName) === null)
				this.setCache(cacheName, [null, null]);
		});

		this.hoverColor = "rgba(var(--bs-emphasis-color-rgb), 0)";
	}
	getCache(type) {
		const cache = GM_getValue(`highscoreCache_${type}`);
		return cache === undefined ? null : cache;
	}
	setCache(type, cache) {
		GM_setValue(`highscoreCache_${type}`, cache);
		console.debug(`Set highscoreCache_${type} to ${JSON.stringify(cache)}`);
		return cache;
	}
	timeFunc(now) {
		return new Date(now - this.hoursLate * 1000 * 60 * 60).toLocaleDateString("en-GB", { timeZone: "UTC" });
	}
	up(diff) {
		return ` <span class="text-success"><svg xmlns="http://www.w3.org/2000/svg" width="${this.height}" height="${this.height}" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16"><path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"></path></svg> ${diff.toLocaleString("en-US")}</span>`;
	}
	down(diff) {
		return ` <span class="text-danger"><svg xmlns="http://www.w3.org/2000/svg" width="${this.height}" height="${this.height}" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"></path></svg> ${(-diff).toLocaleString("en-US")}</span>`;
	}
	same(diff) {
		return ` <span class="text-warning"><svg xmlns="http://www.w3.org/2000/svg" width="${this.height}" height="${this.height}" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"></path></svg></span>`;
	}
	changeSelfOnly(content, type) {
		const ownStats = content.querySelector("tbody tr.fw-bold");
		if (ownStats === null) return;

		const timeNow = this.timeFunc(Date.now());
		const curCache = this.getCache(`${type}_self`);
		const ownRank = ownStats.children[0];
		const newVal = parseInt(ownRank.innerText.replaceAll(',', ""));
		if (curCache[1] === null) curCache[1] = [timeNow, newVal];
		else if (curCache[1][0] !== timeNow) {
			curCache[0] = curCache[1];
			curCache[1] = [timeNow, newVal];
		}
		if (curCache[0] !== null && curCache[1] !== null) {
			const diff = curCache[0][1] - curCache[1][1];
			if (diff > 0) ownRank.innerHTML += this.up(diff);
			else if (diff < 0) ownRank.innerHTML += this.down(diff);
			else ownRank.innerHTML += this.same(diff);
		}
		this.setCache(`${type}_self`, curCache);
	}
	change(content, type) {
		const rows = content.querySelectorAll("tbody tr");
		const timeNow = this.timeFunc(Date.now());
		const curCache = this.getCache(type);
		let newRanks = {};
		if (curCache[1] !== null && curCache[1][0] === timeNow)
			newRanks = curCache[1][1];
		for (const row of rows) {
			let user = row.children[1];
			const userID = user.children.length ? parseInt(user.children[0].href.match(/\d+$/)[0]) : "self";
			newRanks[userID] = parseInt(row.children[0].textContent.replaceAll(',', ""));
		}
		if (curCache[1] === null) curCache[1] = [timeNow, newRanks];
		else if (curCache[1][0] !== timeNow) {
			curCache[0] = curCache[1];
			curCache[1] = [timeNow, newRanks];
		}
		if (curCache[0] !== null && curCache[1] !== null) {
			for (const row of rows) {
				const user = row.children[1];
				const userID = user.children.length ? parseInt(user.children[0].href.match(/\d+$/)[0]) : "self";
				if (!(userID in curCache[0][1] && userID in curCache[1][1])) return;

				const diff = curCache[0][1][userID] - curCache[1][1][userID];
				if (diff > 0)
					row.children[0].innerHTML += this.up(diff);
				else if (diff < 0)
					row.children[0].innerHTML += this.down(diff);
				else
					row.children[0].innerHTML += this.same(diff);
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

		GM_addStyle(`#highscoresTable tr:hover td > span { background-color: ${this.hoverColor} !important }`);
	}
}
