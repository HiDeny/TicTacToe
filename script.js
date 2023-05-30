// [  ] Variables
// [  ] Functions
// [  ] Algorithms
// [  ] Display

//* Player
// Factory
const Player = (name, marker) => {
	return { name, marker };
};

const playerOne = Player('Player1', 'X');
const playerTwo = Player('Player2', 'O');

//* Game board
// Module
const gameBoard = (() => {
	const rows = 3;
	const columns = 3;
	const board = [];

	// Console board, 2d array
	for (let i = 0; i < rows * columns; i++) {
		board[i] = '';
	}

	const getBoard = () => board;

	// Mark Cell
	const markCell = (cell, player) => {
		if (cell > columns * rows) {
			throw new Error('Stay in on the board!');
		} else if (board[cell] !== '') {
			throw new Error('Field already taken!');
		} else {
			board[cell] = player.marker;
		}
	};

	const printBoard = () => {
		console.log(board[0] + ' | ' + board[1] + ' | ' + board[2]);
		console.log('---------');
		console.log(board[3] + ' | ' + board[4] + ' | ' + board[5]);
		console.log('---------');
		console.log(board[6] + ' | ' + board[7] + ' | ' + board[8]);
		console.log(' ');
		console.log(' ');
	};

	return { markCell, printBoard, getBoard, board };
})();

//* Game flow
// Module
const gameFlow = (() => {
	// Board
	const activeBoard = gameBoard;

	// Switch turns
	let players = [playerOne, playerTwo];
	let activePlayer = players[0];

	const switchTurns = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getActivePlayer = () => activePlayer;

	const printNewRound = () => {
		activeBoard.printBoard();
	};

	// Winning conditions
	const endGame = () => {
		let winner = null;
		const winningComb = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[6, 4, 2],
		];

		winningComb.forEach((combo, index) => {
			if (
				activeBoard.board[combo[0]] &&
				activeBoard.board[combo[0]] === activeBoard.board[combo[1]] &&
				activeBoard.board[combo[0]] === activeBoard.board[combo[2]]
			) {
				winner = activeBoard.board[combo[0]];
			}
		});

		return winner ? winner : activeBoard.board.includes('') ? null : 'T';
	};

	const playRound = (cell) => {
		activeBoard.markCell(cell, activePlayer);
		win = endGame();
		if (win) {
			if (win === 'T') {
				console.log(`It's a TIE !`);
			} else {
				console.log(`Winner is ${activePlayer.name} !`);
				printNewRound();

			}
		} else {
			console.log(`${activePlayer.name}'s turn`);
			printNewRound();
			switchTurns();
		}
	};

	return {
		playRound,
		getActivePlayer,
	};
})();

//? AI

// ! TESTING
// X starts
gameFlow.playRound(0);
gameFlow.playRound(2);
gameFlow.playRound(1);
gameFlow.playRound(4);
gameFlow.playRound(5);
gameFlow.playRound(6);
