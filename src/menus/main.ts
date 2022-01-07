import inquirer from 'inquirer';
import { getGameOptions } from '../config.js';
import { menuTitle } from '../constants.js';
import Game from '../game.js';
import helpMenu from './help.js';
import optionsMenu from './options.js';

async function mainMenu() {
	while (true) {
		console.clear();
		console.log(menuTitle('SNAEK'));

		const { action } = await inquirer.prompt({
			type: 'list',
			name: 'action',
			prefix: '',
			message: 'Main Menu',
			choices: ['Play', 'Help', 'Options', 'Exit'],
		});

		switch (action) {
			case 'Play':
				Game.initInput();

				const game = new Game(getGameOptions());
				await game.run();
				break;
			case 'Help':
				await helpMenu();
				break;
			case 'Options':
				await optionsMenu();
				break;
			case 'Exit':
				console.clear();
				console.log('Bye bye!');
				return;
		}
	}
}

export default mainMenu;
