// This class is good enough for how it is used now,
// but if it's used more, _type and _actionName should
// be replaced by enums
class Item {
	/** @type {string} Name of the item*/
	_name;

	/** @type {number} ImageID used in CE for this item*/
	_imageID;

	/** @type {string} ImageID used in CE for this item*/
	_type;

	/** @type {string} Item description as given in the inventory in CE*/
	_description;
	
	/** @type {string} Item effect as given in the inventory in CE*/
	_effect;

	/** @type {string} Hover value of the 'Use' button in the inventory in CE*/
	_actionName;

	constructor(name, imageID, type, description, effect, actionName) {
		this._name = name;
		this._imageID = imageID;
		this._type = type;
		this._description = description;
		this._effect = effect;
		this._actionName = actionName;
	}

	get name() {
		return this._name;
	}
	get imageID() {
		return this._imageID;
	}
	get type() {
		return this._type;
	}
	get description() {
		return this._description;
	}
	get effect() {
		return this._effect;
	}
	get actionName() {
		return this._actionName;
	}

	set name(value) {
		this._name = value;
	}
	set imageID(value) {
		this._imageID = value;
	}
	set type(value) {
		this._type = value;
	}
	set description(value) {
		this._description = value;
	}
	set effect(value) {
		this._effect = value;
	}
	set actionName(value) {
		this._actionName = value;
	}
}


class AddItemButtons {
	constructor() {
		// Static info on each item
		this.itemMap = new Map([
			['Cocaine', new Item(
				'Cocaine',
				301,
				'Drug',
				'Unlike the shadows of tainted competitors, this cocaine embodies purity \u2013 a potent source of untamed energy, and unparalleled confidence. Time itself seems to bow to your will, granting you control over the universe and its secrets. Cocaine serves as both reward and temptation, a double-edged sword that can either elevate you to greatness or lead you down a treacherous path to Hospital and reduces Combat Stats.',
				'Increases Energy by 50. Increases drug cooldown by 3 hours. Possible overdose effect of -20% all Combat Stats',
				'Take'
			)],
			['Personal Favour', new Item(
				'Personal Favour',
				3,
				'Special',
				'The Personal Favour is granted to players by El Capo, the boss of boss\'s. It\'s a valuable asset that can be used to get the player out of jail when they find themselves in a tight spot with the law. With this favour, players bypass the usual legal processes and secure their freedom with just a single phone call to El Capo.',
				'Releases you from Jail',
				'Use'
			)],
			['Corana Beer', new Item(
				'Corana Beer',
				100,
				'Alcohol',
				'Often served with a wedge of lime, what better way to take the edge of a hard day of crime than by sitting down to a cool Corana Beer. Provides a minor boost to energy.',
				'Increases energy by 5. Increases Booster cooldown by 2 hours',
				'Drink'
			)]
		]);
	}
	getID(itemName) {
		const ID = GM_getValue(`itemID_${itemName}`);
		return ID === undefined ? null : ID;
	}
	setID(cache, itemName) {
		GM_setValue(`itemID_${itemName}`, cache);
		console.debug(`Set itemID_${itemName} to ${cache}`);
		return cache;
	}
	getCount(itemName) {
		const val = GM_getValue(`itemCache_${itemName}`);
		return val === undefined ? null : val;
	}
	setCount(cache, itemName) {
		GM_setValue(`itemCache_${itemName}`, cache);
		console.debug(`Set itemCache_${itemName} to ${cache}`);
		return cache;
	}
	getValue(itemName) {
		const val = GM_getValue(`value_${itemName}`);
		return val === undefined ? null : val;
	}
	useItemClicked(e) {
		// Disable button
		e.target.disabled = true;
		document.querySelector('.useItemMsg')?.remove();

		const id = e.currentTarget.getAttribute("id");
		fetch('/Inventory/Use?id=' + id, { method: 'POST' })
			.then(response => response.json())
			.then(this.handleInvResponse);
	}
	handleInventoryCollapse(target, parent) {
		if (target.tagName === 'svg' || target.tagName === 'BUTTON' || target.tagName === 'path') return;
		// Hide any open items

		const descId = '#itemCollapse' + parent.id.slice(5);
		const descElem = parent.querySelector(descId);
		if (!descElem) return;

		// Toggle description visibility
		if (descElem.classList.contains('collapse')) descElem.classList.remove('collapse');
		else descElem.classList.add('collapse');
	}
	handleInvResponse(data) {
		if (data.status !== 200) return;

		if (data.type == "Weapon" || data.type == "Armour" || data.type == "Thrown") {
			location.setAttribute('href', '/Inventory');
			document.querySelector('.use-item-btn').disabled = false;
			return;
		}
		const containingRow = document.querySelector('.use-item-btn').parentElement.parentElement;
		const dateString = new Date(Date.now()).toLocaleTimeString("en-GB", { timeZone: "UTC" }); 

		if (!data.statusMsg.success) {
			const infoElem = this.constructInfoMsg('col-12 useItemMsg mt-2 text-danger fw-bold', `${dateString} - ${data.statusMsg.error}`);
			containingRow.appendChild(infoElem);
			return;
		}
		const infoElem = this.constructInfoMsg('col-12 useItemMsg mt-2 text-success fw-bold', `${dateString} - ${data.statusMsg.success}`);
		containingRow.appendChild(infoElem);

		if (data.energyGained) this.handleEnergyGain(data);

		if (data.lifeToSet || data.lifeToSet === 0) this.handleLifeUpdate(data);

		if (data.sentToHospital) {
			document.querySelector('.content-container').style = 'background-image:linear-gradient(to right, rgba(255,0,0,0.05), rgba(255, 0, 0, 0.2), rgba(255,0,0,0.05)), url(../images/background-hospital.webp);';
			document.querySelector('#userStatus').textContent = 'In Hospital'
		}
		if (data.releaseFromHosp || data.releaseFromJail) {
			document.querySelector('.content-container').style = 'background-image:linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.2), rgba(0,0,0,0.3)), url(../images/background.webp)';
			document.querySelector('#userStatus').textContent = 'Active'
		}

		document.querySelector('.use-item-btn').disabled = false;

		// Update item count
		const itemCountLabel = document.querySelector(".inventoryItemWrapper .itemQuantity");
		if (!itemCountLabel[0]) return;

		const currentCount = parseInt(itemCountLabel[0].textContent);
		if (isNaN(currentCount)) return;

		if (currentCount - 1 > 0)
			itemCountLabel[0].textContent = currentCount - 1;
		else
			containingRow.remove();
	}
	constructInfoMsg(classList, textContent) {
		const infoElem = document.createElement('div');
		infoElem.classList = classList;
		infoElem.textContent = textContent;
		return infoElem;
	}
	handleEnergyGain(data) {
		const currentEnergyElem = document.querySelector('#currentEnergy');
		const currentEnergy = parseInt(currentEnergyElem.textContent);
		const newEnergy = currentEnergy + data.energyGained;

		const maxEnergyElem = document.querySelector('#maxEnergy');
		const maxEnergy = parseInt(maxEnergyElem.textContent);
		const percentageOfMax = ((newEnergy / maxEnergy) * 100);

		currentEnergyElem.textContent = newEnergy;

		const energyProgressElem = document.querySelector('#energyProgress');
		energyProgressElem.style.width = `${percentageOfMax}%`;
		energyProgressElem.setAttribute("aria-valuenow", newEnergy);

		// Update input fields
		document
			.querySelectorAll('form.input-group input.form-control')
			.forEach((elem) => {
				elem.setAttribute("max", newEnergy.toString());
				elem.setAttribute("value", newEnergy.toString());
			});
		document
			.querySelectorAll('form.input-group input.btn.disabled')
			.forEach((elem) => {
				elem.classList.remove("disabled")
			});
	}
	handleLifeUpdate(data) {
		const maxLifeElem = document.querySelector('#maxLife');
		const maxLife = parseInt(maxLifeElem.textContent);
		const newLife = data.lifeToSet;
		const percentageOfMax = ((newLife / maxLife) * 100);
		if (newLife > maxLife) newLife = maxLife;

		const currentLifeElem = document.querySelector('#currentLife');
		const lifeProgressElem = document.querySelector('#lifeProgress');
		currentLifeElem.textContent = newLife;
		lifeProgressElem.style.width = `${percentageOfMax}%`;
		lifeProgressElem.setAttribute("aria-valuenow", newLife);
	}
	addScript() {
		
	}
	add(count, value, pb, itemName) {
		const ID = this.getID(itemName);
		if (ID === null) return '';

		const item = this.itemMap.get(itemName);
		const desc = item.description;
		const effect = item.effect;
		const imageID = item.imageID;
		const type = item.type;
		const actionName = item.actionName;

		return `
		<div class="row row-cols-3 align-items-center pb-${pb} inventoryItemWrapper" id="item-${ID}" style="cursor: auto; border-bottom: none">
			<div class="col col-4 col-sm-2 col-xl-1">
				<img class="img-thumbnail" src="/images/items/${imageID}.png" title="${itemName}">
			</div>
			<div class="col col-8 col-sm-3 col-xl-4">
				${itemName}<span class="fw-bold"> x<span class="itemQuantity">${count.toLocaleString("en-US")}</span></span>
			</div>
			<div class="col col-2 col-sm-4 col-xl-2 d-none d-sm-inline">
				${itemName === 'Cocaine' ? "Drug" : "Special"}
			</div>
			<div class="col col-2 col-xl-2 d-none d-xl-inline">
				<span></span>${POUND}${value.toLocaleString("en-US")} 
			</div>
			<div class="col col-12 col-sm-3 pe-2 d-none d-sm-inline">
				<button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end" href="#" data-bs-toggle="modal" data-bs-target="#throwItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" title="Throw Away" aria-label="Throw Away ${itemName}" disabled="">
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z">
						</path>
					</svg>
				</button>
				<button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end" href="#" data-bs-toggle="modal" data-bs-target="#sendItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" data-bs-owned="${count}" title="Send" aria-label="Send ${itemName}" disabled="">
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z">
						</path>
					</svg>
				</button>
				<button class="btn btn-sm btn-outline-dark action-btn use-item-btn float-end" href="#" id="${ID}" title="${actionName}" aria-label="${actionName} ${itemName}">
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z">
						</path>
					</svg>
				</button>
			</div>
			<div class="col col-12 collapse" id="itemCollapse${ID}" style="">
				<div class="row row-cols-2 d-md-none mt-3 mb-2">
					<div class="col col-6 mb-2">
						<button class="btn btn-sm btn-outline-dark action-btn use-item-btn w-100" href="#" id="${ID}" title="${actionName}" aria-label="${actionName} ${itemName}">
							${actionName}
						</button>
					</div>
					<div class="col col-6 mb-2">
						<button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end w-100" href="#" data-bs-toggle="modal" data-bs-target="#sendItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" data-bs-owned="42" title="Send" aria-label="Send ${itemName}" disabled="true">
							Send
						</button>
					</div>
					<div class="col col-6 mb-2">
						<button class="btn btn-sm btn-outline-dark action-btn ms-1 float-end w-100" href="#" data-bs-toggle="modal" data-bs-target="#throwItemModal" data-bs-itemname="${itemName}" data-bs-itemid="${ID}" data-bs-itemquantity="42" title="Throw Away" aria-label="Throw Away ${itemName}" disabled="true">
							Throw
						</button>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-12 mt-2">
						<div class="card-text">
							<div class="fw-bold">
								Description 
							</div>
							<div class="card-text">
								${desc}
							</div>
						</div>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-6 d-md-none">
						<div class="card-text">
							<div class="fw-bold">
								Type 
							</div>
							<div class="card-text">
								${type}  
							</div>
						</div>
					</div>
					<div class="col-6 d-xl-none">
						<div class="card-text">
							<div class="fw-bold">
								Value
							</div>
							<div class="card-text">
								<span></span>${POUND}${value.toLocaleString("en-US")} 
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-xl-6 col-md-6 col-12 mb-3">
						<div class="card-text">
							<div class="fw-bold">
								Effect 
							</div>
							<div class="card-text">
								${effect}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`;
	}
	addListener(itemName) {
		const ID = this.getID(itemName);
		if (ID === null) return;

		const item = document.getElementById(`item-${ID}`);
		observeDOM(item, e => {
			const added = e[0].addedNodes[0];
			if (!added || !added.classList
				|| !added.classList.contains("useItemMsg")
				|| added.classList.contains("text-danger")
			) return;

			const newCount = (this.getCount(itemName) || 1) - 1;
			this.setCount(newCount, itemName);
			const countText = document.querySelector(`#item-${ID} span.itemQuantity`);
			countText.textContent = newCount.toLocaleString("en-US");
		});
	}
	addItem(itemName, targetElement) {
		const temp = document.createElement('div');
		temp.innerHTML = this.add(this.getCount(itemName) || 0, this.getValue(itemName) || "???", 4, itemName);
		const newDiv = temp.firstElementChild;

		targetElement.parentNode.insertBefore(newDiv, targetElement.nextSibling);

		newDiv.addEventListener('click', e => this.handleInventoryCollapse(e.target, newDiv));

		const useButton = newDiv.querySelector('.use-item-btn');
		useButton.addEventListener('click', e => this.useItemClicked(e));

		this.addListener(itemName);
	}
	inGym(url) {
		const targetElement = document.querySelector(".row.row-cols-2.row-cols-lg-4.row-cols-md-2.mt-2.mb-4.g-4");
		if (targetElement === null) return;

		this.addItem('Corana Beer', targetElement);
		this.addItem('Cocaine', targetElement);

		const delimiter = document.createElement('hr');
		targetElement.parentNode.insertBefore(delimiter, targetElement.nextSibling);
	}
	inUniversity(url) {
		const container = document.querySelector("div.contentColumn > div > div:not(#helpAccordion):not(.border-success):not(.border-danger) div.card-body");
		if (container === null) return;

		const form = container.querySelector("div.text-center.d-flex.flex-column.align-items-center");
		// At max int
		if (form === null || container === null) return;

		const itemName = 'Cocaine';

		this.addItem(itemName, container);
		const delimiter = document.createElement('hr');
		container.parentNode.insertBefore(delimiter, container.nextSibling);
	}
	inJail(url) {
		let container = document.querySelector("div.contentColumn > div > div:not(#helpAccordion):not(.border-success):not(.border-danger) div.card-body");
		const inJail = container.querySelector("p.card-text.fw-bold.text-success");
		if (inJail === null || container === null) return;

		const itemName = 'Personal Favour';

		this.addItem(itemName, container);
		const delimiter = document.createElement('hr');
		container.parentNode.insertBefore(delimiter, container.nextSibling);
	}
	inInventory(url) {
		const itemList = document.querySelector("div.container.inventoryWrapper");
		if (itemList === null) return;

		for (let i = 2; i < itemList.children.length; ++i) {
			const item = itemList.children[i];
			if (item.children.length < 2) continue;

			const nameSplit = item.children[1].innerText.split(' ');
			const itemName = nameSplit.slice(0, -1).join(' ');
			if (this.itemMap.keys.includes(itemName))
				this.setID(item.id.slice(5), itemName);
		}
	}
}

