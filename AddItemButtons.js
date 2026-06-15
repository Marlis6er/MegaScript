class AddItemButtons {
	constructor() {
		this.cokeDesc = "Unlike the shadows of tainted competitors, this cocaine embodies purity \u2013 a potent source of untamed energy, and unparalleled confidence. Time itself seems to bow to your will, granting you control over the universe and its secrets. Cocaine serves as both reward and temptation, a double-edged sword that can either elevate you to greatness or lead you down a treacherous path to Hospital and reduces Combat Stats.";
		this.PFDesc = "The Personal Favour is granted to players by El Capo, the boss of boss's. It's a valuable asset that can be used to get the player out of jail when they find themselves in a tight spot with the law. With this favour, players bypass the usual legal processes and secure their freedom with just a single phone call to El Capo.";
		this.cokeEffect = "Increases Energy by 50. Increases drug cooldown by 3 hours. Possible overdose effect of -20% all Combat Stats";
		this.PFEffect = "Releases you from Jail";
	}
	getID(coke = true) {
		const ID = GM_getValue(`itemID_${coke ? "Cocaine" : "Personal Favour"}`);
		return ID === undefined ? null : ID;
	}
	setID(cache, coke = true) {
		const itemName = coke ? "Cocaine" : "Personal Favour";
		GM_setValue(`itemID_${itemName}`, cache);
		console.debug(`Set itemID_${itemName} to ${cache}`);
		return cache;
	}
	getCount(coke = true) {
		const val = GM_getValue(`itemCache_${coke ? "Cocaine" : "Personal Favour"}`);
		return val === undefined ? null : val;
	}
	setCount(cache, coke = true) {
		const itemName = coke ? "Cocaine" : "Personal Favour";
		GM_setValue(`itemCache_${itemName}`, cache);
		console.debug(`Set itemCache_${itemName} to ${cache}`);
		return cache;
	}
	getValue(coke = true) {
		const val = GM_getValue(`value_${coke ? "Cocaine" : "Personal Favour"}`);
		return val === undefined ? null : val;
	}
	scriptFunc() {
		$(() => {
			// Existing click handlers
			$(document).on("click", ".row.inventoryItemWrapper", e => handleInventoryCollapse(e.target));
			$(".use-item-btn").on("click", e => useItemClicked(e));
		});

		function useItemClicked(e) {
			// Disable button
			$(".use-item-btn").prop("disabled", true);
			var containingRow = $(e.currentTarget).parents(".row")[0];
			const dateString = new Date(Date.now()).toLocaleTimeString("en-GB", { timeZone: "UTC" });
			$(".useItemMsg").remove();

			const id = e.currentTarget.getAttribute("id");
			$.post("/Inventory/Use?id=" + id, handleInvResponse);
		}

		function handleInventoryCollapse(target) {
			if (target.tagName === 'svg' || target.tagName === 'BUTTON' || target.tagName === 'path') return;
			// Hide any open items
			$('.collapse').collapse('hide');

			if ($(target).hasClass("inventoryItemWrapper")) {
				$(target).find('.collapse').collapse("show");
				return;
			}
			$(target).parents('.row.inventoryItemWrapper').first().find('.collapse').collapse("show");
		}

		function handleInvResponse(data) {
			if (data.status !== 200) return;
			if (data.type == "Weapon" || data.type == "Armour" || data.type == "Thrown") {
				$(location).attr("href", "/Inventory");
				$(".use-item-btn").prop("disabled", false);
				return;
			}
			if (!data.statusMsg.success) {
				$(containingRow).append(`<div class="col-12 useItemMsg mt-2 text-danger fw-bold">${dateString} - ${data.statusMsg.error}</div>`);
				return;
			}
			$(containingRow).append(`<div class="col-12 useItemMsg mt-2 text-success fw-bold">${dateString} - ${data.statusMsg.success}</div>`);

			if (data.energyGained) {
				const currentEnergy = parseInt($("#currentEnergy")[0].innerText);
				const newEnergy = currentEnergy + data.energyGained;
				const maxEnergy = parseInt($("#maxEnergy")[0].innerText);
				const percentageOfMax = ((newEnergy / maxEnergy) * 100);

				$("#currentEnergy")[0].innerText = newEnergy;
				$("#energyProgress")[0].style.width = `${percentageOfMax}%`;
				$("#energyProgress")[0].setAttribute("aria-valuenow", newEnergy);

				// Update input fields
				$("form.input-group input.form-control").each((idx, elem) => {
					elem.setAttribute("max", newEnergy.toString());
					elem.setAttribute("value", newEnergy.toString());
				});
				$("form.input-group input.btn.disabled").each((idx, elem) => elem.classList.remove("disabled"));
			}
			if (data.lifeToSet || data.lifeToSet === 0) {
				const maxLife = parseInt($("#maxLife")[0].innerText);
				const newLife = data.lifeToSet;
				const percentageOfMax = ((newLife / maxLife) * 100);
				if (newLife > maxLife) newLife = maxLife;

				$("#currentLife")[0].innerText = newLife;
				$("#lifeProgress")[0].style.width = `${percentageOfMax}%`;
				$("#lifeProgress")[0].setAttribute("aria-valuenow", newLife);
			}

			if (data.sentToHospital) {
				$(".content-container").attr("style", "background-image:linear-gradient(to right, rgba(255,0,0,0.05), rgba(255, 0, 0, 0.2), rgba(255,0,0,0.05)), url(../images/background-hospital.webp);");
				$("#userStatus").text("In Hospital");
			}
			if (data.releaseFromHosp || data.releaseFromJail) {
				$(".content-container").attr("style", "background-image:linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url(../images/background.webp)");
				$("#userStatus").text("Active");
			}

			$(".use-item-btn").prop("disabled", false);

			// Update item count
			const container = $(e.currentTarget).parents(".inventoryItemWrapper")[0];
			const itemCountLabel = $(container).find(".itemQuantity");
			if (!itemCountLabel[0]) {
				location.reload();
				return;
			}

			const currentCount = parseInt(itemCountLabel[0].innerText);
			if (isNaN(currentCount)) {
				location.reload();
				return;
			}

			if (currentCount - 1 > 0)
				itemCountLabel[0].innerText = currentCount - 1;

			else
				containingRow.remove();

			// Reload the page if the item was successfully used
			location.reload();
		}
	}
	addScript() {
		this.script = document.createElement("script");
		this.script.type = "text/javascript";
		this.script.innerHTML = this.scriptFunc.toString().replace(/^[^\{]*\{/, "").replace(/\}[^\}]*$/, "");
		document.head.appendChild(this.script);
	}
	add(count, value, pb, coke = true) {
		const ID = this.getID(coke);
		if (ID === null)
			return "";
		const imageID = coke ? 301 : 3;
		const itemName = coke ? "Cocaine" : "Personal Favour";
		const actionName = coke ? "Take" : "Use";
		return `<hr><div class="row row-cols-3 align-items-center pb-${pb} inventoryItemWrapper" id="item-${ID}" style="cursor: auto; border-bottom: none"><div class="col col-4 col-sm-2 col-xl-1"><img class="img-thumbnail" src="/images/items/${imageID}.png" title="${itemName}"></div><div class="col col-8 col-sm-3 col-xl-4">${itemName}<span class="fw-bold"> x<span class="itemQuantity">${count.toLocaleString("en-US")}</span></span></div><div class="col col-2 col-sm-4 col-xl-2 d-none d-sm-inline">${coke ? "Drug" : "Special"}</div><div class="col col-2 col-xl-2 d-none d-xl-inline"><span></span>\u00a3${value.toLocaleString("en-US")} </div><div class="col col-12 col-sm-3 pe-2 d-none d-sm-inline"><button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end" href="#" data-bs-toggle="modal" data-bs-target="#throwItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" title="Throw Away" aria-label="Throw Away ${itemName}" disabled=""><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"></path></svg></button><button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end" href="#" data-bs-toggle="modal" data-bs-target="#sendItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" data-bs-owned="${count}" title="Send" aria-label="Send ${itemName}" disabled=""><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path></svg></button><button class="btn btn-sm btn-outline-dark action-btn use-item-btn float-end" href="#" id="${ID}" title="${actionName}" aria-label="${actionName} ${itemName}"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"></path></svg></button></div><div class="col col-12 collapse" id="itemCollapse${ID}" style=""><div class="row row-cols-2 d-md-none mt-3 mb-2"><div class="col col-6 mb-2"><button class="btn btn-sm btn-outline-dark action-btn use-item-btn w-100" href="#" id="${ID}" title="${actionName}" aria-label="${actionName} ${itemName}">${actionName}</button></div><div class="col col-6 mb-2"> <button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end w-100" href="#" data-bs-toggle="modal" data-bs-target="#sendItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" data-bs-owned="42" title="Send" aria-label="Send ${itemName}" disabled="true">Send</button></div><div class="col col-6 mb-2"> <button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end w-100" href="#" data-bs-toggle="modal" data-bs-target="#throwItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" data-bs-itemquantity="42" title="Throw Away" aria-label="Throw Away ${itemName}" disabled="true">Throw</button></div></div><div class="row mb-3"><div class="col-12 mt-2"><div class="card-text"> <div class="fw-bold">Description </div><div class="card-text">${coke ? this.cokeDesc : this.PFDesc}</div></div></div></div><div class="row mb-3"><div class="col-6 d-md-none"><div class="card-text"> <div class="fw-bold">Type </div><div class="card-text">${coke ? "Drug" : "Special"}  </div></div></div><div class="col-6 d-xl-none"><div class="card-text"> <div class="fw-bold">Value</div><div class="card-text"><span></span>\u00a3${value.toLocaleString("en-US")} </div></div></div></div><div class="row"> <div class="col-xl-6 col-md-6 col-12 mb-3"><div class="card-text"> <div class="fw-bold">Effect </div><div class="card-text">${coke ? this.cokeEffect : this.PFEffect}</div></div></div></div></div></div>`;
	}
	addListener(coke = true) {
		const ID = this.getID(coke);
		if (ID === null) return;

		const item = document.getElementById(`item-${ID}`);
		observeDOM(item, e => {
			const added = e[0].addedNodes[0];
			if (!added || !added.classList ||
				!added.classList.contains("useItemMsg") ||
				added.classList.contains("text-danger")) return;

			const newCokeCount = (this.getCount(coke) || 1) - 1;
			this.setCount(newCokeCount, coke);
			const countText = document.querySelector(`#item-${ID} span.itemQuantity`);
			countText.innerText = newCokeCount.toLocaleString("en-US");
		});
	}
	inGym(url) {
		const targetElement = document.querySelector(".row.row-cols-2.row-cols-lg-4.row-cols-md-2.mt-2.mb-4.g-4");
		if (targetElement === null) return;

		const newDiv = document.createElement("div");
		newDiv.innerHTML = this.add(this.getCount(true) || 0, this.getValue(true) || "???", 4, true);
		targetElement.parentNode.insertBefore(newDiv, targetElement.nextSibling);
		this.addScript();
		this.addListener(true);
	}
	inUniversity(url) {
		const container = document.querySelector("div.contentColumn > div > div:not(#helpAccordion):not(.border-success):not(.border-danger) div.card-body");
		if (container === null) return;
		const form = container.querySelector("div.text-center.d-flex.flex-column.align-items-center");
		// At max int
		if (form === null || container === null) return;

		container.innerHTML += this.add(this.getCount(true) || 0, this.getValue(true) || "???", 2, true);
		this.addScript();
		this.addListener(true);
	}
	inJail(url) {
		let container = document.querySelector("div.contentColumn > div > div:not(#helpAccordion):not(.border-success):not(.border-danger) div.card-body");
		const inJail = container.querySelector("p.card-text.fw-bold.text-success");
		if (inJail === null || container === null) return;

		container.innerHTML += this.add(this.getCount(false) || 0, this.getValue(false) || "???", 2, false);
		this.addScript();
		this.addListener(false);
	}
	inInventory(url) {
		const itemList = document.querySelector("div.container.inventoryWrapper");
		if (itemList === null) return;

		for (var i = 2; i < itemList.children.length; ++i) {
			const item = itemList.children[i];
			if (item.children.length < 2) continue;

			const nameSplit = item.children[1].innerText.split(' ');
			const itemName = nameSplit.slice(0, -1).join(' ');
			if (itemName === "Cocaine")
				this.setID(item.id.slice(5), true);
			else if (itemName === "Personal Favour")
				this.setID(item.id.slice(5), false);
		}
	}
}
