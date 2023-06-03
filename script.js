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
	let board = [];

	// Console board, 2d array
	for (let i = 0; i < rows * columns; i++) {
		board[i] = i;
	}

	const getBoard = () => board;

	// Mark Cell
	const markCell = (cell, player) => {
		if (board[cell] == 'X' || board[cell] == 'O') {
			throw new Error('Field already taken!');
		} else {
			board[cell] = player.marker;
		}
	};

	const newBoard = () => {
		board = [];

		for (let i = 0; i < rows * columns; i++) {
			board[i] = i;
		}

		return board;
	};
	return { markCell, getBoard, newBoard, board };
})();

//* Game flow
// Module
const gameFlow = (() => {
	// Board
	const activeBoard = gameBoard;

	// Players
	let playerOne = Player('Player1', 'X');
	let playerTwo = Player('Player2', 'O');
	let players = [playerOne, playerTwo];
	let newNames = [];

	const setNames = (newNames) => {
		playerOne = newNames[0] ? Player(newNames[0], 'X') : playerOne;
		playerTwo = newNames[1] ? Player(newNames[1], 'O') : playerTwo;

		players = [playerOne, playerTwo];
	};

	// Switch turns
	let activePlayer = players[0];

	//? AI
	const aiPlayer = (board, player, level) => {
		let nextMove = 4;
		let aiMark = player;
		let opponentMark = player === 'X' ? 'O' : 'X';
		// Empty cells
		const emptyIndexes = (board) => {
			return board.filter((s) => s != 'O' && s != 'X');
		};

		//! Setup AI - Easy, pick random moves
		const easyAi = () => {
			let randomIndex = Math.floor(Math.random() * emptyIndexes(board).length);
			let randomCell = emptyIndexes(board)[randomIndex];
			nextMove = randomCell;
		};

		// Winning?
		const winning = (board, player) => {
			let result = false;
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

			winningComb.forEach((combo) => {
				if (
					board[combo[0]] === player &&
					board[combo[0]] === board[combo[1]] &&
					board[combo[0]] === board[combo[2]]
				) {
					result = true;
				}
			});

			return result;
		};

		//! Setup AI - Unbeatable, minimax only
		const unbAi = () => {
			// The main minimax func
			const minimax = (newBoard, player) => {
				
				// Free spots
				let availSpots = emptyIndexes(newBoard);

				//Check terminal states, win, lose, tie
				if (winning(newBoard, opponentMark)) {
					return { score: -10 };
				} else if (winning(newBoard, aiMark)) {
					return { score: 10 };
				} else if (availSpots.length === 0) {
					return { score: 0 };
				}

				// Collect all objects
				let moves = [];

				for (let i = 0; i < availSpots.length; i++) {
					let move = {};
					move.index = newBoard[availSpots[i]];

					newBoard[availSpots[i]] = player;
					if (player === aiMark) {
						let result = minimax(newBoard, opponentMark);
						move.score = result.score;
					} else {
						let result = minimax(newBoard, aiMark);
						move.score = result.score;
					}

					newBoard[availSpots[i]] = move.index;

					moves.push(move);
				}

				let bestMove;
				if (player === aiMark) {
					let bestScore = -10000;
					for (let i = 0; i < moves.length; i++) {
						if (moves[i].score > bestScore) {
							bestScore = moves[i].score;
							bestMove = i;
						}
					}
				} else {
					let bestScore = 10000;
					for (let i = 0; i < moves.length; i++) {
						if (moves[i].score < bestScore) {
							bestScore = moves[i].score;
							bestMove = i;
						}
					}
				}

				return moves[bestMove];
			};
			console.log(minimax(board, player));
			nextMove = minimax(board, player).index;
		};

		// Setup AI - Medium, pick random moves + minimax

		console.log(level);

		// if (level.include('Easy')){
		// 	console.log('Level 0');
		// } else if (level.include('Easy')){
		// 	console.log('Level 2');
		// }
		// easyAi();
		unbAi();
		console.log(nextMove);
		return nextMove;
	};

	const switchTurns = () => {
		activePlayer = activePlayer === players[0] ? players[1] : players[0];
	};

	const getPlayers = () => players;
	const getActivePlayer = () => activePlayer;

	// Winning conditions
	let winner = null;
	const points = {
		P1: 0,
		P2: 0,
	};

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

		const emptyCells = (board) => board.filter((s) => s != 'X' && s != 'O');
		winner = winner
			? winner
			: emptyCells(activeBoard.board).length > 0
			? null
			: 'T';
	};

	const getWinner = () => winner;

	const countPoints = (result) => {
		if (result === playerOne.marker) {
			points.P1++;
		} else if (result === playerTwo.marker) {
			points.P2++;
		}
	};

	const getPoints = () => points;

	const playRound = (cell) => {
		activeBoard.markCell(cell, activePlayer);
		endGame();
		countPoints(winner);
		if (winner) {
			return winner;
		}
		switchTurns();
	};

	const newGame = () => {
		activeBoard.board = activeBoard.newBoard();
		activePlayer = players[0];
		winner = null;
	};

	return {
		setNames,
		playRound,
		getPlayers,
		getActivePlayer,
		getWinner,
		getPoints,
		newGame,
		aiPlayer,
	};
})();

//* Display
const displayControl = (() => {
	// DOM
	const mainDiv = document.querySelector('.main');

	const boardDiv = document.createElement('div');
	boardDiv.classList.add('boardDiv');

	const boardDesk = document.createElement('div');
	boardDesk.classList.add('boardDesk');

	const playerTurnDiv = document.createElement('div');
	playerTurnDiv.classList.add('turn');

	const pointsDiv = document.createElement('div');
	pointsDiv.classList.add('points');

	const pointsP1 = document.createElement('p');
	const pointsP2 = document.createElement('p');

	//TODO Ai
	let nextStep = true;
	const aiPlayerMove = () => {
		//? AI
		const activePlayer = game.getActivePlayer();
		const board = gameBoard.getBoard();
		const winner = game.getWinner();
		if (winner) return;
		let aiCell = game.aiPlayer(board, activePlayer.marker, activePlayer.name);
		game.playRound(aiCell);
		console.log(board);
		screenUpdate();
	};

	const onlyAiGame = () => {
		nextStep = false;
		const winner = game.getWinner();
		if (winner) return;
		// First move
		setTimeout(aiPlayerMove, 500);
		// Second move;
		setTimeout(aiPlayerMove, 1500);
		// Next round
		setTimeout(onlyAiGame, 2000);
	};

	//TODO Button (RE)Start button
	const startDiv = document.createElement('div');
	startDiv.setAttribute('class', 'startDiv');

	const resetBtn = document.createElement('button');
	resetBtn.classList.add('resetBtn');
	resetBtn.textContent = 'RESTART';
	resetBtn.addEventListener('click', () => {
		const players = game.getPlayers();
		game.newGame();
		if (players[0].name === 'Ai' && players[1].name === 'Ai') {
			console.log('Only AI game');
			onlyAiGame();
		} else if (players[0].name === 'Ai' && players[1].name !== 'Ai') {
			nextStep = false;
			setTimeout(aiPlayerMove, 500);
			setTimeout(() => {
				nextStep = true;
			}, 1200);
		}
		screenUpdate();
	});

	//TODO Allow players to pick their names
	const changeNames = () => {
		let newNames = [];

		const mainDiv = document.querySelector('.main');

		const formDiv = document.createElement('div');
		formDiv.classList.add('formDiv');

		const setNamesForm = document.createElement('form');
		setNamesForm.setAttribute('id', 'setNames');
		setNamesForm.setAttribute('action', '');
		setNamesForm.setAttribute('method', 'post');

		setNamesForm.addEventListener('submit', (e) => {
			e.preventDefault();
			const formData = new FormData(setNamesForm);
			const newNamesData = Object.fromEntries(formData.entries());

			newNames[0] = newNamesData.name1;
			newNames[1] = newNamesData.name2;

			game.setNames(newNames);
			game.newGame();
			screenUpdate();

			//? Ai

			if (newNames[0] === 'Ai' && newNames[1] === 'Ai') {
				console.log('Only AI game');
				onlyAiGame();
			} else if (newNames[0] === 'Ai' && newNames[1] !== 'Ai') {
				nextStep = false;
				setTimeout(aiPlayerMove, 500);
				setTimeout(() => {
					nextStep = true;
				}, 1200);
			}

			startDiv.appendChild(resetBtn);
			formDiv.remove();
		});

		const setName1 = document.createElement('input');
		setName1.setAttribute('type', 'text');
		setName1.setAttribute('id', 'name1');
		setName1.setAttribute('name', 'name1');
		setName1.setAttribute('placeholder', 'Player 1');

		const setName2 = document.createElement('input');
		setName2.setAttribute('type', 'text');
		setName2.setAttribute('id', 'name2');
		setName2.setAttribute('name', 'name2');
		setName2.setAttribute('placeholder', 'Player 2');

		const submitBtn = document.createElement('button');
		submitBtn.setAttribute('type', 'submit');
		submitBtn.setAttribute('class', 'submitBtn');
		submitBtn.innerText = 'PLAY!';

		setNamesForm.appendChild(setName1);
		setNamesForm.appendChild(setName2);
		setNamesForm.appendChild(submitBtn);
		formDiv.appendChild(setNamesForm);

		mainDiv.appendChild(formDiv);
	};
	changeNames();

	// Append
	mainDiv.insertBefore(startDiv, mainDiv.firstChild);
	pointsDiv.appendChild(pointsP1);
	pointsDiv.appendChild(pointsP2);
	mainDiv.appendChild(pointsDiv);
	mainDiv.appendChild(playerTurnDiv);
	mainDiv.appendChild(boardDiv);

	// Setup
	const game = gameFlow;

	//* Screen Update
	const screenUpdate = () => {
		const winner = game.getWinner();
		const board = gameBoard.getBoard();
		const players = game.getPlayers();
		const activePlayer = game.getActivePlayer();
		const points = game.getPoints();

		//TODO Display Players/Results
		playerTurnDiv.textContent =
			winner === 'T'
				? `It's a TIE!`
				: winner === activePlayer.marker
				? `Winner is ${activePlayer.name}!`
				: `${activePlayer.name}'s turn!`;

		pointsP1.textContent = `${players[0].name}: ${points.P1}`;
		pointsP2.textContent = `${players[1].name}: ${points.P2}`;

		//TODO Display board
		boardDesk.textContent = '';

		board.forEach((cell, index) => {
			const cellButton = document.createElement('button');
			cellButton.classList.add('cell');
			cellButton.dataset.cell = index;
			cellButton.textContent = cell === 'X' || cell === 'O' ? cell : '';

			if (cellButton.textContent === 'X') {
				cellButton.classList.add('red');
			} else if (cellButton.textContent === 'O') {
				cellButton.classList.add('blue');
			}

			boardDesk.appendChild(cellButton);
		});

		boardDiv.appendChild(boardDesk);
	};

	//* Event listener
	const clickHandlerBoard = (e) => {
		const winner = game.getWinner();
		const players = game.getPlayers();

		if (winner) return;
		if (nextStep) {
			const selectedCell = e.target.dataset.cell;
			if (!selectedCell) return;
			game.playRound(selectedCell);
			screenUpdate();
			if (players[0].name === 'Ai' || players[1].name === 'Ai') {
				nextStep = false;
				setTimeout(aiPlayerMove, 1000);
				setTimeout(() => {
					nextStep = true;
				}, 1200);
			}
		}
	};
	boardDiv.addEventListener('click', clickHandlerBoard);
})();
