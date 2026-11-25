class TransparentChats {

	static metadata = {
		displayName: 'Transparent Chats',
		description: 'Make chats slightly transparent',
		settings: {
			active: {
			},
			custom: {
			}
		}
	}

	constructor() { }

	inAnywhere() {
		GM_addStyle("div.chats.row label.chat-btn { opacity: 0.9 }");
	}
}
