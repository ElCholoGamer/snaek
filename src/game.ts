import { Direction } from './constants';
import { Coordinate, GameOptions } from './types';
import { sleep } from './utils';

class Game {
	private segments: Coordinate[] = [{ x: 4, y: 4 }];
	private apples: Coordinate[] = [...Array(this.options.activeApples)].map(() => ({ x: 0, y: 0 }));
	private keyDown = '';
	private direction = Direction.RIGHT;

	public constructor(private readonly options: GameOptions) {}

	public async run() {
		process.stdin.on('data', this.onKeyDown);

		for (let i = 0; i < this.apples.length; i++) {
			this.randomizeApple(i);
		}

		while (true) {
			this.tick();
			this.draw();
			await sleep(150);
		}
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
		switch (this.keyDown) {
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

		for (let i = this.segments.length - 1; i >= 0; i--) {
			const segment = this.segments[i];

			if (segment !== head) {
				const follow = this.segments[i - 1];
				segment.x = follow.x;
				segment.y = follow.y;
				continue;
			}

			// Head movement
			const { gridSize } = this.options;

			switch (this.direction) {
				case Direction.UP:
					head.y--;
					if (head.y < 0) head.y += gridSize;
					break;
				case Direction.DOWN:
					head.y = ++head.y % gridSize;
					break;
				case Direction.LEFT:
					head.x--;
					if (head.x < 0) head.x += gridSize;
					break;
				case Direction.RIGHT:
					head.x = ++head.x % gridSize;
					break;
			}
		}

		if (this.segments.slice(1).some(segment => head.x === segment.x && head.y === segment.y)) {
			this.stop();
		} else {
			for (let a = 0; a < this.apples.length; a++) {
				if (this.apples[a].x !== head.x || this.apples[a].y !== head.y) continue;

				this.segments.push(tailClone);
				this.randomizeApple(a);
			}
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
		console.log('Score: ' + this.score);
		console.log(grid.map(chars => chars.join(' ')).join('\n'));
	}

	private stop() {
		process.stdin.off('data', this.onKeyDown);

		console.clear();
		console.log('GAME OVER');
		console.log('Final score: ' + this.score);
		process.exit();
	}

	public get score(): number {
		return this.segments.length - 1;
	}

	private onKeyDown = (data: Buffer) => {
		this.keyDown = data.toString();
		if (this.keyDown === '\u0003') process.exit();
	};
}

export default Game;
