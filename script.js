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
		board[i] = ' ';
	}

	const getBoard = () => board;

	// Mark Cell
	const markCell = (cell, player) => {
		if (cell > columns * rows) {
			throw new Error('Stay in on the board!');
		} else if (board[cell] !== ' ') {
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
		console.log(`${activePlayer.name}'s turn`);
		activeBoard.printBoard();
	};

	const endGame = () => {
		if (
			activeBoard.board[0] &&
			activeBoard.board[0] === activeBoard.board[1] &&
			activeBoard.board[0] === activeBoard.board[2]
		) {
			console.log(activeBoard.board[0]);
			return activeBoard.board[0];
		}

		// const winningComb = [
		// 	[0, 1, 2],
		// 	[3, 4, 5],
		// 	[6, 7, 8],
		// 	[0, 3, 6],
		// 	[1, 4, 7],
		// 	[2, 5, 8],
		// 	[0, 4, 8],
		// 	[6, 4, 2],
		// ]

		// //console.log(winningComb);
		// winningComb.forEach((combo, index) => {
		// 	if (activeBoard.board[combo[0]] &&
		// 		activeBoard.board[combo[0]] === activeBoard.board[combo[1]] &&
		// 		activeBoard.board[combo[0]] === activeBoard.board[combo[2]]) {
		// 			return	activeBoard.board[combo[0]]
		// 		}
		// })
		//
		// })
		// winningComb.forEach((combo, index) => {
		// 	if (activeBoard.board[row][0] &&
		// 		activeBoard.board[row][0] === activeBoard.board[row][1] &&
		// 		activeBoard.board[row][0] === activeBoard.board[row][2]) {
		// 			return	activeBoard.board[row][0]
		// 		}
		// })

		// let win1 = [0, 1, 2];
		// let win2 = [3, 4, 5];
		// let win3 = [6, 7, 8];
		// let win4 = [0, 3, 6];
		// let win5 = [1, 4, 7];
		// let win6 = [2, 5, 8];
		// let win7 = [0, 4, 8];
		// let win8 = [6, 4, 2];

		// let draw = [];
	};

	const playRound = (cell) => {
		activeBoard.markCell(cell, activePlayer);
		console.log(endGame());
		// if (endGame(row)) {
		// 	let winner = endGame(row) === 'X' ? playerOne.name : playerTwo.name ;
		//console.log(`Winner is ${winner}`);
		// }
		printNewRound();
		switchTurns();
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
gameFlow.playRound(3);
gameFlow.playRound(1);
gameFlow.playRound(4);
gameFlow.playRound(2);
gameFlow.playRound(6);
