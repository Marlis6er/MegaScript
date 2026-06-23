class ColorStats {
	constructor(darkMode) {
		this.brightness = darkMode ? 50 : 45;
		this.maxInt = GM_getValue("perks_Max Int") || 1200;
	}
	calcGym(stat) {
		return Math.min(1, 12.5 / 120 * Math.log(stat / 51000 + 1)); // Arbitrary calculation, reaches 120 at ~750 mil (per stat)
	}
	calcInt(currentInt) {
		return 1 - Math.pow(this.maxInt - currentInt, 2) / Math.pow(this.maxInt, 2);
	}
	calcNetworth(networth) {
		return Math.min(1, networth / 600000000); // Arbitrary calculation, reaches max at 600 mil
	}
	calcAttacksWon(won) {
		return Math.min(1, won / 3000); // Arbitrary calculation, reaches max at 3000
	}
	calcRep(rep) {
		return Math.min(1, Math.log(rep / 420000 + 1)); // Arbitrary calculation, reaches max at ~720000
	}
	calcLevel(lvl) {
		return Math.min(1, lvl / 50); // Arbitrary calculation, reaches max at 50
	}
	calcRevives(revives) {
		return Math.min(1, revives / 1000); // Uses revive achievement, reaches max at 1000
	}
	calcCartelRep(rep) {
		return Math.min(1, Math.log(rep / 1300000 + 1)); // Arbitrary calculation, reaches max at ~2.22 mil
	}
	calcRespect(resp) {
		return Math.max(0, 226 - resp * (resp < 0 ? 15 : 3.7)); // Arbitrary calculation, reaches max at ~-15 if negative, or ~61 if positive
	}
	calcQuality(qualChance) {
		return Math.min(1, 1 - qualChance / 100); // Reaches max at top 0%, min at top 100%
	}
	poz(z) {
		let y, x, w;
		if (z == 0.0) return 0.5;

		y = 0.5 * Math.abs(z);
		if (y > (4 * 0.5)) { // Was previously 6 * 0.5
			x = 1.0;
		} else if (y < 1.0) {
			w = y * y;
			x = ((((((((0.000124818987 * w
				- 0.001075204047) * w + 0.005198775019) * w
				- 0.019198292004) * w + 0.059054035642) * w
				- 0.151968751364) * w + 0.319152932694) * w
				- 0.531923007300) * w + 0.797884560593) * y * 2.0;
		} else {
			y -= 2.0;
			x = (((((((((((((-0.000045255659 * y
				+ 0.000152529290) * y - 0.000019538132) * y
				- 0.000676904986) * y + 0.001390604284) * y
				- 0.000794620820) * y - 0.002034254874) * y
				+ 0.006549791214) * y - 0.010557625006) * y
				+ 0.011630447319) * y - 0.009279453341) * y
				+ 0.005353579108) * y - 0.002141268741) * y
				+ 0.000535310849) * y + 0.999936657524;
		}
		return z > 0.0 ? ((x + 1.0) * 0.5) : ((1.0 - x) * 0.5);
	}
	changeQuality(elem) {
		if (elem === null) return;

		const percent = elem.textContent.replace(/^\s+\w+\s+/, "");
		if (percent !== elem.textContent && elem.textContent.trim().split(/\s/)[0] !== "Quality")
			return;
		if (percent === "" || percent === "N/A") return;

		const qual = parseFloat(percent.slice(0, -1));
		const qualChance = (this.poz((50 - qual) / 12.5) * 100).toString(); // mean = 50, std = 12.5
		if (qualChance === "NaN") return;

		const first4 = qualChance.slice(0, 4);
		elem.innerHTML += ` <span style="color: hsl(${this.calcQuality(qualChance) * 120}, 67%, ${this.brightness}%)">(top ${qualChance.slice(0, first4 === "0.00" ? 5 : first4 === "99.9" ? (qualChance.slice(0, 5) === "99.99" ? 6 : 5) : 4)}%)</span>`;
	}
	changeHsThing(content, selector, lambda, valFunc, calcFunc) {
		const rows = content.querySelectorAll(selector);
		for (const row of rows) {
			const thing = row.children[2];
			const val = parseFloat(lambda(thing.textContent));
			thing.style.color = `hsl(${calcFunc(valFunc(val)) * 120}, 67%, ${this.brightness}%)`;
		}
	}
	changePsThing(elem, lambda, valFunc, calcFunc) {
		const val = parseFloat(lambda(elem.textContent));
		elem.innerHTML = `<span style="color: hsl(${calcFunc(valFunc(val)) * 120}, 67%, ${this.brightness}%)">${elem.textContent}</span>`;
	}
	inForumPost(url) {
		const respects = document.querySelectorAll(".mb-2 p.card-text");
		for (const respText of respects) {
			const resp = parseInt(respText.textContent.split(' ')[0].replaceAll(',', ""));
			const colorVal = this.calcRespect(resp);
			respText.innerHTML = `<span style="color: rgba(${resp < 0 ? 222 : colorVal}, ${resp < 0 ? colorVal : 226}, ${colorVal}, 0.75)">${resp.toLocaleString("en-US")}</span> Respect`;
		}
	}
	inHighscores(url) {
		const noCommas = text => text.replaceAll(',', "");
		const changeBattlestats = content => this.changeHsThing(content, "tr.fw-bold", noCommas, val => val / 4, this.calcGym.bind(this));
		const battlestats = document.querySelector("div#v-content-battlestats");
		changeBattlestats(battlestats);
		observeDOM(battlestats, e => changeBattlestats(e[0].target));

		const changeRep = (content, calcFunc) => this.changeHsThing(content, "tbody tr", noCommas, val => val, calcFunc);
		const repContainer = document.querySelector("div#v-content-reputation");
		changeRep(repContainer, this.calcRep.bind(this));
		observeDOM(repContainer, e => changeRep(e[0].target, this.calcRep));
		const cartelRepContainer = document.querySelector("div#v-content-cartelreputation");
		changeRep(cartelRepContainer, this.calcCartelRep.bind(this));
		observeDOM(cartelRepContainer, e => changeRep(e[0].target, this.calcCartelRep.bind(this)));

		const changeNetworth = content => this.changeHsThing(content, "tbody tr", text => noCommas(text.slice(1)), val => val, this.calcNetworth.bind(this));
		const networthContainer = document.querySelector("div#v-content-networth");
		changeNetworth(networthContainer);
		observeDOM(networthContainer, e => changeNetworth(e[0].target));

		const changeAttacksWon = content => this.changeHsThing(content, "tbody tr", noCommas, val => val, this.calcAttacksWon.bind(this));
		const attacksWonContainer = document.querySelector("div#v-content-attackswon");
		changeAttacksWon(attacksWonContainer);
		observeDOM(attacksWonContainer, e => changeAttacksWon(e[0].target));

		const changeLevel = content => this.changeHsThing(content, "tbody tr", noCommas, val => val, this.calcLevel.bind(this));
		const levelContainer = document.querySelector("div#v-content-level");
		changeLevel(levelContainer);
		observeDOM(levelContainer, e => changeLevel(e[0].target));

		const changeRevives = content => this.changeHsThing(content, "tbody tr", noCommas, val => val, this.calcRevives.bind(this));
		const revivesContainer = document.querySelector("div#v-content-revives");
		changeRevives(revivesContainer);
		observeDOM(revivesContainer, e => changeRevives(e[0].target));
	}
	inHomepage(url) {
		const stats = document.querySelectorAll(".col-md-6.d-flex.align-items-stretch.col-xxl-4");
		if (stats.length < 2) return;

		const leftStats = stats[0].querySelectorAll(".form-data-inset.p-2.mb-0.rounded");
		for (let i = 0; i !== 2; ++i) {
			const theStat = leftStats[i === 0 ? 2 : 6];
			const text = theStat.textContent;
			const val = parseFloat(text.replaceAll(',', ""));
			theStat.innerHTML = `<span style="color: hsl(${(i === 0 ? this.calcRep(val) : this.calcInt(val)) * 120}, 67%, ${this.brightness}%)">${text}</span>`;
		}

		const trs = stats[1].querySelectorAll(".form-data-inset.p-2.mb-0.rounded");
		if (trs.length < 5) return;

		for (let i = 0; i !== 5; ++i) {
			const td = trs[i];
			const valText = td.textContent.match(/^[\d\.,]+/)[0];
			const val = parseFloat(valText.replaceAll(',', ""));
			const colorVal = i === 4 ? this.calcGym(val / 4) : this.calcGym(val);
			const effectiveStats = td.children[0];
			if (effectiveStats)
				effectiveStats.classList.add("float-end");
			td.innerHTML = `<span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">${valText}</span>${td.innerHTML.replace(/^[\d\.,]+/, "")}`;
		}
	}
	inGym(url) {
		let statCols = document.querySelector("div.row.row-cols-2.row-cols-lg-4.row-cols-md-2.mt-2.mb-4.g-4");
		if (statCols === null) return;

		statCols = statCols.children;

		const totalStats = document.querySelector("p.card-text.fw-bold.text-muted"); // Is the first one
		const textSplit = totalStats.textContent.split(' ');
		const totalStatVal = parseFloat(textSplit[0].slice(1).replaceAll(',', ""));
		totalStats.innerHTML = `(<span style="color: hsl(${this.calcGym(totalStatVal / 4) * 120}, 67%, ${this.brightness}%)">${textSplit[0].slice(1)}</span> ${textSplit.slice(1).join(' ')}`;

		for (const col of statCols) {
			const stat = col.children[0].children[2];
			const textSplit = stat.textContent.split(' ');
			const statVal = parseFloat(textSplit[0].slice(1).replaceAll(',', ""));
			stat.innerHTML = `(<span style="color: hsl(${this.calcGym(statVal) * 120}, 67%, ${this.brightness}%)">${textSplit[0].slice(1)}</span> ${textSplit[1].slice(0, -1)}: ${(statVal / totalStatVal * 100).toFixed(1)}%)`;
		}
	}
	inUniversity(url) {
		const container = document.querySelector("div.text-center.d-flex.flex-column.align-items-center");
		if (container === null) return;

		const currentInt = container.querySelector("p.card-text.fw-bold.text-muted");

		const textSplit = currentInt.textContent.split(' ');
		const currentIntVal = parseFloat(textSplit[0].slice(1));
		currentInt.innerHTML = `(<span style="color: hsl(${this.calcInt(currentIntVal) * 120}, 67%, ${this.brightness}%)">${textSplit[0].slice(1)}</span> ${textSplit.slice(1).join(' ')}`;
	}
	inPersonalStats(url) {
		const stats = document.querySelectorAll(".list-group .list-group-item ~ .list-group-item .col-4 ~ .col-4");
		if (stats.length === 0) return;

		const noCommas = text => text.replaceAll(',', "");
		for (let i = 0; i < 2; ++i) {
			this.changePsThing(stats[i], noCommas, val => val, this.calcRep.bind(this));
			this.changePsThing(stats[i + 2], noCommas, val => val, this.calcInt.bind(this));
			this.changePsThing(stats[i + 12], noCommas, val => val / 4, this.calcGym.bind(this));
			const resp = parseInt(noCommas(stats[i + 14].textContent));
			const colorVal = this.calcRespect(resp);
			stats[i + 14].innerHTML = `<span style="color: rgba(${resp < 0 ? 222 : colorVal}, ${resp < 0 ? colorVal : 226}, ${colorVal}, 0.75)">${resp.toLocaleString("en-US")}</span>`;
		}
		for (let i = 0; i < 8; ++i) {
			this.changePsThing(stats[i + 4], noCommas, val => val, this.calcGym.bind(this));
		}
	}
	inInventory(url) {
		const itemList = document.querySelectorAll("div.container.inventoryWrapper > div.inventoryItemWrapper");
		if (itemList === null) return;

		for (const item of itemList) {
			if (item.children.length < 7) continue;

			this.changeQuality(item.children[4]);
			const otherElem = item.children[6].querySelector(".align-items-center .col-xl-2");
			this.changeQuality(otherElem);
		}
	}
	inMarket(url) {
		const container = document.querySelector("nav#itemMarketNav > div.tab-content");
		if (container === null) return;

		for (const section of container.children)
			observeDOM(section, e => {
				const list = e[0]?.addedNodes[2];
				if (!list || list.classList === undefined || !list.classList.contains("offerListWrapper"))
					return;

				const listings = list.querySelectorAll(".offerItemWrapper");
				for (const listing of listings) {
					const qualElem = listing.children[3];
					if (qualElem.textContent.slice(-1) !== "%") continue;

					this.changeQuality(qualElem);
				}
				const collapsed = list.querySelectorAll(".collapse, .collapsing");
				for (const listing of collapsed) {
					this.changeQuality(listing.querySelector(".col-xl-2"));
				}
			});

		const ownOffers = document.querySelectorAll(".card-body > .offerListWrapper .inventoryItemWrapper");
		for (const offer of ownOffers) {
			this.changeQuality(offer.children[3]);
		}
	}
}
