class CenterText {
	constructor() { }
	inTown(url) {
		const places = document.querySelectorAll("div.equipmentModule p.card-text.flex-grow-1");
		for (const place of places) place.classList.add("text-center");
	}
	inAnywhere() {
		const chatRows = document.querySelector("div.chats.row");
		const chatObserver = e => {
			for (const ev of e) {
				if (ev.target !== chatRows) continue;

				for (const addedChat of ev.addedNodes) {
					let header = addedChat.querySelector("div.header h6");
					header.classList.add("text-center");
				}
			}
		};
		observeDOM(chatRows, chatObserver);

		const headers = chatRows.querySelectorAll("div.header h6");
		for (const header of headers) header.classList.add("text-center");
	}
}