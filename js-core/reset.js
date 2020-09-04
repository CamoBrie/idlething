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
