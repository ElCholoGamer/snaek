import inquirer from 'inquirer';
import { getGameOptions, setOption } from '../config.js';
import { menuTitle } from '../constants.js';

async function optionsMenu() {
	let lastAction = 'arenaSize';

	while (true) {
		console.clear();
		console.log(menuTitle('Options'));

		const options = getGameOptions();

		const { action } = await inquirer.prompt({
			type: 'list',
			name: 'action',
			message: 'Select an option',
			default: lastAction,
			choices: [
				{ name: `Arena size (${options.gridSize})`, value: 'arenaSize' },
				{ name: `Apple count (${options.activeApples})`, value: 'appleCount' },
				{ name: `Tick speed (${options.tickSpeed}ms)`, value: 'tickSpeed' },
				{ name: `Solid borders (${options.solidBorders ? 'Yes' : 'No'})`, value: 'solidBorders' },
				new inquirer.Separator(),
				'Go back',
			],
		});

		if (action === 'Go back') return;

		lastAction = action;

		console.clear();
		console.log(menuTitle('Options'));

		switch (action) {
			case 'arenaSize':
				const { arenaSize } = await inquirer.prompt({
					type: 'list',
					name: 'arenaSize',
					default: `${options.gridSize}`,
					message: 'Select an arena size',
					choices: [...Array(17)].map((_, index) => `${8 + index * 2}`),
				});

				setOption('gridSize', Number(arenaSize));
				break;
			case 'appleCount':
				const { appleCount } = await inquirer.prompt({
					type: 'list',
					name: 'appleCount',
					default: `${options.activeApples}`,
					message: 'Select an apple count',
					choices: [...Array(5)].map((_, index) => `${1 + index}`),
				});

				setOption('activeApples', Number(appleCount));
				break;
			case 'tickSpeed':
				const { tickSpeed } = await inquirer.prompt({
					type: 'list',
					name: 'tickSpeed',
					message: 'Select a tick speed',
					default: `${options.tickSpeed}ms`,
					choices: [...Array(5)].map((_, index) => `${50 + index * 50}ms`),
				});

				setOption('tickSpeed', Number(tickSpeed.replace('ms', '')));
				break;
			case 'solidBorders':
				const { solidBorders } = await inquirer.prompt({
					type: 'list',
					name: 'solidBorders',
					message: 'Use solid arena borders?',
					choices: ['Yes', 'No'],
					default: options.solidBorders ? 0 : 1,
				});

				setOption('solidBorders', solidBorders === 'Yes');
				break;
			case 'Go back':
				return;
		}
	}
}

export default optionsMenu;
