const resetPlayer = function (type, value) {
	player.points = new Decimal(0);
	player.prod.length = 0;
	player.clickLayer = 0;
	player.multiLayer = 0;
	player.cps = 0;

	switch (type) {
		case 'sacrifice':
			player.sacrificeMultiplier = player.sacrificeMultiplier.mul(
				new Decimal(value)
			);
			break;
		case 'mana':
			player.sacrificeMultiplier = new Decimal(1);
			player.mana.maxMana = player.mana.maxMana.plus(1);
			player.mana.mps = player.mana.mps.plus(0.01);
			break;
		default:
			return;
	}

	document.getElementById('click').click();
	updateProd();
	updateButtons();

	document.getElementById('upgrade1').innerHTML = getButtonText('upgrade1');
	document.getElementById('upgrade2').innerHTML = getButtonText('upgrade2');
	document.getElementById('upgrade3').innerHTML = getButtonText('upgrade3');
};

const hardReset = function (reload = false) {
	player = {
		progression: 0,
		points: new Decimal(0),
		prod: [],
		clickLayer: 0,
		multiLayer: 0,
		cps: 0,
		sacrificeMultiplier: new Decimal(1),
		mana: {
			currentMana: new Decimal(0),
			maxMana: new Decimal(0),
			mps: new Decimal(0),
		},
		settings: {
			updateInterval: '50',
			showInterval: '100',
			saveInterval: '30000',
		},
	};
	if (reload) {
		location.reload();
	}
};
