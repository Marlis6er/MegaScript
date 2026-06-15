class CartelMemberRep {
	constructor() {
		this.attackList = this.getAttackList();
		if (this.attackList === null) {
			this.attackList = [];
			this.setAttackList(this.attackList);
		}
	}
	getAttackList() {
		const list = GM_getValue("cartelMemberRep_attackList");
		return list === undefined ? null : list;
	}
	setAttackList(list) {
		GM_setValue("cartelMemberRep_attackList", list);
		console.debug(`Set cartelMemberRep_attackList to ${JSON.stringify(list)}`);
		return list;
	}
	getMemberRep(memberID) {
		const rep = GM_getValue(`cartelMemberRep_${memberID}`);
		return rep === undefined ? null : rep;
	}
	setMemberRep(memberID, rep) {
		GM_setValue(`cartelMemberRep_${memberID}`, rep);
		console.debug(`Set cartelMemberRep_${memberID} to ${rep.toLocaleString("en-US")}`);
		return rep;
	}
	processLogs(rows) {
		for (var row of rows) {
			let [date, data] = row.children;
			const ID = parseInt(data.children[2].href.match(/\d+/)[0]);
			if (!/\(\+\d+\)/.test(data.innerText)) {
				date.classList.add("text-muted"); // Doesn't need to be done
				continue;
			} else if (this.attackList.includes(ID)) {
				date.classList.add("text-muted"); // Signal that it's already been done
				continue;
			}
			this.attackList.push(ID);
			this.setAttackList(this.attackList);

			const rep = parseInt(/\(\+(\d+)\)/.exec(data.innerText)[1]);
			const attackerID = data.children[0].href.match(/\d+/)[0];
			const oldRep = this.getMemberRep(attackerID);
			this.setMemberRep(attackerID, oldRep === null ? rep : oldRep + rep);
		}
	}
	inAttackLog(url) {
		let rows = document.querySelectorAll("table#eventsTable tbody tr");
		this.processLogs(rows);
	}
	inCartelHomepage(url) {
		const attackTable = document.querySelectorAll("table#eventsTable tbody")[1];
		let rows = attackTable.querySelectorAll("tr");
		this.processLogs(rows);

		const table = document.querySelector("div.card-body > div.container-fluid");
		if (table === null) return;

		const tableHead = table.querySelector(".row-header");
		let levelCol = tableHead.querySelectorAll(".col")[2]; // Already reduced to col-xl-1 by stat estimate
		let roleCol = tableHead.querySelectorAll(".col")[3];
		let repCol = document.createElement("div");
		repCol.classList.add("col", "col-xl-1");
		repCol.innerText = "Added Rep";
		tableHead.insertBefore(repCol, levelCol);
		roleCol.classList.remove("col-xl-2");
		roleCol.classList.add("col-xl-1");

		let entries = table.querySelectorAll(".row.align-middle");
		for (var i = 0; i !== entries.length; ++i) {
			let entry = entries[i];
			const cols = entry.querySelectorAll(".col");
			levelCol = cols[2];
			roleCol = cols[3];
			repCol = document.createElement("div");
			repCol.classList.add("col", "col-xl-1");
			roleCol.classList.remove("col-xl-2");
			roleCol.classList.add("col-xl-1");

			const userLink = cols[0].children[1];
			const userID = userLink.href.match(/\d+$/)[0];

			const rep = this.getMemberRep(userID);
			repCol.innerText = rep === null ? 0 : rep.toLocaleString("en-US");
			entry.insertBefore(repCol, levelCol);
		}
	}
}
