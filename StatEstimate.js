class StatEstimate {
	constructor(darkMode, user_id, user_name) {
		this.brightness = darkMode ? 50 : 45;
		this.statEstimateLink = "/StatEstimates";
		this.statEstimateRegex = /^statestimates(\/|(\/\d+\/?)?(\?.+)?)?/;

		this.currentList = this.getList();
		if (this.currentList === null) {
			this.currentList = [];
			this.setList([]);
		}
		this.ownID = user_id;
		this.ownName = user_name;
		this.ownStats = this.getEst("self");

		this.constant = 8 / 3;
		this.maxFF = 3;
		this.minFF = 1;
		this.cutoff = 0.01; // Can't be certain whether it truncates or rounds, use the more conservative estimate
		this.repQuadratic = false;
		if (this.repQuadratic) {
			this.repA = 53 / 990;
			this.repC = 48 / 3;
		} else {
			this.repM = 0.049;
			this.repC = 2.7;
		}
		this.minStats = 400;
		this.multMug = 1 / 2;
		this.multHosp = 3 / 4;
		this.perPage = 50;
	}
	getEst(ID = "self") {
		const val = GM_getValue(`statEstimate_${ID}`);
		return val === undefined ? null : val;
	}
	setEst(ID, estimate) {
		GM_setValue(`statEstimate_${ID}`, estimate);
		console.debug(`Set statEstimate_${ID} to "${estimate}"`);
		return estimate;
	}
	getList() {
		const list = GM_getValue("statEstimate_list");
		return list === undefined ? null : list;
	}
	setList(list) {
		GM_setValue("statEstimate_list", list);
		return list;
	}
	getName(ID) {
		const name = GM_getValue(`name_${ID}`);
		return name === undefined ? null : name;
	}
	setName(ID, name) {
		GM_setValue(`name_${ID}`, name);
		console.debug(`Set name_${ID} to "${name}"`);
		return name;
	}
	calcFairFight(ownStats, theirStats) {
		return Math.min(this.maxFF, Math.max(this.minFF, 1 + this.constant * theirStats / ownStats));
	}
	estimateRep(level, fairFight) {
		return (this.repQuadratic ? Math.pow(level + 1, 2) * this.repA + this.repC : Math.exp(level * this.repM + this.repC)) * fairFight;
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
	AattackedB(knownStatsText, fairFight, knownIsA) {
		const knownChar = knownStatsText[0];
		const knownStats = parseInt(knownStatsText.split(' ')[0].slice(1).replaceAll(',', ""));
		const theirStats = (knownIsA ? this.estimateYouAttacked : this.estimateAttackedYou).bind(this)(knownStats, fairFight);
		if (knownChar === '~') return theirStats;
		else if (knownChar === '>' && fairFight === (knownIsA ? this.minFF : this.maxFF))
			return [];
		else if (knownChar === '<' && fairFight === (knownIsA ? this.maxFF : this.minFF))
			return [];
		return [knownChar, theirStats[1]];
	}
	dontOverride(curStatEst, newStatEst, curChar, newChar) {
		if (curChar === '>' && newChar === '>' && curStatEst > newStatEst)
			return true;
		else if (curChar === '~' && newChar !== '~') {
			if (newChar === '>' && curStatEst > newStatEst) return true;
			else if (newChar === '<' && curStatEst > newStatEst) return true;
		}
		return false;
	}
	colorVal(ownStats, theirStats) {
		return ownStats ? ownStats / (ownStats + theirStats) : 0.5;
	}
	unColorVal(ownStats, theirStats) {
		return ownStats ? 67 * ownStats / (ownStats + theirStats) : 0;
	}
	scriptFunc() {
		$(() => {
			$("#userSearchName").on("input", target => {
				$.get(`/User/SearchName?search=${target.currentTarget.value}`, result => {
					if (result && result.status == 204) {
						$("#userInput").attr("value", "");
						$("#userInputActual").attr("value", "");
						$("#userName").attr("value", "");
					} else {
						$("#userInput").attr("value", result.userId);
						$("#userInputActual").attr("value", result.userId);
						$("#userName").attr("value", result.name.toUpperCase());
					}
					validateSend();
				});
			});

			$("#stats").on("input", () => validateSend());
		});
		function validateSend() {
			let allValid = true;

			if ((typeof $("#userName").attr("value")) === "undefined") {
				allValid = false;
				$("#userInput").removeClass("is-invalid");
			} else if ($("#userName").attr("value") == "") {
				$("#userInput").addClass("is-invalid");
				allValid = false;
			} else $("#userInput").removeClass("is-invalid");

			let statsInput = document.getElementById("stats");
			if (!statsInput) {
				allValid = false;
				$("#stats").removeClass("is-invalid");
			} else if (statsInput.value.length === 0 || !/^\d[\d,]*$/.test(statsInput.value)) {
				$("#stats").addClass("is-invalid");
				allValid = false;
			} else {
				$("#stats").removeClass("is-invalid");
				statsInput.value = parseInt(statsInput.value.replaceAll(',', "")).toLocaleString("en-US");
			}

			if (allValid) $("#addEstimate").attr("disabled", false);
			else $("#addEstimate").attr("disabled", true);
		}
	}
	inStatEstimate(url) {
		document.title = "Stat Estimates | Cartel Empire";
		const ownName = user_name;
		if (!this.ownStats) {
			const errorText = document.querySelector("div.content-container.contentColumn strong");
			errorText.innerHTML = `You haven't set your own stats yet! Visit <a class="text-white" href="/Gym">the gym</a> or <a class="text-white" href="/user">the homepage</a>`;
			return;
		}
		const container = document.querySelector("div.content-container.contentColumn");

		const urlParams = new URLSearchParams(window.location.search);
		const userID = urlParams.get("userId");
		const userName = urlParams.get("userName");
		const statEst = urlParams.get("stats");
		const deleteID = urlParams.get("delete");
		if (ownName !== userName && userID !== null && userName !== null && statEst !== null) {
			this.setEst(userID, `~${statEst} ${Date.now()} 0`);
			if (!this.currentList.includes(parseInt(userID))) {
				this.currentList.push(parseInt(userID));
				this.setList(this.currentList);
			}
			this.setName(userID, userName);
			container.innerHTML = `<div class="col-12 col-md-10"><div class="mb-4 card border-success"><div class="card-body text-center bg-success"><p class="card-text fw-bold text-white">Set the stat estimate for <a class="text-white" href="/User/${userID}">${userName}</a> to ${statEst}</p></div></div></div>`;
			window.history.replaceState({}, document.title, this.statEstimateLink); // remove params from URL
		} else if (deleteID !== null) {
			GM_deleteValue(`statEstimate_${deleteID}`);
			this.currentList = this.currentList.filter(estID => estID !== parseInt(deleteID));
			this.setList(this.currentList);
			const userName = this.getName(deleteID);
			container.innerHTML = `<div class="col-12 col-md-10"><div class="mb-4 card border-success"><div class="card-body text-center bg-success"><p class="card-text fw-bold text-white">Removed the stat estimate for <a class="text-white" href="/User/${deleteID}">${userName}</a></p></div></div></div>`;
			window.history.replaceState({}, document.title, this.statEstimateLink); // remove params from URL
		} else container.innerHTML = "";

		const extractedData = [];
		const ownData = [ownName, "self", '~', this.ownStats, "---", 0];
		extractedData.push(ownData);
		for (const ID of this.currentList) {
			const estimate = this.getEst(ID);
			if (estimate === null) {
				this.currentList = this.currentList.filter(estID => estID !== ID);
				continue;
			}
			const textSplit = estimate.split(' ');
			extractedData.push([this.getName(ID) || "???", ID, estimate[0], parseInt(textSplit[0].slice(1).replaceAll(',', "")), parseInt(textSplit[1]), parseInt(textSplit[2])]);
		}
		extractedData.sort((a, b) => {
			if (a[3] !== b[3]) return b[3] - a[3];
			else if (a[2] === '>' && b[2] !== '>') return -1;
			else if (b[2] === '>' && a[2] !== '>') return 1;
			else if (b[2] === '<' && a[2] !== '<') return -1;
			else if (a[2] === '<' && b[2] !== '<') return 1;
			return 0;
		});
		const ownRank = extractedData.indexOf(ownData);
		const pageNumText = url.replace('#', "").match(/\/\d+\/?$/);
		let pageNum = pageNumText === null ? Math.ceil(ownRank / this.perPage) : parseInt(pageNumText[0].replaceAll('/', ""));
		if (pageNum === 0) pageNum = 1;

		let navHTML = "";
		let insert = "";
		let muted = false;
		let added = false;
		for (let i = (pageNum - 1) * this.perPage; i >= 0 && i < extractedData.length && i !== pageNum * this.perPage; ++i) {
			added = true;
			const data = extractedData[i];
			if (!muted && data[3] < this.ownStats * (this.maxFF - 1) / this.constant)
				muted = true;
			if (data[1] === "self")
				insert += `<tr class="align-middle fw-bold"><td>${i + 1}</td><th><a class="fw-bold" href="/user">${ownName}</a></th><td><span style="color: hsl(60, 67%, ${this.brightness}%)">${this.ownStats.toLocaleString("en-US")}</span></td><td>---</td><td></td></tr>`;
			else {
				insert += `<tr class="align-middle"><td${muted ? " class='text-muted'" : ""}>${i + 1}</td><th><a class="fw-bold" href="/User/${data[1]}">${data[0]}</a></th><td><span class="fw-bold">${data[2] === '~' ? "" : data[2].replace('>', "&gt;").replace('<', "&lt;")}</span><span style="color: hsl(${this.ownStats / (this.ownStats + data[3]) * 120}, 67%, ${this.brightness}%)">${data[3].toLocaleString("en-US")}</span></td>`;
				const dateStr = new Date(data[4]).toLocaleDateString("en-GB", { timeZone: "Europe/London" });
				if (data[5] === 0)
					insert += `<td><span style="color: rgba(var(--bs-link-color-rgb), var(--bs-link-opacity, 1))">${dateStr}</span></td>`;
				else
					insert += `<td><a href="/Fight/${data[5]}">${dateStr}</a></td>`;
				insert += `<td><button onclick="window.location.href += '?delete=${data[1]}'" title="Delete" aria-label="Delete stat estimate for ${data[0]}" class="btn btn-sm btn-outline-dark action-btn fw-normal p-0"><svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" height="20" width="20"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"></path></svg></button></td></tr>`;
			}
		}
		if (!added)
			insert = `<p class="card-text mt-4">You have no estimates</p>`;
		else {
			insert = `<table class="table align-items-center table-flush table-hover dark-tertiary-bg" id="statEstimateTable"><thead class="thead-light"><tr><th>Rank</th><th>Name</th><th>Estimate</th><th class="d-none d-lg-table-cell">Date of Estimate</th><th class="d-table-cell d-lg-none">Date</th><th>Delete</th></tr></thead><tbody>${insert}</tbody></table>`;
			const lastPageNum = Math.ceil(extractedData.length / this.perPage);
			navHTML = `<nav aria-label="Stat Estimates Page"><ul class="pagination justify-content-center"><li class="page-item${pageNum === 1 ? " active" : ""} pageNav"> <a class="page-link" href="${this.statEstimateLink}/1" data-page="1">1</a></li>`;
			if (pageNum >= 5)
				navHTML += `<li class="page-item pageNav"><a class="page-link" href="${this.statEstimateLink}/${pageNum - 1}" data-page="${pageNum - 1}">&lt;- </a></li>`;
			for (let i = Math.max(2, pageNum - 2); i <= Math.min(lastPageNum - 1, pageNum + 2); ++i)
				navHTML += `<li class="page-item${pageNum === i ? " active" : ""} pageNav"> <a class="page-link" href="${this.statEstimateLink}/${i}" data-page="${i}">${i}</a></li>`;
			if (pageNum <= lastPageNum - 4)
				navHTML += `<li class="page-item pageNav"><a class="page-link" href="${this.statEstimateLink}/${pageNum + 1}" data-page="${pageNum + 1}">-&gt; </a></li>`;
			if (lastPageNum !== 1)
				navHTML += `<li class="page-item${pageNum === lastPageNum ? " active" : ""} pageNav"> <a class="page-link" href="${this.statEstimateLink}/${lastPageNum}" data-page="${lastPageNum}">${lastPageNum}</a></li>`;
			navHTML += `</ul></nav>`;
		}

		const script = document.createElement("script");
		script.type = "text/javascript";
		script.innerHTML = this.scriptFunc.toString().replace(/^[^{]*{/, "").replace(/}[^}]*$/, "");
		document.head.appendChild(script);

		const fileInput = document.createElement("input");
		fileInput.id = "fileInput";
		fileInput.type = "file";
		fileInput.classList.add("d-none");
		fileInput.addEventListener("input", async (e) => {
			const file = e.target.files[0];
			if (file.type !== "application/json") return;

			const contentText = await file.text();
			const content = JSON.parse(contentText);
			for (const [userName, userID] of content) {
				if (userID == this.ownID) continue;

				if (userName !== "???" && userName !== this.getName(userID))
					this.setName(userID, userName);
				const curEst = this.getEst(userID);
				if (curEst !== null || entry[4] <= parseInt(curEst.split(' ')[1])) continue;

				this.setEst(userID, `${entry[2]}${entry[3].toLocaleString("en-US")} ${entry[4]} ${entry[5]}`);
				if (this.currentList.includes(userID)) continue;

				this.currentList.push(userID);
				this.setList(this.currentList);
			}
			window.location.reload();
		});

		const exportText = JSON.stringify(extractedData.filter(data => data[1] !== "self"));
		const fileBlob = new Blob([exportText], { type: "application/octet-binary" });
		const exportURL = window.URL.createObjectURL(fileBlob);
		const exportImport = `<div class="row align-items-center mb-4"><span class="text-center fw-bold">Export/Import Estimates</span></div><div class="row align-items-center mx-2 mb-2"><a class="btn btn-outline-dark w-100" href="${exportURL}" download="stat_estimates.json">Export</a></div><div class="row align-items-center mx-2 mb-2"><a class="btn btn-outline-dark w-100" onclick="document.getElementById('fileInput').click()">Import and Merge</a></div>`;
		const newEntryHTML = `<div class="row"><div class="col-12 col-sm-8 mb-3"><form id="addEstimateForm" class="mt-auto"><div class="row align-items-center mb-2"><div class="col-12 col-sm-3"><label class="form-label fw-bold" for="userId" id="searchLabel">Search</label></div><div class="col-12 col-sm-9"><div class="input-group"> <input class="form-control" type="text" placeholder="Diablo" autofill="false" id="userSearchName"></div></div></div><div class="row align-items-center mb-2"><div class="col-12 col-sm-3"><label class="form-label fw-bold" for="userId" id="usernameLabel">Player</label></div><div class="col-12 col-sm-9"><div class="input-group"> <input class="form-control is-invalid" name="userId" type="number" placeholder="1" min="1" disabled="" id="userInput" value=""><input class="form-control d-none" name="userId" type="number" placeholder="1" min="1" id="userInputActual" value=""><input class="form-control" name="userName" type="text" placeholder="Diablo" id="userName" value="" readonly></div></div></div><div class="row align-items-center"><div class="col-12 col-sm-3"><label class="form-label fw-bold" for="stats">Stats</label></div><div class="col-12 col-sm-9"><input class="form-control is-invalid" name="stats" type="text" placeholder="Enter player's stats" maxlength="20" required="true" autofill="false" id="stats"></div></div><input class="btn btn-outline-dark w-100 mt-4" type="submit" value="Add estimate" disabled="" id="addEstimate"></form></div><div class="col-12 col-sm-4">${exportImport}</div></div>`;
		container.innerHTML += `<div class="col-12 col-md-10"><div class="card mb-2"><div class="row mb-0"><div class="col-12"><div class="header-section"><h2>Battlestat Estimates</h2></div></div></div><div class="card-body">${newEntryHTML}<hr><div class="tab-pane fade active show" role="tabpanel"><div class="row mb-2 align-items-center">${navHTML}<div class="container">${insert}</div></div></div></div></div></div>`;
		container.appendChild(fileInput);
	}
	inSearch(url) {
		const table = document.querySelector("#userTable");

		const tableHeadTr = table.querySelector("thead tr");
		let ageCol = tableHeadTr.querySelectorAll("th")[2];
		let statEstCol = document.createElement("th");
		statEstCol.setAttribute("scope", "col");
		statEstCol.innerText = "Stat Estimate";
		tableHeadTr.insertBefore(statEstCol, ageCol);

		const entries = table.querySelectorAll("tbody tr");
		for (const entry of entries) {
			ageCol = entry.querySelectorAll("td")[1];
			statEstCol = document.createElement("td");

			const userLink = entry.querySelector("th").children[1];
			const userID = userLink.href.match(/\d+$/)[0];

			const statEst = this.getEst(userID);
			if (statEst !== null) {
				const theirStatsText = statEst.split(' ')[0];
				const theirStats = parseInt(theirStatsText.slice(1).replaceAll(',', ""));
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(${this.colorVal(this.ownStats, theirStats) * 120}, 67%, ${this.brightness}%); text-decoration: none">${theirStatsText.replace('>', "&gt;").replace('<', "&lt;")}</a>`;

				const userName = userLink.textContent; // Don't really need username of everyone
				if (userName !== this.getName(userID))
					this.setName(userID, userName);
			} else if (userID === this.ownID && this.ownStats)
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(60, 67%, ${this.brightness}%); text-decoration: none">${this.ownStats.toLocaleString("en-US")}</a>`;
			else {
				statEstCol.classList.add("text-muted");
				statEstCol.textContent = "---";
			}
			entry.insertBefore(statEstCol, ageCol);
		}
	}
	inBountyOrOtherCartel(url) {
		const table = document.querySelector("div.table-responsive table.table");
		if (table === null) return;

		const tableHeadTr = table.querySelector("thead tr");
		let levelCol = tableHeadTr.querySelectorAll("th")[1];
		let statEstCol = document.createElement("th");
		if (/^cartel/.test(url)) statEstCol.setAttribute("scope", "col");

		statEstCol.innerText = "Stat Estimate";
		tableHeadTr.insertBefore(statEstCol, levelCol);

		let entries;
		let start = 0;
		let linkIdx = 1;
		if (/^cartel/.test(url)) {
			entries = table.querySelectorAll("tbody tr");
			if (/\d\/?$/.test(url)) linkIdx = 0;
		} else {
			entries = table.querySelectorAll("thead tr");
			start = 1;
			linkIdx = 0;
		}
		for (let i = start; i !== entries.length; ++i) {
			const entry = entries[i];
			const tds = entry.querySelectorAll("td");
			levelCol = tds[1];
			statEstCol = document.createElement("td");

			const userLink = tds[0].querySelector('a');
			const userID = userLink.href.match(/\d+$/)[0];

			const statEst = this.getEst(userID);
			if (statEst !== null) {
				const theirStatsText = statEst.split(' ')[0];
				const theirStats = parseInt(theirStatsText.slice(1).replaceAll(',', ""));
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(${this.colorVal(this.ownStats, theirStats) * 120}, 67%, ${this.brightness}%); text-decoration: none">${theirStatsText.replace('>', "&gt;").replace('<', "&lt;")}</a>`;

				const userName = userLink.textContent; // Don't really need username of everyone
				if (userName !== this.getName(userID))
					this.setName(userID, userName);
			} else if (userID === this.ownID && this.ownStats)
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(60, 67%, ${this.brightness}%); text-decoration: none">${this.ownStats.toLocaleString("en-US")}</a>`;
			else {
				statEstCol.classList.add("text-muted");
				statEstCol.innerText = "---";
			}
			entry.insertBefore(statEstCol, levelCol);
		}
	}
	inCartelHomepage(url) {
		const table = document.querySelector("div.card-body > div.container-fluid");
		if (table === null) return;

		const tableHead = table.querySelector(".row-header");
		let levelCol = tableHead.querySelectorAll(".col")[1];
		let roleCol;
		let daysCol = tableHead.querySelectorAll(".col")[2];

		let statEstCol = document.createElement("div");
		statEstCol.classList.add("col", "col-xl-1");
		statEstCol.innerText = "Stat Estimate";
		tableHead.insertBefore(statEstCol, levelCol);

		levelCol.classList.remove("col-xl-2");
		levelCol.classList.add("col-xl-1");
		daysCol.classList.remove("col-xl-2");
		daysCol.classList.add("col-xl-1");

		const entries = table.querySelectorAll(".row.align-middle");
		for (const entry of entries) {
			const cols = entry.querySelectorAll(".col");

			levelCol = cols[0];
			roleCol = cols[1];
			daysCol = cols[2];

			statEstCol = document.createElement("div");
			const statEstColHeader = document.createElement("div");
			statEstCol.classList.add("col", "col-3", "col-xl-1");

			statEstColHeader.classList.add("col-3", "d-xl-none", "fw-bold");
			levelCol.classList.remove("col-xl-2", "col-3");
			levelCol.classList.add("col-xl-1", "col-2");
			daysCol.classList.remove("col-xl-2", "col-3");
			daysCol.classList.add("col-xl-1", "col-2");
			roleCol.classList.remove("col-3");
			roleCol.classList.add("col-2");
			
			statEstColHeader.innerText = "Stat Estimate";

			const userLink = entry.querySelector('a');
			const userID = userLink.href.match(/\d+$/)[0];

			const statEst = this.getEst(userID);
			if (statEst !== null) {
				const theirStatsText = statEst.split(' ')[0];
				const theirStats = parseInt(theirStatsText.slice(1).replaceAll(',', ""));
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(${this.colorVal(this.ownStats, theirStats) * 120}, 67%, ${this.brightness}%); text-decoration: none">${theirStatsText.replace('>', "&gt;").replace('<', "&lt;")}</a>`;

				const userName = userLink.innerText; // Don't really need username of everyone
				if (userName !== this.getName(userID))
					this.setName(userID, userName);
			} else if (userID === this.ownID && this.ownStats)
				statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="color: hsl(60, 67%, ${this.brightness}%); text-decoration: none">${this.ownStats.toLocaleString("en-US")}</a>`;
			else {
				statEstCol.classList.add("text-muted");
				statEstCol.innerText = "---";
			}
			entry.insertBefore(statEstCol, levelCol);
		}
	}
	inCartelWar(url) {
		const war = document.querySelector("div#warReportModule");
		let cols = war.querySelectorAll("div.col-12.col-lg-6");
		cols[0].classList.remove("col-lg-6");
		cols[0].classList.add("col-lg-7");
		cols[1].classList.remove("col-lg-6");
		cols[1].classList.add("col-lg-5");

		const theirTable = cols[0].querySelector("table.table");
		const tableHeadTr = theirTable.querySelector("thead tr");
		let levelCol = tableHeadTr.querySelectorAll("th")[1];

		let statEstCol = document.createElement("th");
		statEstCol.setAttribute("scope", "col");
		statEstCol.innerText = "Stat Estimate";
		tableHeadTr.insertBefore(statEstCol, levelCol);

		const tableBody = theirTable.querySelector("tbody");

		observeDOM(theirTable, e => {
			if (e[0].target !== tableBody) return;

			const trs = tableBody.querySelectorAll("tr");
			for (const tr of trs) {
				const tds = tr.querySelectorAll("td");
				levelCol = tds[1];
				statEstCol = document.createElement("td");

				const statusCol = tds[2];
				if (statusCol.innerText === "Active") // Highlight actives in war
					statusCol.classList.add("fw-bold");
				else
					statusCol.classList.add("text-muted");

				const userLink = tds[0].querySelector('a');
				const userID = userLink.href.match(/\d+$/)[0];

				const statEst = this.getEst(userID);
				if (statEst !== null) {
					const theirStatsText = statEst.split(' ')[0];
					const theirStats = parseInt(theirStatsText.slice(1).replaceAll(',', ""));
					statEstCol.innerHTML = `<a href="${this.statEstimateLink}" style="text-decoration: none">${theirStatsText.replace('>', "&gt;").replace('<', "&lt;")}</a>`;

					const userName = userLink.innerText;
					if (userName !== this.getName(userID))
						this.setName(userID, userName);
				} else {
					statEstCol.classList.add("text-muted");
					statEstCol.innerText = "---";
				}
				tr.insertBefore(statEstCol, levelCol);
			}
		});
	}
	inHomepage(url) {
		try {
			// Grab the stats container and rows
			const stats = document.querySelectorAll("div.mb-4.card.flex-fill")[1];
			const statRows = stats?.querySelectorAll(".row.align-items-center.gy-2.mb-2");

			// Ensure stats and rows are found
			if (!stats || statRows?.length <= 0) {
				console.error("Stats or stat rows not found");
				return;
			}
			const fifthSpan = statRows[0].querySelector("div:last-of-type > p"); // Get last p in the first row
			const statText = (fifthSpan.lastChild ?? fifthSpan)?.textContent.replace(/\D/g, "");
			const statValue = statText ? parseInt(statText, 10) : 0;

			// If value has changed, update
			if (this.ownStats === statValue || statValue === 0) return;

			console.info("Updating ownStats");
			this.setEst("self", statValue);
		} catch (error) {
			console.error("Error in inHomepage:", error);
		}
	}
	inGym(url) {
		const totalStats = document.querySelector("p.card-text.fw-bold.text-muted"); // Total is the first one
		if (totalStats === null) return;

		const totalStatsVal = parseInt(totalStats.textContent.split(' ')[0].slice(1).replaceAll(',', ""));

		if (this.ownStats !== totalStatsVal) this.setEst("self", totalStatsVal);
	}
	inFight(url) {
		const showEsts = (nameA, nameB, A_ID, B_ID, Anew = false, Bnew = false) => {
			let container = document.querySelector("div.contentColumn");
			const fightReport = container.querySelector("div.col-12.col-md-10");
			let ests = document.createElement("div");
			ests.classList.add("col-12", "col-md-10");
			const estA = A_ID === "self" ? (this.ownStats ? this.ownStats.toLocaleString("en-US") : "???") : (this.getEst(A_ID) || "???");
			const estB = this.getEst(B_ID) || "???";
			let inner = `<div class="row"><div class="col-md-6 col-12"><div class="mb-4 card"><div class="row mb-0"><div class="col-12"><div class="header-section text-center"><h2>`;
			inner += nameA === "You" ? "You" : `<a class="text-white" href="/${A_ID === "self" ? "user" : ("User/" + A_ID)}">${nameA}</a>`;
			inner += `</h2></div></div></div><div class="card-body"><p class="card-text text-center">Stat estimate: `;
			if (estA === "???") inner += `<span class="text-muted">???</span>`;
			else {
				const Astats = parseInt(estA.split(' ')[0].replace(/[,<>~]/g, ""));
				inner += `<span class="fw-bold" style="color: hsl(${this.colorVal(this.ownStats, Astats) * 120}, 67%, ${this.brightness}%)">${estA.split(' ')[0].replace('>', "&gt;").replace('<', "&lt;")}</span>${Anew ? " (new)" : ""}`;
			}
			inner += `</p></div></div></div><div class="col-md-6 col-12"><div class="mb-4 card"><div class="row mb-0"><div class="col-12"><div class="header-section text-center"><h2><a class="text-white" href="/${"User/" + B_ID}">${nameB}</a></h2></div></div></div><div class="card-body"><p class="card-text text-center">Stat estimate: `;
			if (estB === "???") inner += `<span class="text-muted">???</span>`;
			else {
				const Bstats = parseInt(estB.split(' ')[0].replace(/[,<>~]/g, ""));
				inner += `<span class="fw-bold" style="color: hsl(${this.colorVal(this.ownStats, Bstats) * 120}, 67%, ${this.brightness}%)">${estB.split(' ')[0].replace('>', "&gt;").replace('<', "&lt;")}</span>${Bnew ? " (new)" : ""}`;
			}
			inner += `</p></div></div></div></div>`;
			ests.innerHTML = inner;
			container.insertBefore(ests, fightReport);
		};

		const firstRow = document.querySelector("div.fightTable tbody tr td");
		const youAttacked = firstRow.textContent.startsWith("You ");
		const attackedYou = firstRow.textContent.endsWith(" you");
		const estimate = youAttacked ? this.estimateYouAttacked.bind(this) : attackedYou ? this.estimateAttackedYou.bind(this) : this.AattackedB.bind(this);

		const headers = document.querySelectorAll("div.card-body p.card-text.fw-bold");
		if (!this.ownStats || headers.length < 3 || (headers[0].textContent.split(' ')[2] === "Loss" && !attackedYou)) {
			if (firstRow.children.length === 1) {
				const other = firstRow.children[0];
				showEsts("You", other.textContent, "self", other.href.match(/\d+$/)[0]);
			} else {
				const userA = firstRow.children[0];
				const userB = firstRow.children[1];
				showEsts(userA.textContent, userB.textContent, userA.href.match(/\d+$/)[0], userB.href.match(/\d+$/)[0]);
			}
			return;
		}
		const fairFightText = headers[1];
		const fairFight = parseFloat(fairFightText.children[0].textContent.slice(1));
		const dateText = headers[headers.length - 1].textContent.slice(7).split(/[ :\/]/g);
		const fightDate = Date.UTC(dateText[5], parseInt(dateText[4]) - 1, dateText[3], dateText[0], dateText[1], dateText[2]);

		let fightID = url.replace('#', "").match(/\d+\/?$/)[0];
		if (fightID.endsWith('/')) fightID = fightID.slice(0, -1);

		// Method: replace old log with new log, but only if it's more extreme OR specific
		if (youAttacked || attackedYou) {
			const userLink = firstRow.children[0];
			const againstID = userLink.href.match(/\d+$/)[0];
			const currentEstimate = this.getEst(againstID);

			const userName = userLink.textContent;
			if (userName !== this.getName(againstID))
				this.setName(againstID, userName);

			if (currentEstimate === null || fightDate > parseInt(currentEstimate.split(' ')[1])) {
				const est = estimate(this.ownStats, fairFight);
				const newStatEst = parseInt(est[1].replace(',', ""));
				if (currentEstimate !== null) {
					const curStatEst = parseInt(currentEstimate.split(' ')[0].slice(1).replace(',', ""));
					if (this.dontOverride(curStatEst, newStatEst, currentEstimate[0], est[0])) {
						showEsts("You", userName, "self", againstID);
						return;
					}
				}

				this.setEst(againstID, `${est[0]}${est[1]} ${fightDate} ${fightID}`);
				if (!this.currentList.includes(parseInt(againstID))) {
					this.currentList.push(parseInt(againstID));
					this.setList(this.currentList);
				}
			}
			showEsts("You", userName, "self", againstID, false, true);
		} else {
			// Indirect attack logs
			const userA = firstRow.children[0];
			const userB = firstRow.children[1];
			const A_ID = userA.href.match(/\d+$/)[0];
			const B_ID = userB.href.match(/\d+$/)[0];
			const Astats = this.getEst(A_ID);
			const Bstats = this.getEst(B_ID);
			if (Astats !== null && Bstats !== null) {
				const Adate = parseInt(Astats.split(' ')[1]);
				const Bdate = parseInt(Bstats.split(' ')[1]);
				if (Adate === Bdate || fightDate <= Adate || fightDate <= Bdate) {
					showEsts(userA.textContent, userB.textContent, A_ID, B_ID);
					return;
				}

				const newerStats = Adate > Bdate ? Astats : Bstats;
				const otherEst = estimate(newerStats, fairFight, Adate > Bdate);
				if (otherEst.length === 0) {
					showEsts(userA.textContent, userB.textContent, A_ID, B_ID);
					return;
				}
				const oldEst = Adate > Bdate ? Bstats : Astats;
				console.info(parseInt(oldEst.split(' ')[0].slice(1).replaceAll(',', "")), parseInt(otherEst[1].replaceAll(',', "")), oldEst[0], otherEst[0]);
				if (this.dontOverride(parseInt(oldEst.split(' ')[0].slice(1).replaceAll(',', "")), parseInt(otherEst[1].replaceAll(',', "")), oldEst[0], otherEst[0])) {
					showEsts(userA.textContent, userB.textContent, A_ID, B_ID);
					return;
				}
				const otherID = Adate > Bdate ? B_ID : A_ID;
				this.setEst(otherID, `${otherEst[0]}${otherEst[1]} ${newerStats.split(' ')[1]} ${fightID}`);
				if (!this.currentList.includes(parseInt(otherID))) {
					this.currentList.push(parseInt(otherID));
					this.setList(this.currentList);
				}
				showEsts(userA.textContent, userB.textContent, A_ID, B_ID, Adate <= Bdate, Adate > Bdate);
			} else if ((Astats !== null && Bstats === null) || (Astats === null && Bstats !== null)) {
				const knownStats = Astats !== null ? Astats : Bstats;
				const knownDate = parseInt(knownStats.split(' ')[1]);
				if (fightDate <= knownDate) {
					showEsts(userA.textContent, userB.textContent, A_ID, B_ID);
					return;
				}

				const otherEst = estimate(knownStats, fairFight, Astats !== null);
				if (otherEst.length === 0) {
					showEsts(userA.textContent, userB.textContent, A_ID, B_ID);
					return;
				}
				const otherID = Astats !== null ? B_ID : A_ID;
				this.setEst(otherID, `${otherEst[0]}${otherEst[1]} ${knownDate} ${fightID}`);
				if (!this.currentList.includes(parseInt(otherID))) {
					this.currentList.push(parseInt(otherID));
					this.setList(this.currentList);
				}
				showEsts(userA.textContent, userB.textContent, A_ID, B_ID, Astats === null, Astats !== null);
				const otherUser = Astats !== null ? userB : userA;
				const userName = otherUser.textContent;
				if (userName !== this.getName(otherID))
					this.setName(otherID, userName);
			}
			else
				showEsts(userA.textContent, userB.textContent, A_ID, B_ID);
		}
	}
	inUserProfile(url) {
		let userID = url.replace('#', "").match(/\d+\/?$/)[0];
		if (userID.endsWith('/')) userID = userID.slice(0, -1);
		if (userID === this.ownID) return;

		const statsTable = document.querySelector("div.card-body tbody");
		const estimate = this.getEst(userID);

		const attackText = document.querySelector("div#attackConfirmModal p.card-text");
		const level = parseInt(statsTable.children[4].children[1].textContent);
		const repMultipliers = {
			Attack: 1,
			Mug: this.multMug,
			Hospitalise: this.multHosp
		};
		let prefix = "";
		let append = "";
		let expectedRep = 0;

		if (estimate !== null) {
			const textSplit = estimate.split(' ');
			const statEstimate = textSplit[0];
			const date = new Date(parseInt(textSplit[1])).toLocaleDateString("en-GB", { timeZone: "Europe/London" });

			const theirStats = parseInt(statEstimate.slice(1).replaceAll(',', ""));
			statsTable.innerHTML += `<tr><th>Stat Estimate:</th><td><a href="${this.statEstimateLink}" class="fw-bold" style="color: hsl(${this.colorVal(this.ownStats, theirStats) * 120}, 67%, ${this.brightness}%)">${statEstimate.replace('>', "&gt;").replace('<', "&lt;")}</a> (${date})</td></tr>`;

			expectedRep = this.ownStats ? this.estimateRep(level, this.calcFairFight(this.ownStats, theirStats)) : "???";
			prefix = statEstimate[0].replace('~', "");
		} else {
			statsTable.innerHTML += `<tr><th>Stat Estimate:</th><td><a href="${this.statEstimateLink}" class="text-muted">No attacks recorded</a></td></tr>`;
			expectedRep = this.estimateRep(level, this.maxFF);
			append = " with 3x fair fight modifier";
		}
		observeDOM(attackText, e => {
			const textSplit = e[0].target.textContent.split(' ');
			let attackType = textSplit[textSplit.length - 2];
			attackType = attackType.charAt(0).toUpperCase() + attackType.slice(1);
			if (!["Attack", "Mug", "Hospitalise"].includes(attackType))
				return;
			e[0].target.innerHTML += `<br>Expected rep gain: <span class="fw-bold">${prefix.replace('>', "&gt;").replace('<', "&lt;")}${expectedRep === "???" ? "???" : Math.round(expectedRep * repMultipliers[attackType])}</span>${append}`;
		});

		const userName = document.querySelector("div.header-section > .profileNameTitle").textContent;
		if (userName !== this.getName(userID)) this.setName(userID, userName);
	}
	inEvents(url) {
		const urlParams = new URLSearchParams(window.location.search);
		const category = urlParams.get("filter");
		if (category !== "Attack") return;

		const eventList = document.querySelector("div.container.eventWrapper").children;
		for (let i = 2; i !== eventList.length; ++i) {
			const ev = eventList[i];
			ev.children[0].classList.value = "col-2 col-lg-2 col-md-2 col-sm-2"; //"col-2 col-lg-2 col-md-2 col-sm-2";
			ev.children[1].classList.value = "col-5 col-lg-6 col-md-7 col-sm-7"; //"col-5 col-lg-6 col-md-5 col-sm-6";
			ev.children[2].classList.value = "col-3 col-lg-2 d-none d-lg-inline"; //"col-3 col-lg-2 col-md-3 col-sm-2";

			const estCol = document.createElement("div");
			const mergedCol = document.createElement("div");
			estCol.classList.value = "col-2 col-lg-2 d-none d-lg-inline"; //"col-2 col-lg-2 col-md-2 col-sm-2";
			mergedCol.classList.value = "col-3 col-md-3 col-sm-3 d-lg-none"; // new

			if (i === 2) {
				estCol.textContent = "Stat Estimate";
				mergedCol.textContent = "Date/Est";
				ev.insertBefore(estCol, ev.children[2]);
				ev.appendChild(mergedCol);
				continue;
			}
			const userID = parseInt(ev.children[1].querySelector("a").href.match(/\d+$/)[0]);
			const theirStats = this.getEst(userID);
			if (theirStats !== null) {
				estCol.style.color = `hsl(${this.colorVal(this.ownStats, parseInt(theirStats.split(' ')[0].slice(1).replaceAll(',', ""))) * 120}, 67%, ${this.brightness}%)`;
				estCol.textContent = theirStats.split(' ')[0];
				mergedCol.innerHTML = `${ev.children[2].textContent}<br><span style="color: ${estCol.style.color}">${estCol.innerText}</span>`;
			} else {
				estCol.classList.add("text-muted");
				estCol.textContent = "???";
				mergedCol.innerHTML = `${ev.children[2].textContent}<br><span class="text-muted">${estCol.textContent}</span>`;
			}
			ev.insertBefore(estCol, ev.children[2]);
			ev.appendChild(mergedCol);
		}
	}
}
