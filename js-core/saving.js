const save_encode = function (object) {
	return window.btoa(window.encodeURIComponent(JSON.stringify(object)));
};

const save_decode = function (saveFile) {
	return JSON.parse(window.decodeURIComponent(window.atob(saveFile)));
};

const loadSave = function () {
	if (window.localStorage.getItem('idleThingSaveFile')) {
		player = save_decode(window.localStorage.getItem('idleThingSaveFile'));
	}
};

const setSave = function () {
	window.localStorage.setItem('idleThingSaveFile', save_encode(player));
};

const updateOnLoad = function () {
	player.points = new Decimal(player.points);
	player.sacrificeMultiplier = new Decimal(player.sacrificeMultiplier);
	for (let i = 0; i < player.prod.length; i++) {
		player.prod[i].amount = new Decimal(player.prod[i].amount);
		player.prod[i].multiplier = new Decimal(player.prod[i].multiplier);
	}

	player.mana.currentMana = new Decimal(player.mana.currentMana);
	player.mana.maxMana = new Decimal(player.mana.maxMana);
	player.mana.mps = new Decimal(player.mana.mps);

	player.upgradesShown = [];

	updateButtons();
	updateProd();

	document.getElementById('upgrade1').innerHTML = getButtonText('upgrade1');
	document.getElementById('upgrade2').innerHTML = getButtonText('upgrade2');
	document.getElementById('upgrade3').innerHTML = getButtonText('upgrade3');
	document.getElementById('timerSliderShow').innerHTML = player.settings.showInterval;
	document.getElementById('timerSliderUpdate').innerHTML =
		player.settings.updateInterval;
	document.getElementById('timerSliderSave').innerHTML =
		player.settings.saveInterval / 1000;

	if (player.prod.length > 1) {
		document.getElementById('highestpoints/s').style = 'display: block';
	}
};
