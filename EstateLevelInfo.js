class EstateLevelInfo {

	static metadata = {
		displayName: 'Estate Level Info',
		description: 'Display bonus effects of upgrades',
		settings: {
			active: {
				inEstateAgent: {
					description: 'Display bonus effects of upgrades'
				}
			},
			custom: {
			}
		}
	}

	constructor() {
		const configManger = ConfigManager.getInstance();
		this.brightness = configManger.darkmode ? 50 : 45;

		this.prefixes = ["", "", POUND, '-', '+', '+', '+'];
		this.postfixes = ["", "", 'M', '%', '%', " INT", '%'];
		this.values = Object.values(GameData.ESTATE_BONUS_VALUES);
		// [
		// 	[], // Plot cost, nothing to process here
		// 	[], // Best house type, nothing to process here
		// 	[0, 10, 50, 150, 250, 500, 2000, 5000], // Max safe, between 0 and 5bil
		// 	[0, 1, 2, 4, 6, 8, 10], // Uni course time reduction, between 0% and 10%
		// 	[0, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75], // Gym bonus, between 0% and 0.75%
		// 	[0, 50, 100, 150, 200], // Intelligence cap bonus, between 0 and 200 int
		// 	[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.75] // Int gain bonus, between 0% and 0.75%
		// ];
	}
	inEstateAgent(url) {
		const containers = document.querySelectorAll("#v-content-plots div.accordion-body");

		for (const container of containers) {
			const level_elems = container.querySelectorAll("div.col-6 p:not(.mb-0)");
			for (let [j, level_elem] of level_elems.entries()) {
				// Don't process cost and best house type
				if (j < 2) continue;
				const upgrade_index = j - 2;
				const level = parseInt(level_elem?.textContent || '0');
				
				const val = this.values[upgrade_index][level];
				if (val === undefined) return;

				if (upgrade_index !== 5) {
					const colorVal = val / this.values[upgrade_index][this.values[upgrade_index].length - 1];
					level_elem.innerHTML += ` <span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">(${this.prefixes[j]}${val.toLocaleString("en-US")}${this.postfixes[j]})</span>`;
					continue;
				}

				// upgrade 5 is dock, use level / maxlevel for color instead
				const colorVal = level / this.values[upgrade_index].length;
				level_elem.innerHTML += ` <span style="color: hsl(${colorVal * 120}, 67%, ${this.brightness}%)">(${this._format_dock_upgrade_str(this.values[upgrade_index][level])})</span>`
			}
		}
	}
	_format_dock_upgrade_str(dock_upgrades){
		const result = [];
		for (const [upgrade, bonus] of Object.entries(dock_upgrades)) {
			switch (upgrade) {
				case 'shop_bonus':
					result.push(`+${bonus} daily shop limit`);
					break;
				case 'exped_bonus':
					result.push(`+${bonus} expedition limit`);
					break;
				case 'personal_smuggling':
					result.push('unlock personal smuggling');
					break;
				default: break;
			}
		}
		return result.join(', ');
	}
}
