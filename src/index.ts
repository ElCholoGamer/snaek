import chalk from 'chalk';
import inquirer from 'inquirer';
import { menuTitle } from './constants';
import Game from './game';
import { waitForKeyPress } from './utils';

async function helpMenu() {
	const help = [
		'Use the WASD keys to move.',
		'Grab apples (\u25cf) and avoid crashing into your body (\u25a0).',
	];

	console.clear();
	console.log(menuTitle('How to Play'));
	console.log(chalk.bold(help.join('\n')));
	console.log();
	console.log('Press any key to continue...');

	await waitForKeyPress();
}

async function main() {
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

				const game = new Game({ gridSize: 10, activeApples: 2 });
				await game.run();
				break;
			case 'Help':
				await helpMenu();
				break;
			case 'Options':
				console.log('Options menu');
				break;
			case 'Exit':
				console.clear();
				console.log('Bye bye!');
				return;
		}
	}
}

main().then(() => process.exit());
