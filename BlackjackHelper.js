class BlackjackHelper {
	constructor() {
		this.statsRegex = /^casino\/blackjackstats(\/|\/?\?.+)?/;
		this.id = "totalProfit";
		this.statsLink = "/Casino/blackjackStats";
		if (this.getStats() === null)
			this.setStats([0, 0, 0, 0, 0, 0, 0, 0]);
		if ([null, NaN].includes(this.getMoneyStat("Profit")))
			this.setMoneyStat("Profit", 0);
		if ([null, NaN].includes(this.getMoneyStat("Gain")))
			this.setMoneyStat("Gain", 0);
		if ([null, NaN].includes(this.getMoneyStat("Loss")))
			this.setMoneyStat("Loss", 0);
		this.statIndexes = ["Blackjack", "Win", "Lose", "Bust", "Surrendered", "Push", "Times split", "Times doubled"];
		this.cardVals = ['2', '3', '4', '5', '6', '7', '8', '9', 'K', 'A'];
		// https://www.beatingbonuses.com/bjstrategy.php?decks2=4&h17=stand&doubleon2=any2cards&peek2=off&surrender2=earlyf&charlie2=no&dsa2=on&resplits2=0&shuffle=0&bj=3to2&opt2=1&btn2=Generate+Strategy
		this.houseOdds = -0.17; // percent
		this.blackjackBroken = true; // 1.5x payout instead of push when both get blackjack
		this.normalTable = [
			"HHHHHHHHHR",
			"HHHHHHHHHH",
			"HDDDDHHHHH",
			"DDDDDDDDHH",
			"DDDDDDDDHH",
			"HHSSSHHHHR",
			"SSSSSHHHHR",
			"SSSSSHHHRR",
			"SSSSSHHHRR",
			"SSSSSHHRQR",
			"SSSSSSSSSQ",
			"SSSSSSSSSS"
		];
		this.softTable = [
			"HHHDDHHHHH",
			"HHHDDHHHHH",
			"HHDDDHHHHH",
			"HHDDDHHHHH",
			"HDDDDHHHHH",
			"SEEEESSHHH",
			"SSSSSSSSSS",
			"SSSSSSSSSS",
			"SSSSSSSSSS" // Custom
		];
		this.splitTable = [
			"HHPPPPHHHH",
			"HHPPPPHHHR",
			"HHHHHHHHHH",
			"DDDDDDDDHH",
			"HPPPPHHHHR",
			"PPPPPPHHRR",
			"PPPPPPPPQR",
			"PPPPPSPPSS",
			"SSSSSSSSSS",
			"PPPPPPPPPP"
		];
	}
	getMoneyStat(stat) {
		const money = GM_getValue(`blackjack_${stat}`);
		return money === undefined ? null : money;
	}
	setMoneyStat(stat, money) {
		GM_setValue(`blackjack_${stat}`, money);
		console.debug(`Set blackjack_${stat} to \u00a3${money.toLocaleString("en-US")}`);
		return money;
	}
	getStats() {
		const stats = GM_getValue("blackjack_Stats");
		return stats === undefined ? null : stats;
	}
	setStats(stats) {
		GM_setValue("blackjack_Stats", stats);
		console.debug(`Set blackjack_${stats} to ${JSON.stringify(stats)}`);
		return stats;
	}
	addProfit(val) {
		const setTo = this.getMoneyStat("Profit") + val;
		// Not sure why this is happening
		if (isNaN(setTo)) return;

		this.setMoneyStat("Profit", setTo);
		if (val > 0)
			this.setMoneyStat("Gain", this.getMoneyStat("Gain") + val);

		else
			this.setMoneyStat("Loss", this.getMoneyStat("Loss") - val);

		let profitText = document.querySelector(`span#${this.id}`);
		profitText.innerText = `\u00a3${setTo.toLocaleString("en-US")}`;
		if (setTo > 0) {
			profitText.classList.remove("text-warning", "text-danger");
			profitText.classList.add("text-success");
		} else if (setTo < 0) {
			profitText.classList.remove("text-warning", "text-success");
			profitText.classList.add("text-danger");
		} else {
			profitText.classList.remove("text-success", "text-danger");
			profitText.classList.add("text-warning");
		}
	}
	addStat(gameType) {
		if (!this.statIndexes.includes(gameType)) return;

		let curStats = this.getStats();
		curStats[this.statIndexes.indexOf(gameType)] += 1;
		this.setStats(curStats);
	}
	inBlackjack(url) {
		GM_addStyle(".click-this { background-color: #0d6efd !important; border: var(--bs-btn-border-width) solid #0d6efd !important }");

		const container = document.querySelector("#mainBackground > div > div > div.col-12");
		let ellen = container.querySelector("div.card.mb-3");
		if (ellen === null)
			return;
		ellen.classList.remove("mb-3");
		ellen.outerHTML = `<div class="row"><div class="col-xl-9 col-12 mb-4">${ellen.outerHTML}</div><div class="col-xl-3 col-12 mb-4"><div class="card h-100"><div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Total Profit</h2></div></div></div><div class="card-body"><p class="card-text text-center">Total running profit: <span id="${this.id}" class="fw-bold text-warning">\u00a3???</span>.</p><p class="card-text text-center"><span class="fs-2 text-${this.houseOdds > 0 ? "danger" : this.houseOdds < 0 ? "success" : "warning"}">${this.houseOdds.toFixed(2)}%</span> house odds</p></div></div></div></div>`;
		this.addProfit(0);

		let statsLink = document.createElement("a");
		statsLink.href = this.statsLink;
		statsLink.innerHTML = `<button class="btn btn-sm btn-dark">Stats</button>`;
		const linkContainer = container.querySelector("div.gap-2.flex-wrap");
		const rulesLink = linkContainer.querySelector("a");
		linkContainer.insertBefore(statsLink, rulesLink);

		const dealButton = container.querySelector("button#deal");
		const betAmountInput = container.querySelector("input#betAmountInput");
		let hitButton = container.querySelector("button#hit");
		if (hitButton === null)
			return;
		let standButton = container.querySelector("button#stand");
		let doubleButton = container.querySelector("button#double");
		let splitButton = container.querySelector("button#split");
		let surrenderButton = container.querySelector("button#surrender");
		const result = container.querySelector("div#result");
		const bjGame = container.querySelector("div#blackjackGame");
		const dealerCards = bjGame.querySelector("div#dealerCards");
		const playerCards = bjGame.querySelector("div#playerCards");

		const removeHighlights = () => {
			for (var button of [hitButton, standButton, doubleButton, splitButton, surrenderButton])
				button.classList.remove("click-this");
		};

		observeDOM(bjGame, () => {
			removeHighlights();
			const dealerCardText = dealerCards.innerText.replace(/10|J|Q/g, "K");
			if (dealerCardText.length !== 1) return;

			const dealerVal = this.cardVals.indexOf(dealerCardText) + 2;
			let playerCardText = playerCards.innerText.replace(/\s+/g, '').replace(/10|J|Q/g, "K");
			if (playerCardText.length < 2) return;

			let playerVal = 0;
			for (var l of playerCardText)
				playerVal += this.cardVals.indexOf(l) + 2;

			let move = "";
			if (playerCardText.length === 2) {
				if (playerCardText[0] === playerCardText[1]) {
					if (!splitButton.disabled)
						move = this.splitTable[playerVal / 2 - 2][dealerVal - 2];
				} else if (playerCardText[0] === 'A' || playerCardText[1] === 'A') {
					if (playerVal === 21) {
						if (!standButton.disabled) move = 'S';
					}
					else
						move = this.softTable[playerVal - 11 - 2][dealerVal - 2];
				}
			}
			if (move === "" && playerCardText.includes('A') && playerVal <= 21)
				move = this.softTable[playerVal - 11 - 2][dealerVal - 2];
			if (move === "") {
				while (playerCardText.includes('A') && playerVal > 21) {
					playerVal -= 10;
					playerCardText.replace('A', 'a');
				}
				playerCardText.replaceAll('a', 'A');
				move = this.normalTable[Math.min(11, Math.max(0, playerVal - 7))][dealerVal - 2];
			}

			const hl = button => button.classList.add("click-this");
			if (move === 'H')
				hl(hitButton);
			else if (move === 'J')
				hl(playerCardText.length === 2 ? hitButton : standButton);
			else if (move === 'S')
				hl(standButton);
			else if (move === 'D')
				hl(doubleButton.disabled ? hitButton : doubleButton);
			else if (move === 'E')
				hl(doubleButton.disabled ? standButton : doubleButton);
			else if (move === 'P')
				hl(splitButton);
			else if (move === 'R')
				hl(surrenderButton.disabled ? hitButton : surrenderButton);
			else if (move === 'Q')
				hl(surrenderButton.disabled ? standButton : surrenderButton);
		});

		let doubled = false;
		const applyBet = () => {
			const betAmount = parseInt(betAmountInput.value.replaceAll(',', ""));
			this.addProfit(-betAmount);
		};
		doubleButton.addEventListener("click", () => {
			doubled = true;
			applyBet();
			this.addStat("Times doubled");
		});
		splitButton.addEventListener("click", () => {
			applyBet();
			this.addStat("Times split");
		});
		dealButton.addEventListener("click", applyBet.bind(this));
		observeDOM(result, e => {
			const val = e[0].target.innerText;
			if (val === "") return;

			let betAmount = parseInt(betAmountInput.value.replaceAll(',', ""));
			if (doubled) betAmount *= 2;

			if (val.startsWith("Win") || val.startsWith("Blackjack")) {
				e[0].target.classList.add("text-success");
				e[0].target.classList.remove("text-warning", "text-danger");
				const textSplit = val.split(' ');
				const won = parseInt(textSplit[textSplit.length - 1].slice(1).replaceAll(',', ""));
				this.addProfit(betAmount + won);
			} else if (val === "Push") {
				e[0].target.classList.add("text-warning");
				e[0].target.classList.remove("text-success", "text-danger");
				this.addProfit(betAmount);
			} else if (val === "Surrendered") {
				e[0].target.classList.add("text-warning");
				e[0].target.classList.remove("text-success", "text-danger");
				this.addProfit(Math.floor(betAmount / 2));
			} else {
				e[0].target.classList.add("text-danger");
				e[0].target.classList.remove("text-warning", "text-success");
			}
			doubled = false;
			this.addStat(val.split(' ')[0].replace('!', ""));
		});
	}
	inBlackjackStats(url) {
		document.title = "Blackjack Stats | Cartel Empire";
		let container = document.querySelector("div.content-container.contentColumn");
		let insertHTML = "";

		const urlParams = new URLSearchParams(window.location.search);
		const reset = urlParams.get("resetMoney");
		if (reset === "true") {
			this.setMoneyStat("Profit", 0);
			this.setMoneyStat("Gain", 0);
			this.setMoneyStat("Loss", 0);
			window.history.replaceState({}, document.title, this.statsLink); // remove params from URL
		}

		let colorClass = "text-warning";
		const curProfit = this.getMoneyStat("Profit");
		const curGain = this.getMoneyStat("Gain");
		const curLoss = this.getMoneyStat("Loss");
		if (curProfit) {
			if (curProfit > 0) colorClass = "text-success";
			else if (curProfit < 0) colorClass = "text-danger";
		}
		const curStats = this.getStats();
		let totalGames = 0;
		for (var gameCount of curStats) totalGames += gameCount;
		for (var i = 0; i !== curStats.length; ++i)
			insertHTML += `<tr class="align-middle"><td>${this.statIndexes[i]}</td><td>${curStats[i]}</td><td>${(curStats[i] / totalGames * 100).toFixed(2)}%</td></tr>`;
		insertHTML += `<tr class="align-middle"><td>Hands played</td><td>${totalGames}</td><td></td></tr><tr class="align-middle"><td>Total gain</td><td>\u00a3${curGain !== null ? curGain.toLocaleString("en-US") : 0}</td><td></td></tr><tr class="align-middle"><td>Total loss</td><td>\u00a3${curLoss !== null ? curLoss.toLocaleString("en-US") : 0}</td><td></td></tr><tr class="align-middle"><th>Net total profit</th><th class="${colorClass}">\u00a3${curProfit ? curProfit.toLocaleString("en-US") : 0}</th><td></td></tr><tr class="align-middle"><td>Reset money stats</td><td></td><td><button onclick="window.location.href += '?resetMoney=true'" title="Reset" aria-label="Reset money stats" class="btn btn-danger action-btn fw-normal">Reset</button></td></tr>`;

		const tableHTML = `<div class="mb-4 card"><div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Blackjack Stats</h2></div></div></div><div class="card-body"> <div class="table-responsive"><table class="table align-items-center table-flush dark-tertiary-bg" id="blackjackStatsTable"><thead class="thead-light"><tr><th scope="col">Value</th><th scope="col">Count</th><th scope="col">Chance</th></tr></thead><tbody>${insertHTML}</tbody></div></div></div>`;
		container.innerHTML = `<div class="col-12 col-md-10"><div class="gap-2 d-flex justify-content-md-end mb-2 flex-wrap"><a href="/Casino/Blackjack"><button class="btn btn-sm btn-dark">Back to Blackjack </button></a></div>${tableHTML}</div>`;
	}
}
