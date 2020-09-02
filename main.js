var player = {
	points: new Decimal(0),
	prod: [],
	clickLayer: 0,
	multiLayer: 0,
	progression: 0,
	upgrades: [],
	cps: 0,
	settings: {
		updateInterval: 50,
		showInterval: 100,
	},
};

const cns = {
	numberNames: ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'],
};

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
	if (player.points.lt(costFunc('upgrade1'))) {
		return;
	}

	if (player.progression < 1) {
		player.progression = 1;
	}

	player.clickLayer++;

	document.getElementById('upgrade1').innerHTML = buttonTextFunc('upgrade1');
	document.getElementById('click').innerHTML = `Get 1p/s^${player.clickLayer + 1}`;
	document.getElementById('highestpoints/s').style = 'display: block';
	document.getElementById('click').click();

	updateProd();
});

document.getElementById('upgrade2').addEventListener('click', function () {
	if (player.points.lt(costFunc('upgrade2'))) {
		return;
	}

	if (player.progression < 2) {
		player.progression = 2;
	}

	player.multiLayer++;

	document.getElementById('upgrade2').innerHTML = buttonTextFunc('upgrade2');
	document.getElementById('upgrade3').innerHTML = buttonTextFunc('upgrade3');

	updateProd();
});

document.getElementById('upgrade3').addEventListener('click', function () {
	if (player.points.lt(costFunc('upgrade3'))) {
		return;
	}

	if (player.progression < 3) {
		player.progression = 3;
	}

	player.cps++;

	document.getElementById('upgrade3').innerHTML = buttonTextFunc('upgrade3');
});

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
		].amount.plus(player.cps * delta);
	}
};

const show = function () {
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

	if (player.progression >= 1 && player.prod[1]) {
		document.getElementById('highestpoints/s').innerHTML =
			formatNumber(
				player.prod[player.prod.length - 1].amount.mul(
					player.prod[player.prod.length - 1].multiplier
				)
			).toString() +
			' p/s^' +
			(player.clickLayer + 1);
	}

	showOnce();
	updateButtons();
};

const showOnce = function () {
	if (!player.upgrades.includes(2) && player.progression >= 1 && player.prod[1]) {
		player.upgrades.push(2);
		document.getElementById('upgrade2').style = 'display: inline !important';
	}
	if (!player.upgrades.includes(3) && player.progression >= 2) {
		player.upgrades.push(3);
		document.getElementById('upgrade3').style = 'display: inline !important';
	}
};

const updateButtons = function () {
	for (let i = 1; i <= 3; i++) {
		document.getElementById('upgrade' + i).classList.remove('ableToPurchase');
		document.getElementById('upgrade' + i).classList.remove('notAbleToPurchase');
		let ableToPurchase = player.points.gte(costFunc('upgrade' + i));
		if (ableToPurchase) {
			document.getElementById('upgrade' + i).classList.add('ableToPurchase');
		} else {
			document.getElementById('upgrade' + i).classList.add('notAbleToPurchase');
		}
	}
};

const buttonTextFunc = function (name) {
	switch (name) {
		case 'upgrade1':
			return `Upgrade Button to [Get 1p/s^${player.clickLayer + 2}] (${formatNumber(
				costFunc('upgrade1')
			)}')`;

		case 'upgrade2':
			return `Get a x2 Multiplier on all producers. (${formatNumber(
				costFunc('upgrade2')
			)})`;

		case 'upgrade3':
			return `Autoclick the button at ${player.cps + 1} c/s. (${formatNumber(
				costFunc('upgrade3')
			)})`;

		default:
			return;
	}
};

const costFunc = function (name) {
	switch (name) {
		case 'upgrade1':
			if (player.clickLayer <= 10) {
				return Decimal.pow(1000, player.clickLayer + 1);
			} else {
				return Decimal.mul(
					Decimal.pow(1000, player.clickLayer + 1),
					Decimal.pow(1000, Decimal.pow(1.3, player.clickLayer - 9))
				);
			}

		case 'upgrade2':
			if (player.multiLayer <= 10) {
				return Decimal.pow(10000, player.multiLayer + 1);
			} else {
				return Decimal.mul(
					Decimal.pow(10000, player.multiLayer + 1),
					Decimal.pow(10000, Decimal.pow(1.4, player.multiLayer - 9))
				);
			}

		case 'upgrade3':
			if (player.cps <= 10) {
				return Decimal.pow(100000, player.cps + 1);
			} else {
				return Decimal.mul(
					Decimal.pow(100000, player.cps + 1),
					Decimal.pow(100000, Decimal.pow(1.5, player.cps - 9))
				);
			}

		default:
			return;
	}
};

const updateProd = function () {
	for (let i = 0; i < player.prod.length; i++) {
		player.prod[i].multiplier = Decimal.pow(2, player.multiLayer);
	}
};

const formatNumber = function (number) {
	if (number.lt(100)) {
		return Decimal.round(number.toNumber() * 10) / 10;
	}
	if (number.lt(10000)) {
		return Decimal.round(number.toNumber());
	}
	if (number.lt(1e30)) {
		let x = Decimal.floor(number.log10() / 3);
		let y = Decimal.pow(1000, x);
		return (number.toNumber() / y).toFixed(3) + ' ' + cns.numberNames[x - 1];
	}
	if (number.lt(1e100)) {
		return number.toExponential(2);
	}
	return 'e' + (Math.round(number.log10() * 100) / 100).toString();
};

const setTimers = function () {
	clearInterval(updateTimer);
	clearInterval(showTimer);
	updateTimer = setInterval(function () {
		update();
	}, player.settings.updateInterval);

	showTimer = setInterval(function () {
		show();
	}, player.settings.showInterval);
};
var updateTimer, showTimer;
setTimers();
