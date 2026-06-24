class ExpeditionChances {
	constructor() { }
	inExpeditions(URL) {
		const teamStats = this.getTeamStats();

		const expeds = document.querySelectorAll(".expeditionButton");
		for (const exped of expeds) {
			// Skip active missions
			if (exped.children.length < 5) continue;

			const teamChances = this.getTeamChances(exped, teamStats);

			teamChances.forEach((c, i) => {
				console.debug(`Success chance of team ${i + 1}: ${c * 100}`);
			});

			this.updateUI(exped, teamChances);
		}
	}
	getTeamStats() {
		const teamStats = [[], [], [], [], []];
		for (let team_i = 0; team_i < teamStats.length; team_i++) {
			const stats = document.querySelectorAll(`#v-content-team${team_i + 1} > .justify-content-center span:not(.fw-bold)`);
			if (stats.length !== 4) return;

			for (const statElem of stats) {
				const statText = statElem.textContent.replaceAll(',', "");
				const stat = parseInt(statText);
				teamStats[team_i].push(stat);
			}
		}
		return teamStats;
	}
	getTeamChances(exped, teamStats) {
		const chances = [1, 1, 1, 1, 1];
		const statElements = exped.querySelectorAll(`div.col-5 > div.card-text`);

		// Don't factor in speed (last value) since it only affects expedition time not success rate
		for (let i = 0; i < 3; ++i) {
			const statText = statElements[i].textContent.replaceAll(',', "");
			const stat = parseInt(statText);
			for (const team_i in chances)
				chances[team_i] = Math.min(chances[team_i], teamStats[team_i][i] / stat);
		}
		return chances;
	}
	updateUI(exped, chances) {
		const options = exped.querySelectorAll("select.expeditionTeamSelector option");
		for (const opt of options) {
			const team_i = parseInt(opt.value);
			if (team_i === 0) continue;

			opt.textContent += ` - ${Math.floor(chances[team_i - 1] * 100)}%`;
		}
	}
}
