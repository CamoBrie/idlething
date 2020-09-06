document.getElementById('click').addEventListener('click', function () {
	if (!player.prod[player.clickLayer]) {
		player.prod[player.clickLayer] = {
			amount: new Decimal(1),
			multiplier: new Decimal(1),
		};
	} else {
		player.prod[player.clickLayer].amount = player.prod[player.clickLayer].amount.add(
			1
		);
	}
});

document.getElementById('upgrade1').addEventListener('click', function () {
	if (player.points.lt(getCost('upgrade1'))) {
		return;
	}

	if (player.progression < 1) {
		player.progression = 1;
	}

	player.clickLayer++;

	document.getElementById('upgrade1').innerHTML = getButtonText('upgrade1');
	document.getElementById('click').innerHTML = `Get 1p/s^${player.clickLayer + 1}`;
	document.getElementById('highestpoints/s').style = 'display: block';
	document.getElementById('click').click();

	updateProd();
});

document.getElementById('upgrade2').addEventListener('click', function () {
	if (player.points.lt(getCost('upgrade2'))) {
		return;
	}

	if (player.progression < 2) {
		player.progression = 2;
	}

	player.multiLayer++;

	document.getElementById('upgrade2').innerHTML = getButtonText('upgrade2');
	document.getElementById('upgrade3').innerHTML = getButtonText('upgrade3');

	updateProd();
});

document.getElementById('upgrade3').addEventListener('click', function () {
	if (player.points.lt(getCost('upgrade3'))) {
		return;
	}

	if (player.progression < 3) {
		player.progression = 3;
	}

	player.cps++;

	document.getElementById('upgrade3').innerHTML = getButtonText('upgrade3');
});

window.addEventListener('unload', function () {
	setSave();
});
window.addEventListener('beforeunload', function () {
	setSave();
});
window.addEventListener('offline', function () {
	setSave();
});

document.getElementById('sacrifice').addEventListener('click', function () {
	if (player.points.lt(getCost('sacrifice'))) {
		return;
	}

	if (player.progression < 4) {
		player.progression = 4;
	}

	resetPlayer('sacrifice', getFormula('sacrifice'));
});

document.getElementById('slider-show').addEventListener('change', function () {
	player.settings.showInterval = 10 * this.value;
	document.getElementById('timerSliderShow').innerHTML = 10 * this.value;
	setTimers();
});
document.getElementById('slider-update').addEventListener('change', function () {
	player.settings.updateInterval = 10 * this.value;
	document.getElementById('timerSliderUpdate').innerHTML = 10 * this.value;
	setTimers();
});
document.getElementById('slider-save').addEventListener('change', function () {
	player.settings.saveInterval = 1000 * this.value;
	document.getElementById('timerSliderSave').innerHTML = this.value;
	setTimers();
});
