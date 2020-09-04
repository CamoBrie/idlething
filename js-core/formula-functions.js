const getButtonText = function (name) {
	switch (name) {
		case 'upgrade1':
			return `Upgrade Button to [Get 1p/s^${player.clickLayer + 2}] (${formatNumber(
				getCost('upgrade1')
			)})`;

		case 'upgrade2':
			return `Get a x2 Multiplier on all producers. (${formatNumber(
				getCost('upgrade2')
			)})`;

		case 'upgrade3':
			return `Autoclick the button at ${player.cps + 1} c/s. (${formatNumber(
				getCost('upgrade3')
			)})`;
		case 'sacrifice':
			return `Sacrifice all your progress, to reset for a multiplier (e150)
			[x${formatNumber(getFormula('sacrifice'), 2)}]`;

		default:
			return;
	}
};

const getCost = function (name) {
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
		case 'sacrifice':
			return new Decimal('1e150');

		default:
			return;
	}
};

const getFormula = function (name) {
	switch (name) {
		case 'sacrifice':
			if (player.points.gte(getCost('sacrifice'))) {
				return Decimal.pow(player.points.log10() - 149, 0.2);
			}
			return new Decimal(1);

		default:
			return 0;
	}
};
