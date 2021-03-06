import chalk from 'chalk';
import { Direction, drawChars } from './constants.js';
import { Coordinate, GameOptions } from './types.js';
import { centerText, sleep } from './utils.js';

class Game {
	private segments: Coordinate[] = [];
	private apples: Coordinate[] = [];
	private direction = Direction.RIGHT;
	private alive = false;
	private countdown = 3;
	private hudText = '';

	private static nextDirection = Direction.RIGHT;

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

		switch (key) {
			case '\u0003':
				process.exit();
			case 'w':
			case '\u001b[A':
				Game.nextDirection = Direction.UP;
				break;
			case 's':
			case '\u001b[B':
				Game.nextDirection = Direction.DOWN;
				break;
			case 'd':
			case '\u001b[C':
				Game.nextDirection = Direction.RIGHT;
				break;
			case 'a':
			case '\u001b[D':
				Game.nextDirection = Direction.LEFT;
		}
	}

	public constructor(private readonly options: GameOptions) {}

	public async run() {
		const { gridSize } = this.options;

		const middle = Math.floor((gridSize - 1) / 2);
		this.segments.push({ x: middle, y: middle });
		this.apples.push(...[...Array(this.options.activeApples)].map(() => ({ x: 0, y: 0 })));

		this.apples.forEach(apple => this.randomizeApple(apple));

		Game.nextDirection = this.direction;
		this.alive = true;

		while (this.countdown > 0) {
			this.hudText = `Get ready! ${this.countdown--}`;
			this.draw();
			await sleep(1000);
		}

		while (true) {
			this.tick();

			if (!this.alive) break;

			this.draw();
			await sleep(this.options.tickSpeed);
		}

		let gameOverVisible = true;

		for (let i = 0; i < 7; i++) {
			this.hudText = gameOverVisible ? ' Game Over ' : '           ';
			this.draw();

			gameOverVisible = !gameOverVisible;
			await sleep(500);
		}

		await sleep(500);

		this.hudText = `Final score: ${this.score}`;
		this.draw();

		await sleep(3000);
	}

	private randomizeApple(apple: Coordinate) {
		do {
			apple.x = Math.floor(Math.random() * this.options.gridSize);
			apple.y = Math.floor(Math.random() * this.options.gridSize);
		} while (
			this.segments.some(segment => apple.x === segment.x && apple.y === segment.y) ||
			this.apples.some((other, i) => other !== apple && apple.x === other.x && apple.y === other.y)
		);
	}

	private tick() {
		switch (Game.nextDirection) {
			case Direction.UP:
				if (this.direction !== Direction.DOWN) {
					this.direction = Direction.UP;
				}
				break;
			case Direction.DOWN:
				if (this.direction !== Direction.UP) {
					this.direction = Direction.DOWN;
				}
				break;
			case Direction.RIGHT:
				if (this.direction !== Direction.LEFT) {
					this.direction = Direction.RIGHT;
				}
				break;
			case Direction.LEFT:
				if (this.direction !== Direction.RIGHT) {
					this.direction = Direction.LEFT;
				}
		}

		const tailClone = { ...this.segments[this.segments.length - 1] };
		const newHead = { ...this.segments[0] };

		const { gridSize, solidBorders } = this.options;

		// Head movement
		switch (this.direction) {
			case Direction.UP:
				newHead.y--;
				break;
			case Direction.DOWN:
				newHead.y++;
				break;
			case Direction.LEFT:
				newHead.x--;
				break;
			case Direction.RIGHT:
				newHead.x++;
		}

		if (!solidBorders) {
			if (newHead.y < 0) {
				newHead.y += gridSize;
			} else {
				newHead.y %= gridSize;
			}

			if (newHead.x < 0) {
				newHead.x += gridSize;
			} else {
				newHead.x %= gridSize;
			}
		}

		const bodySegments = this.segments.slice(1, this.segments.length - 1);

		if (
			(solidBorders &&
				(newHead.x < 0 || newHead.y < 0 || newHead.x >= gridSize || newHead.y >= gridSize)) ||
			bodySegments.some(segment => newHead.x === segment.x && newHead.y === segment.y)
		) {
			// ded
			this.alive = false;
			return;
		}

		for (const apple of this.apples) {
			if (apple.x === newHead.x && apple.y === newHead.y) {
				this.segments.push(tailClone);
				this.randomizeApple(apple);
				break;
			}
		}

		for (let i = this.segments.length - 1; i > 0; i--) {
			const follow = this.segments[i - 1];
			this.segments[i].x = follow.x;
			this.segments[i].y = follow.y;
		}

		this.segments[0] = newHead;

		this.hudText = `Score: ${this.score}`;
	}

	private draw() {
		const { empty, hudLine, snakeBody, snakeDead, apple } = drawChars;

		const { gridSize } = this.options;
		const grid: string[][] = [...Array(gridSize)].map(() => Array(gridSize).fill(empty));

		for (const applePos of this.apples) {
			grid[applePos.y][applePos.x] = apple;
		}

		for (let i = 0; i < this.segments.length; i++) {
			const segment = this.segments[i];
			grid[segment.y][segment.x] = !this.alive && i === 0 ? snakeDead : snakeBody;
		}

		const centeredHud = centerText(` ${this.hudText} `, this.options.gridSize * 2 - 1, hudLine);

		console.clear();
		console.log(chalk.bold(centeredHud));
		console.log(grid.map(chars => chars.join(' ')).join('\n'));
	}

	public get score(): number {
		return this.segments.length - 1;
	}
}

export default Game;
