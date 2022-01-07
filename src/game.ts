import chalk from 'chalk';
import { Direction } from './constants.js';
import { Coordinate, GameOptions } from './types.js';
import { sleep } from './utils.js';

class Game {
	private segments: Coordinate[] = [];
	private apples: Coordinate[] = [];
	private direction = Direction.RIGHT;
	private alive = false;
	private countdown = 3;

	private static keyDown = '';

	public static initInput() {
		process.stdin.setRawMode(true);
		process.stdin.resume();
		process.stdin.setEncoding('utf-8');

		if (!process.stdin.listeners('data').includes(Game.handleStdin)) {
			process.stdin.on('data', Game.handleStdin);
		}
	}

	public static handleStdin(data: Buffer) {
		const key = data.toString();
		if (key === '\u0003') process.exit();

		if ('wasd'.includes(key)) {
			Game.keyDown = key;
		}
	}

	public constructor(private readonly options: GameOptions) {}

	public async run() {
		const { gridSize } = this.options;

		this.segments.push({ x: Math.floor(gridSize / 2), y: Math.floor(gridSize / 2) });
		this.apples.push(...[...Array(this.options.activeApples)].map(() => ({ x: 0, y: 0 })));

		for (let i = 0; i < this.apples.length; i++) {
			this.randomizeApple(i);
		}

		for (let i = 0; i < 3; i++) {
			this.draw();

			await sleep(1000);
			this.countdown--;
		}

		this.alive = true;

		while (true) {
			this.tick();

			if (!this.alive) break;

			this.draw();
			await sleep(this.options.tickSpeed);
		}

		console.clear();
		console.log('GAME OVER');
		console.log('Final score: ' + this.score);
	}

	private randomizeApple(index: number) {
		const apple = this.apples[index];

		do {
			apple.x = Math.floor(Math.random() * this.options.gridSize);
			apple.y = Math.floor(Math.random() * this.options.gridSize);
		} while (
			this.segments.some(segment => apple.x === segment.x && apple.y === segment.y) ||
			this.apples.some((other, i) => i !== index && apple.x === other.x && apple.y === other.y)
		);
	}

	private tick() {
		switch (Game.keyDown) {
			case 'w':
				if (this.direction !== Direction.DOWN) {
					this.direction = Direction.UP;
				}
				break;
			case 'd':
				if (this.direction !== Direction.LEFT) {
					this.direction = Direction.RIGHT;
				}
				break;
			case 's':
				if (this.direction !== Direction.UP) {
					this.direction = Direction.DOWN;
				}
				break;
			case 'a':
				if (this.direction !== Direction.RIGHT) {
					this.direction = Direction.LEFT;
				}
		}

		const tailClone = { ...this.segments[this.segments.length - 1] };
		const head = this.segments[0];

		for (let i = this.segments.length - 1; i > 0; i--) {
			const follow = this.segments[i - 1];
			this.segments[i].x = follow.x;
			this.segments[i].y = follow.y;
		}

		// Head movement
		const { gridSize, solidBorders } = this.options;

		switch (this.direction) {
			case Direction.UP:
				head.y--;
				break;
			case Direction.DOWN:
				head.y++;
				break;
			case Direction.LEFT:
				head.x--;
				break;
			case Direction.RIGHT:
				head.x++;
		}

		if (!solidBorders) {
			if (head.y < 0) {
				head.y += gridSize;
			} else {
				head.y %= gridSize;
			}

			if (head.x < 0) {
				head.x += gridSize;
			} else {
				head.x %= gridSize;
			}
		}

		if (
			(solidBorders && (head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize)) ||
			this.segments.slice(1).some(segment => head.x === segment.x && head.y === segment.y)
		) {
			// ded
			this.alive = false;
			return;
		}

		for (let a = 0; a < this.apples.length; a++) {
			if (this.apples[a].x !== head.x || this.apples[a].y !== head.y) continue;

			this.segments.push(tailClone);
			this.randomizeApple(a);
		}
	}

	private draw() {
		const { gridSize } = this.options;
		const grid: string[][] = [...Array(gridSize)].map(() => Array(gridSize).fill('.'));

		for (const apple of this.apples) {
			grid[apple.y][apple.x] = '\u25cf';
		}

		for (const segment of this.segments) {
			grid[segment.y][segment.x] = '\u25a0';
		}

		console.clear();
		if (this.countdown > 0) {
			console.log(chalk.bold(`Get ready! ${this.countdown}`));
		} else {
			console.log('Score: ' + this.score);
		}
		console.log(grid.map(chars => chars.join(' ')).join('\n'));
	}

	public get score(): number {
		return this.segments.length - 1;
	}
}

export default Game;
