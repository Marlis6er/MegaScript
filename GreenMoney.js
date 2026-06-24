class GreenMoney {
	constructor() {
		this.color = "hsl(95, 100%, 25%)"; // Default color
	}

	inAnywhere() {
		// List of class names to handle
		["currentCashDesktop", "cashDisplay"].forEach(className => {
			// Find the cash elements
			const cash = document.querySelector(`span.${className}`);

			if (cash === null) return;

			// Apply color to the cash amount
			cash.style.color = this.color;

			// Determine the parent element for context
			const parentElement = cash.closest('li') || cash.closest('.row');

			if (!parentElement) return;

			// Case 1: Handle £ in the same element
			if (parentElement.textContent.includes('£')) {
				parentElement.innerHTML = parentElement.innerHTML.replace(/£/, `<span style="color: ${this.color};">£</span>`);
			}

			// Case 2: Handle £ as a sibling element
			const poundSymbol = parentElement.querySelector('span, p')?.previousSibling;
			if (poundSymbol && poundSymbol.nodeType === Node.TEXT_NODE
				&& poundSymbol.textContent.includes('£')) poundSymbol.style.color = this.color;
		});
	}
}
