var player;
hardReset();

const cns = {
	numberNames: ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'],
};

var updateTimer, showTimer, saveTimer, cTab;

const tabs = ['main', 'settings', 'mana'];

//RUNS EVERY TICK
const update = function () {
	let delta = player.settings.updateInterval / 1000;
	if (player.progression >= 1 && player.prod[1]) {
		for (let i = player.prod.length - 1; i > 0; i--) {
			player.prod[i - 1].amount = player.prod[i - 1].amount.add(
				player.prod[i].amount.mul(player.prod[i].multiplier).mul(delta)
			);
		}
	}

	if (player.progression >= 0 && player.prod[0]) {
		player.points = player.points.add(
			player.prod[0].amount.mul(player.prod[0].multiplier).mul(delta)
		);
	}

	if (player.progression >= 3 && player.cps > 0) {
		player.prod[player.prod.length - 1].amount = player.prod[
			player.prod.length - 1
		].amount.plus(Decimal.mul(player.cps, player.sacrificeMultiplier).mul(delta));
	}

	if (player.progression >= 4 && player.mana.currentMana < player.mana.maxMana) {
		player.mana.currentMana = player.mana.currentMana.plus(
			player.mana.mps.mul(delta)
		);
	}
};

//RUNS EVERY WEBSITE-TICK
const show = function () {
	if (cTab == 'main') {
		if (player.progression >= 0) {
			document.getElementById('points').innerHTML =
				formatNumber(player.points).toString() + ' p';
		}

		if (player.progression >= 0 && player.prod[0]) {
			document.getElementById('points/s').innerHTML =
				formatNumber(
					player.prod[0].amount.mul(player.prod[0].multiplier)
				).toString() + ' p/s';
		}

		if (player.progression >= 1 && player.prod.length > 0) {
			document.getElementById('highestpoints/s').innerHTML =
				formatNumber(
					player.prod[player.prod.length - 1].amount.mul(
						player.prod[player.prod.length - 1].multiplier
					)
				).toString() +
				' p/s^' +
				(player.clickLayer + 1);
		}

		if (player.progression >= 3) {
			document.getElementById('sacrifice').innerHTML = getButtonText('sacrifice');
		}

		if (player.progression >= 4) {
			document.getElementById('reset-mana').innerHTML = getButtonText('mana');
		}

		showOnce();
		updateButtons();
	}
};

const showOnce = function () {
	if (player.progression >= 1) {
		document.getElementById('upgrade2').style = 'display: inline';
	}
	if (player.progression >= 2) {
		player.upgradesShown.push(3);
		document.getElementById('upgrade3').style = 'display: inline';
	}
	if (player.progression >= 3 && player.points.gt(new Decimal('1e50'))) {
		document.getElementById('sacrifice').style = 'display: inline';
	}
	if (player.progression >= 4) {
		document.getElementById('reset-mana').style = 'display: inline';
		document.getElementsByClassName('tabButton')[2].style = 'display: inline';
	}
};

const updateButtons = function () {
	for (let i = 1; i <= 3; i++) {
		document.getElementById('upgrade' + i).classList.remove('ableToPurchase');
		document.getElementById('upgrade' + i).classList.remove('notAbleToPurchase');
		let ableToPurchase = player.points.gte(getCost('upgrade' + i));
		if (ableToPurchase) {
			document.getElementById('upgrade' + i).classList.add('ableToPurchase');
		} else {
			document.getElementById('upgrade' + i).classList.add('notAbleToPurchase');
		}
	}
	if (player.progression >= 3) {
		document.getElementById('sacrifice').classList.remove('ableToPurchase');
		document.getElementById('sacrifice').classList.remove('notAbleToPurchase');
		let ableToPurchase = player.points.gte(getCost('sacrifice'));
		if (ableToPurchase) {
			document.getElementById('sacrifice').classList.add('ableToPurchase');
		} else {
			document.getElementById('sacrifice').classList.add('notAbleToPurchase');
		}
	}
	if (player.progression >= 4) {
		document.getElementById('reset-mana').classList.remove('ableToPurchase');
		document.getElementById('reset-mana').classList.remove('notAbleToPurchase');
		let ableToPurchase = player.points.gte(getCost('mana'));
		if (ableToPurchase) {
			document.getElementById('reset-mana').classList.add('ableToPurchase');
		} else {
			document.getElementById('reset-mana').classList.add('notAbleToPurchase');
		}
	}
};

const updateProd = function () {
	for (let i = 0; i < player.prod.length; i++) {
		player.prod[i].multiplier = Decimal.pow(2, player.multiLayer).mul(
			player.sacrificeMultiplier
		);
	}
};

const formatNumber = function (number, places = 1) {
	if (number.lt(100)) {
		return number.toFixed(places);
	}
	if (number.lt(10000)) {
		return number.toFixed();
	}
	if (number.lt(1e30)) {
		let x = Decimal.floor(number.log10() / 3);
		let y = Decimal.pow(1000, x);
		return (number.toNumber() / y).toFixed(3) + ' ' + cns.numberNames[x - 1];
	}
	if (number.lt(1e100)) {
		return number.toExponential(2);
	}
	return 'e' + (Math.round(number.log10() * 100) / 100).toFixed(2);
};

const changeTab = function (currentTab) {
	for (let i = 0; i < tabs.length; i++) {
		document.getElementById(`tab-${tabs[i]}`).style.display = 'none';
	}
	document.getElementById(`tab-${currentTab}`).style.display = 'block';
	cTab = currentTab;
};

const setTimers = function () {
	clearInterval(updateTimer);
	clearInterval(showTimer);
	clearInterval(saveTimer);
	updateTimer = setInterval(function () {
		update();
	}, player.settings.updateInterval);

	showTimer = setInterval(function () {
		show();
	}, player.settings.showInterval);
	saveTimer = setInterval(function () {
		setSave();
	}, player.settings.saveInterval);
};

loadSave();

updateOnLoad();
setTimers();
changeTab('main');
