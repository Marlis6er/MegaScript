class RoundedCards {

	static metadata = {
		displayName: 'Rounded Cards',
		description: 'Make the corners of cards round',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() { }

	inAnywhere() {
		GM_addStyle(".contentColumn .card.border-success > .card-body.bg-success, .contentColumn .card.border-danger > .card-body.bg-danger, .contentColumn .card.border-warning > .card-body.bg-warning { border-radius: 10px !important }");
	}
}
