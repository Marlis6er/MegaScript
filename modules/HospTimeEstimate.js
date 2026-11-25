class HospTimeEstimate {

	static metadata = {
		displayName: 'Hospital Time Estimate',
		description: 'Show the expected hospital time when attacking someone',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() {
        
        const hospTimePerk = getNumericValue('perks', 'Hospital Time') || 0;
        const hospTimeMultiplier = 1 + (hospTimePerk / 100);

        this.defaultTimes = {
			Attack: 50,
			Mug: 12.5,
			Hospitalise: 100 * hospTimeMultiplier
		}
	}

	inUserProfile(url) {
		this._updateModal();
    }
	inConnections(url) {
		this._updateModal();
    }
	_updateModal() {
        const attackConfirmModal = document.getElementById('attackConfirmModal');
        attackConfirmModal.addEventListener('show.bs.modal', async (event) => {
            // Skip one event-loop cycle to let game's listener fire first
            // hacky solution, please fix later
            await wait(0);
            const button = event.relatedTarget;
            if (!button) return;

            const attackType = button.getAttribute('data-bs-attack-type');
            const bodyText = attackConfirmModal.querySelector('.modal-bodyText');

            bodyText.innerHTML += `<br>Estimated hospital time: <span class="fw-bold">${this.defaultTimes[attackType]}min</span>.`;
        });
	}
}
