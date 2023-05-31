// [  ] Variables
// [  ] Functions
// [  ] Algorithms
// [  ] Display

//* Player
// Factory
const Player = (name, marker) => {
	return { name, marker };
};


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
		if (board[cell] !== '') {
			throw new Error('Field already taken!');
		} else {
			board[cell] = player.marker;
		}
	};

	// const printBoard = () => {
	// 	console.log(board[0] + ' | ' + board[1] + ' | ' + board[2]);
	// 	console.log('---------');
	// 	console.log(board[3] + ' | ' + board[4] + ' | ' + board[5]);
	// 	console.log('---------');
	// 	console.log(board[6] + ' | ' + board[7] + ' | ' + board[8]);
	// 	console.log(' ');
	// 	console.log(' ');
	// };

	return { markCell, getBoard, board };
})();

//* Game flow
// Module
const gameFlow = (() => {
	// Board
	const activeBoard = gameBoard;

	// Players
	const playerOne = Player('Player1', 'X');
	const playerTwo = Player('Player2', 'O');
	// Switch turns
	let players = [playerOne, playerTwo];
	let activePlayer = players[0];

	const switchTurns = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getActivePlayer = () => activePlayer;

	// const printNewRound = () => {
	// 	activeBoard.printBoard();
	// };

	// Winning conditions
	let winner = null;
	const points = {
		P1 : 0,
		P2 : 0,
	}

	const endGame = () => {
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

		winner = winner ? winner : activeBoard.board.includes('') ? null : 'T';
	};

	const getWinner = () => winner;

	const countPoints = (result) => {
		if (result === playerOne.marker) {
			points.P1++;
		} else if (result === playerTwo.marker) {
			points.P2++;
		}
	}

	const playRound = (cell) => {
		activeBoard.markCell(cell, activePlayer);
		endGame();
		countPoints(winner);
		console.log(points.P1);
		console.log(points.P2);
		if (winner) return winner;
		switchTurns();	
	};

	return {
		playRound,
		getActivePlayer,
		getWinner,
	};
})();

//? AI


//* Display

const displayControl = (() => {
	// DOM
	const mainDiv = document.querySelector('.main');
	
	const boardDiv = document.createElement('div');
		  boardDiv.classList.add('boardDiv');
	
	const playerTurnDiv = document.createElement('div');
		  playerTurnDiv.classList.add('turn');

	// Setup
	const game = gameFlow;

	//* Screen Update
	const screenUpdate = () => {
		const winner = game.getWinner();
		const board = gameBoard.getBoard();
		const activePlayer = game.getActivePlayer();
		
	//TODO Allow players to pick their names

	//TODO Display Players/Results
	playerTurnDiv.textContent = winner === 'T' ? `It's a TIE!` : winner === activePlayer.marker ? `Winner is ${activePlayer.name}!` : `${activePlayer.name}'s turn!`;

	//TODO Display board
		boardDiv.textContent = '';

		board.forEach((cell, index) => {
			const cellButton = document.createElement('button');
		      	  cellButton.classList.add('cell');
			  	  cellButton.dataset.cell = index;
			  	  cellButton.textContent = cell;
			
			boardDiv.appendChild(cellButton);
		});
	}
	
	// Append
	mainDiv.appendChild(playerTurnDiv);
	mainDiv.appendChild(boardDiv);

	//* Event listener
	const clickHandlerBoard = (e) => {
		const winner = game.getWinner();
		if (winner) return;
		const selectedCell = e.target.dataset.cell;
		if (!selectedCell) return;
		game.playRound(selectedCell);
		screenUpdate();
	}
	boardDiv.addEventListener('click', clickHandlerBoard);
	

	
	screenUpdate();



	//TODO Button (RE)Start button
	

})();


// ! TESTING
// // X starts
// gameFlow.playRound(0);
// gameFlow.playRound(2);
// gameFlow.playRound(1);
// gameFlow.playRound(4);
// gameFlow.playRound(5);
// gameFlow.playRound(6);

displayControl;
