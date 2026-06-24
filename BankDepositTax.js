class BankDepositTax {
	constructor() {
		this.taxRate = 2.5;
		this.ID = "taxOnDeposit";
	}
	calc(val) {
		return `Deposit tax: \u00a3${Math.round(val / 100 * this.taxRate).toLocaleString("en-US")}`;
	}
	inBank(url) {
		const container = document.querySelector("div.text-center.d-flex.flex-column.align-items-center");
		if (container === null) return;

		const depositInput = container.querySelector("input#depositInput");
		let value = Math.floor(parseFloat(depositInput.value.replaceAll(',', "")));

		const row = container.querySelector("div.row");
		const breakHr = document.createElement("hr");
		breakHr.classList.add("w-75");
		container.insertBefore(breakHr, row);

		const tax = document.createElement("p");
		tax.id = this.ID;
		tax.classList.add("card-text", "text-muted", "mt-2");
		tax.innerHTML = this.calc(value);
		container.appendChild(tax);

		["autoNumeric:formatted", "input"].forEach(eventType => {
			depositInput.addEventListener(eventType, e => {
				value = e.target.value === "" ? 0 : Math.floor(parseFloat(e.target.value.replaceAll(',', "")));
				tax.innerHTML = this.calc(value);
			});
		});
	}
}
