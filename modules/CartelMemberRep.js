class CartelMemberRep {

	static metadata = {
		displayName: 'Cartelmember Reputation',
		description: 'Display how much reputation each member earned',
		settings: {
			active: {
				inAttackLog: {
					description: 'Store the reputation earned by each member'
				},
				inCartel: {
					description: 'Display the reputation earned by each member'
				},
			},
			custom: {
			}
		}
	}

	constructor() {
		this.attackList = this.getAttackList();
		if (this.attackList === null) {
			this.attackList = [];
			this.setAttackList(this.attackList);
		}
	}
	getAttackList() {
		return getValue('cartelMemberRep', 'attackList');
	}
	setAttackList(list) {
		setValue('cartelMemberRep', 'attackList', list);
		console.debug(`Set cartelMemberRep_attackList to ${JSON.stringify(list)}`);
		return list;
	}
	getMemberRep(memberID) {
		return getNumericValue('cartelMemberRep', memberID);
	}
	setMemberRep(memberID, rep) {
		setValue('cartelMemberRep', memberID, rep);
		console.debug(`Set cartelMemberRep_${memberID} to ${rep.toLocaleString("en-US")}`);
		return rep;
	}
	processLogs(rows) {
		for (const row of rows) {
			const [date, data] = row.children;
			const ID = parseInt(data.children[2].href.match(/\d+/)[0]);
			if (!/\(\+\d+\)/.test(data.textContent)) {
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
		const rows = document.querySelectorAll("table#eventsTable tbody tr");
		if (rows?.length <= 0) return;
		
		this.processLogs(rows);
	}
	inCartel(url) {
		const attackTable = document.querySelectorAll("table#eventsTable tbody")[1];
		const rows = attackTable.querySelectorAll("tr");
		this.processLogs(rows);

		const table = document.querySelector("div.card-body > div.container-fluid");
		if (table === null) return;

		const tableHead = table.querySelector(".row-header");
		let levelCol = tableHead.querySelectorAll(".col")[1]; // Already reduced to col-xl-1 by stat estimate
		let roleCol = tableHead.querySelectorAll(".col-3")[0];
		let daysCol = tableHead.querySelectorAll('.col')[3];
		let repCol = document.createElement("div");
		repCol.classList.add("col", "col-xl-1");
		repCol.innerText = "Added Rep";
		tableHead.insertBefore(repCol, levelCol);
		roleCol.classList = 'col-3 col-xl-2';
		daysCol.classList = 'col col-xl-1';

		const entries = table.querySelectorAll(".row.align-middle");
		for (const entry of entries) {
			const cols = entry.querySelectorAll(".col");
			levelCol = cols[0];
			roleCol = cols[3];
			repCol = document.createElement("div");
			repCol.classList.add("col", "col-xl-1");
			roleCol.classList.remove("col-xl-2");
			roleCol.classList.add("col-xl-1");

			const userLink = entry.querySelector('div.d-none > a');
			const userID = userLink.href.match(/\d+$/)[0];

			const rep = this.getMemberRep(userID);
			repCol.innerText = rep === null ? 0 : rep.toLocaleString("en-US");
			entry.insertBefore(repCol, levelCol);
		}
	}
}
