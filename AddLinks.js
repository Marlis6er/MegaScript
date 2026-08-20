class Link {
	/** @type {string} The name of the link that will show below the icon */
	_name;

	/** @type {string} The hover name */
	_altName;

	/** @type {string} The relative link to the target page */
	_link;

	/** @type {string} The svg path of the icon */
	_path;
	
	/** @type {string} The size of the icon in px*/
	_viewBox;

	constructor(name, altName, link, path, viewBox) {
		this._name = name;
		this._altName = altName;
		this._link = link;
		this._path = path;
		this._viewBox = viewBox;
	}

	get name() {
		return this._name;
	}
	get altName() {
		return this._altName;
	}
	get link() {
		return this._link;
	}
	get path() {
		return this._path;
	}
	get viewBox() {
		return this._viewBox;
	}

	set name(value) {
		this._name = value;
	}
	set altName(value) {
		this._altName = value;
	}
	set link(value) {
		this._link = value;
	}
	set path(value) {
		this._path = value;
	}
	set viewBox(value) {
		this._viewBox = value;
	}
}

const LINKS = [
	new Link(
		'ITEM MARKET',
		'Player Market',
		'/Market',
		`<path d="M5.757 1.071a.5.5 0 0 1 .172.686L3.383 6h9.234L10.07 1.757a.5.5 0 1 1 .858-.514L13.783 6H15a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1v4.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 13.5V9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1.217L5.07 1.243a.5.5 0 0 1 .686-.172zM2 9v4.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V9H2zM1 7v1h14V7H1zm3 3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 4 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 6 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3A.5.5 0 0 1 8 10zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5zm2 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 1 .5-.5z"></path>`,
		'16'
	),
	new Link (
		'STAT EST',
		'Stat Estimates',
		'/StatEstimates',
		`<path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"></path>`,
		'16'
	),
	new Link(
		'HOSPITAL',
		'Hospital',
		'/Hospital',
		`<path d="M6 0h4v4h4v4h-4v4h-4v-4H2V4h4V0z"/>`,
		'16'
	),
	new Link(
		'HIGHSCORES',
		'Highscores',
		'/Highscores',
		`<path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5"/>
  		<path d="M1.713 11.865v-.474H2c.217 0 .363-.137.363-.317 0-.185-.158-.31-.361-.31-.223 0-.367.152-.373.31h-.59c.016-.467.373-.787.986-.787.588-.002.954.291.957.703a.595.595 0 0 1-.492.594v.033a.615.615 0 0 1 .569.631c.003.533-.502.8-1.051.8-.656 0-1-.37-1.008-.794h.582c.008.178.186.306.422.309.254 0 .424-.145.422-.35-.002-.195-.155-.348-.414-.348h-.3zm-.004-4.699h-.604v-.035c0-.408.295-.844.958-.844.583 0 .96.326.96.756 0 .389-.257.617-.476.848l-.537.572v.03h1.054V9H1.143v-.395l.957-.99c.138-.142.293-.304.293-.508 0-.18-.147-.32-.342-.32a.33.33 0 0 0-.342.338zM2.564 5h-.635V2.924h-.031l-.598.42v-.567l.629-.443h.635z"/>`,
		'16'
	),
	new Link(
		'BOUNTY',
		'Bounties',
		'/Bounty',
		`<path class="cls-1" d="M16,28A12,12,0,1,1,28,16,12,12,0,0,1,16,28ZM16,6A10,10,0,1,0,26,16,10,10,0,0,0,16,6Z"></path><rect class="cls-1" height="7" width="2" x="15" y="24"></rect><rect class="cls-1" height="7" width="2" x="15" y="1"></rect><rect class="cls-1" height="2" width="7" x="24" y="15"></rect><rect class="cls-1" height="2" width="7" x="1" y="15"></rect><path class="cls-1" d="M16,20a4,4,0,1,1,4-4A4,4,0,0,1,16,20Zm0-6a2,2,0,1,0,2,2A2,2,0,0,0,16,14Z"></path>`,
		'32'
	),
	new Link(
		'PERSONAL STATS',
		'Personal Stats',
		'/User/Stats',
		`<path d="M11 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h1V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7h1V2zm1 12h2V2h-2v12zm-3 0V7H7v7h2zm-5 0v-3H2v3h2z"></path>`, 
		'16'
	),
	new Link(
		'ACHIEVEMENTS',
		'Achievements',
		'/User/Stats',
		`<path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935"></path>`,
		'16'
	)
];

class AddLinks {

	static metadata = {
		displayName: 'Add Links',
		description: 'Add extra links to the top nav bar',
		settings: {
			active: {
				inAnywhere: {
					description: 'Add useful links'
				}
			},
			custom: {
				links: {
					displayName: 'Links',
					description: 'What (custom) links should be shown in the navbar. Can select multiple',
					type: SettingType.LIST,
					defaultValue: [
						'Player Market',
						'Stat Estimates',
						'Hospital',
						'Highscores'
					],
					extra: {
						unique: true,
						availableElements: [
							'Player Market',
							'Stat Estimates',
							'Hospital',
							'Highscores',
							'Bounties',
							'Personal Stats',
							'Achievements'
						]
					}
				}
			}
		}
	}

	constructor() {
		const configManager = ConfigManager.getInstance();
		const activeLinks = configManager.getCustomSetting(this, 'links');
		if (activeLinks !== null) this.links = LINKS.filter(link => activeLinks.includes(link._altName));
		else this.links = LINKS;
	}

	inAnywhere(url) {
		const mobileMenu = document.querySelector("ul#menu");
		const desktopMenu = document.querySelector("ul#desktopMenu");

		for (const linkObj of this.links) {
			const listItem = document.createElement("li");
			listItem.className = "flex-fill"; // Ensures proper desktop spacing

			listItem.innerHTML = this.svgTemplate(linkObj);

			if (mobileMenu) mobileMenu.appendChild(listItem.cloneNode(true));
			if (desktopMenu) desktopMenu.appendChild(listItem);
		}
	}

	svgTemplate(linkObj) {
		return `
				<a class="nav-link d-flex flex-column align-items-center px-md-0 px-2 leftNavLink" href="${linkObj.link}">
					<svg class="mb-1" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 ${linkObj.viewBox} ${linkObj.viewBox}">
						${linkObj.path}
					</svg>
					<span class="text-center">${linkObj.name}</span>
				</a>
			`;
	}
}
