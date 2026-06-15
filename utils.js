// Used for seeing when elements update, for some reason there's no neat standard way to do that
const observeDOM = (function() {
	const MutationObserver = window.MutationObserver
		|| window.WebKitMutationObserver;
	return function(obj, callback) {
		if(!obj || obj.nodeType !== 1) return;

		if(MutationObserver) {
			const mutationObserver = new MutationObserver(callback);
			mutationObserver.observe(obj, {
				childList: true,
				subtree: true
			});
			return mutationObserver;
		}
		if(window.addEventListener) {
			obj.addEventListener("DOMNodeInserted", callback, false);
			obj.addEventListener("DOMNodeRemoved", callback, false);
		}
	}
})();

function extractUserInfo() {
    const labels = document.querySelectorAll(".profileLabel");
 
    let nameIdElement = null;
 
    labels.forEach(label => {
        if (label.textContent.trim().toLowerCase() === "name") {
            nameIdElement = label
				.parentElement
				.nextElementSibling
				.querySelector(".form-data-inset");
        }
    });
 
    if (!nameIdElement) {
		console.error("❌ User name and ID not found on the page!");
		return;
    }

	const userInfo = nameIdElement.textContent.trim();

	const [extractedName, extractedId] = userInfo.split(" - ");

	if (!extractedName || !extractedId) {
		console.warn("⚠️ Failed to properly split name and ID.");
		return;
	}

	const user_name = extractedName.trim();
	const user_id = extractedId.trim();

	// Save the user name and ID in localstorage
	localStorage.setItem("user_name", user_name);
	localStorage.setItem("user_id", user_id);

	console.debug("✅ Extracted User Name:", user_name);
	console.debug("✅ Extracted User ID:", user_id);

	return { user_name: user_name, user_id: user_id };
}
 
// Function to get user name and ID from localstorage
function getUserInfoFromStorage() {
    const storedName = localStorage.getItem("user_name");
    const storedId = localStorage.getItem("user_id");
 
    if (!storedName || !storedId) {
		console.warn("ℹ️ User info not found in localStorage.");
		return null;
    }
	console.debug(`From LocalStorage: Name: ${storedName}, ID: ${storedId}`);
	return { user_name: storedName, user_id: storedId };
}