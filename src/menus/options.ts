import inquirer from 'inquirer';
import { getGameOptions, setOption } from '../config.js';
import { menuTitle } from '../constants.js';

async function optionsMenu() {
	while (true) {
		console.clear();
		console.log(menuTitle('Options'));

		const options = getGameOptions();

		const { action } = await inquirer.prompt({
			type: 'list',
			name: 'action',
			message: 'Select an option',
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

		console.clear();
		console.log(menuTitle('Options'));

		switch (action) {
			case 'arenaSize':
				const { arenaSize } = await inquirer.prompt({
					type: 'list',
					name: 'arenaSize',
					default: options.gridSize,
					message: 'Select an arena size',
					choices: [...Array(5)].map((_, index) => {
						const value = 8 + index * 8;
						return { name: `${value}`, value };
					}),
				});

				setOption('gridSize', arenaSize);
				break;
			case 'appleCount':
				const { appleCount } = await inquirer.prompt({
					type: 'list',
					name: 'appleCount',
					default: options.activeApples,
					message: 'Select an apple count',
					choices: [...Array(5)].map((_, index) => {
						const value = 1 + index;
						return { name: `${value}`, value };
					}),
				});

				setOption('activeApples', appleCount);
				break;
			case 'tickSpeed':
				const { tickSpeed } = await inquirer.prompt({
					type: 'list',
					name: 'tickSpeed',
					message: 'Select a tick speed',
					default: options.tickSpeed,
					choices: [...Array(5)].map((_, index) => {
						const value = 50 + index * 50;
						return { name: `${value}ms`, value };
					}),
				});

				setOption('tickSpeed', tickSpeed);
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
