class PropertyPageAgentLink {
	constructor() {
		this.add = `
            <div class="row">
                <div class="col-12">
                    <div class="header-section">
                        <h2>Estate Agent</h2>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p class="card-text">Go to the <a class="text-white" href="/Town/EstateAgent">Estate Agent</a> to view other properties.</p>
            </div>`;
	}

	inProperty(url) {
		// Find the correct container for the tabs and content
		const container = document.querySelector("#cartelPerksNav");
		console.debug("Container element found:", container);

		if (!container) {
			console.error("Container not found!");
			return;
		}

		// Remove the default button
		const defaultButton = container.querySelector("div.gap-2.d-flex");
		if (defaultButton !== null) {
			console.debug("Removing default button.");
			defaultButton.remove();
		} else console.warn("No default button found.");

		// Check if combined content already exists
		if (container.querySelector("#combined-content")) {
			console.debug("Combined content already exists, skipping creation.");
			return; // If it exists, exit the function
		}

		// Locate the tabs and their corresponding content
		const tabs = container.querySelectorAll(".nav-link");
		const tabContents = container.querySelectorAll(".tab-content .tab-pane");

		console.info("Tabs found:", tabs.length);
		console.info("Tab contents found:", tabContents.length);

		// Create the estate agent section
		const agentSection = document.createElement("div");
		agentSection.classList.add("mb-4", "card");
		agentSection.innerHTML = this.add;

		// Create the combined card with all content
		const combinedCard = document.createElement("div");
		combinedCard.id = "combined-content"; // Add an ID for easier reference
		combinedCard.classList.add("mb-4", "card");
		combinedCard.innerHTML = `
            <div class="row">
                <div class="col-12">
                    <h4 class="header-section">Home Details</h4>
                    <div class="card-body">
                        ${document.querySelector("#v-content-home")?.innerHTML || 'No home content available.'}
                    </div>
                </div>
                <div class="col-12">
                    <h5 class="header-section">Vault</h5>
                    <div class="card-body">
                        ${document.querySelector("#v-content-safe")?.innerHTML || 'No vault content available.'}
                    </div>
                </div>
                <div class="col-12">
                    <h5 class="header-section">Upgrades</h5>
                    <div class="card-body">
                        ${document.querySelector("#v-content-upgrades")?.innerHTML || 'No upgrades content available.'}
                    </div>
                </div>
            </div>
        `;

		// Hide tabs
		tabs.forEach((tab, index) => {
			console.debug(`Hiding tab ${index}:`, tab);
			tab.classList.add('d-none');
		});

		// Remove all existing tab content
		tabContents.forEach((content, index) => {
			console.debug(`Removing tab content ${index}:`, content);
			content.remove();
		});

		// Check if there is any element with the class 'mb-4 card border-success'
		const successCard = container.querySelector('.mb-4.card.border-success');
		console.debug("Success card found:", successCard);

		if (!successCard) {
			// If no such element exists, append the estate agent section first
			console.warn("No success card found, appending agent section at the top.");
			container.insertBefore(agentSection, container.firstChild);
		} else {
			// Otherwise, insert it after the 'mb-4 card border-success' element
			console.debug("Success card found, inserting agent section after it.");
			container.insertBefore(agentSection, successCard.nextSibling);
		}

		// Append the new combined card
		console.debug("Appending combined card.");
		container.appendChild(combinedCard);
	}
}
