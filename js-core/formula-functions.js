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
			return `Sacrifice all your progress, to reset for a multiplier (e100)
			[x${formatNumber(getFormula('sacrifice'), 2)}]`;
		case 'mana':
			return `Reset all your progress, to unlock Mana (e308.25)
			[${formatNumber(getFormula('mana'), 0)}]`;

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
			return new Decimal('1e100');

		case 'mana':
			return new Decimal(Number.MAX_VALUE);

		default:
			return 1;
	}
};

const getFormula = function (name) {
	switch (name) {
		case 'sacrifice':
			if (player.points.gte(getCost('sacrifice'))) {
				if (player.sacrificeMultiplier.lt(1e4)) {
					return Decimal.pow(player.points.log10() - 99, 0.2);
				} else {
					return Decimal.pow(player.points.log10() - 99, 0.0005);
				}
			}
			return new Decimal(1);

		case 'mana':
			if (player.points.gte(getCost('mana'))) {
				return new Decimal(1);
			}
			return new Decimal(0);

		default:
			return;
	}
};
