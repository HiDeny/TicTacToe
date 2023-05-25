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

	for (let i = 0; i < rows; i++) {
		board[i] = [];
		for (let j = 0; j < columns; j++) {
			board[i].push('-');
		}
	}

    const getBoard = () => board;

	// Mark Cell
	const markCell = (row, column, player) => {
		if (row > rows - 1 || column > columns - 1) {
			throw new Error('Stay in on the board!');
		} else if (board[row][column] !== '-'){
            throw new Error('Field already taken!')
		} else {
			board[row][column] = player.marker;
        }
        
	};

    

	const printBoard = () => {
		console.log(board[0]);
		console.log(board[1]);
		console.log(board[2]);
	};

	return { markCell, printBoard, getBoard };
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
        let win1 = [0, 1, 2];
        let win2 = [3, 4, 5];
        let win3 = [6, 7, 8];

        let win4 = [0, 3, 6];
        let win5 = [1, 4, 7];
        let win6 = [2, 5, 8];

        let win7 = [0, 4, 8];
        let win8 = [6, 4, 2];

        let draw = [];
    }
 

	const playRound = (row, column) => {
        console.log(row, column);
		activeBoard.markCell(row, column, activePlayer);
        console.log(activeBoard.getBoard()[row]);



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

gameFlow.playRound(0, 0);
gameFlow.playRound(1, 2);
gameFlow.playRound(0, 1);
gameFlow.playRound(2, 1);
gameFlow.playRound(0, 2);

