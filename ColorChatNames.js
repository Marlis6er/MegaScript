class ColorChatNames {

	static metadata = {
		displayName: 'Color Names',
		description: 'Color friend names green and enemie names red',
		settings: {
			active: {
				inConnections: {
					description: 'Store the list of friends / enemies'
				},
				inUserProfile: {
					description: 'Update the stored list when you add / remove a friend / enemy'
				},
				inBountyOrOtherCartel: {
					description: 'Color names in the member list / bounty list'
				},
				inTrade: {
					description: 'Color the names in the trade list'
				},
				inMail: {
					description: 'Color the names in the mail list'
				},
				inMarket: {
					description: 'Color the names in the offer list'
				},
				inForumCategory: {
					description: 'Color the name of the authors'
				},
				inForumPost: {
					description: 'Color both author- and comment names'
				},
				inAnywhere: {
					description: 'Color names when they appear with a link to the user profile'
				},
			},
			custom: {
			}
		}
	}

	constructor() {
		this.ownID = user_id;
	}
	ownColor(l) {
		return `hsl(200, 70%, ${l}%)`;
	}
	getList(friends = true) {
		const list = getValue('connections', friends ? 'friends' : 'enemies');
		return list === null ? [] : list;
	}
	setList(list, friends = true) {
		setValue('connections', friends ? 'friends' : 'enemies', list);
		console.debug(`Set connections_${friends ? "friends" : "enemies"} to ${JSON.stringify(list)}`);
		return list;
	}
	inConnections(url) {
		const lists = document.querySelectorAll("div.card-body  div.tab-content");
		if (lists.length < 2) return;

		const friends = lists[0].querySelectorAll("a.fw-bold");
		const enemies = lists[1].querySelectorAll("a.fw-bold");
		let list = [];
		for (const user of friends) {
			list.push(user.href.match(/\d+$/)[0]);
		}
		this.setList(list, true);
		list = [];
		for (const user of enemies) {
			list.push(user.href.match(/\d+$/)[0]);
		}
		this.setList(list, false);
	}
	inUserProfile(url) {
		const text = document.querySelector("div.card p.card-text.fw-bold");
		if (text === null) return;

		const textSplit = text.innerText.split(' ');
		const userID = url.replace('#', "").match(/\d+\/?$/)[0];
		if (userID.endsWith('/')) userID = userID.slice(0, -1);

		if (textSplit[textSplit.length - 1] === "enemy") {
			let list = this.getList(false);
			if (textSplit[textSplit.length - 3] === "Added") {
				list.push(userID);
				let otherList = this.getList(true);
				otherList = otherList.filter(ID => ID !== userID);
				this.setList(otherList, true);
			} else if (textSplit[textSplit.length - 3] === "Removed")
				list = list.filter(ID => ID !== userID);
			this.setList(list, false);
		} else if (textSplit[textSplit.length - 1] === "friend") {
			let list = this.getList(true);
			if (textSplit[textSplit.length - 3] === "Added") {
				list.push(userID);
				let otherList = this.getList(false);
				otherList = otherList.filter(ID => ID !== userID);
				this.setList(otherList, false);
			} else if (textSplit[textSplit.length - 3] === "Removed")
				list = list.filter(ID => ID !== userID);
			this.setList(list, true);
		}
	}
	inBountyOrOtherCartel(url) {
		this.applyStyleChanges();
	}
	inTrade(url) {
		this.applyStyleChanges();
	}
	inMail(url) {
		this.applyStyleChanges();
	}
	inMarket(url) {
		this.applyStyleChanges();
	}
	inForumCategory(url) {
		this.applyStyleChanges();
	}
	inForumPost(url) {
		this.applyStyleChanges();
	}
	inAnywhere(url) {
		this.applyStyleChanges();
	}
	applyStyleChanges() {
		GM_addStyle(`[data-bs-theme="dark"] a.text-decoration-none[href$="/${this.ownID}"] > h3.user { color: ${this.ownColor(50)} }`);
		GM_addStyle(`[data-bs-theme="light"] a.text-decoration-none[href$="/${this.ownID}"] > h3.user { color: ${this.ownColor(45)} }`);
		const friends = this.getList(true);
		const enemies = this.getList(false);
		for (const userID of friends) {
			GM_addStyle(`a.text-decoration-none[href$="/${userID}"] > h3.user { color: rgb(var(--bs-success-rgb)) !important }`);
		}
		for (const userID of enemies) {
			GM_addStyle(`a.text-decoration-none[href$="/${userID}"] > h3.user { color: rgb(var(--bs-danger-rgb)) !important }`);
		}
	}
}
