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

	//TODO AI

	const aiPlayer = (board, player, level) => {
		let nextMove = 4;
		let aiMark = player;
		let opponentMark = player === 'X' ? 'O' : 'X';
		// Empty cells
		const emptyIndexes = (board) => {
			return board.filter((s) => s != 'O' && s != 'X');
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

		//! Setup AI - Easy, pick random moves
		const easyAi = () => {
			let randomIndex = Math.floor(Math.random() * emptyIndexes(board).length);
			let randomCell = emptyIndexes(board)[randomIndex];
			nextMove = randomCell;
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
			nextMove = minimax(board, player).index;
		};

		//! Setup AI - Medium, pick random moves + minimax
		const mediumAi = () => {
			let randomNum = Math.floor(Math.random() * 5);
			if (aiMark === 'O') {
				if (randomNum < 1) {
					easyAi();
				} else {
					unbAi();
				}
			} else {
				if (randomNum < 2) {
					easyAi();
				} else {
					unbAi();
				}
			}
		};

		if (level === 'Easy') {
			easyAi();
		} else if (level === 'Medium') {
			mediumAi();
		} else if (level === 'Hard') {
			unbAi();
		}

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
	pointsP1.classList.add('red');
	pointsP1.classList.add('points');

	const pointsP2 = document.createElement('p');
	pointsP2.classList.add('blue');
	pointsP2.classList.add('points');

	//TODO Ai
	let nextStep = true;
	const aiPlayerMove = () => {
		const activePlayer = game.getActivePlayer();
		const board = gameBoard.getBoard();
		const winner = game.getWinner();
		if (winner) return;
		let aiCell = game.aiPlayer(board, activePlayer.marker, activePlayer.name);
		game.playRound(aiCell);
		screenUpdate();
	};

	//TODO Button (RE)Start button
	const startDiv = document.createElement('div');
	startDiv.setAttribute('class', 'startDiv');

	const resetBtn = document.createElement('button');
	resetBtn.classList.add('resetBtn');
	resetBtn.classList.add('nes-btn');
	resetBtn.classList.add('is-primary');
	resetBtn.textContent = 'Next Round';
	resetBtn.addEventListener('click', () => {
		const players = game.getPlayers();
		game.newGame();
		if (
			players[0].name === 'Easy' ||
			players[0].name === 'Medium' ||
			players[0].name === 'Hard'
		) {
			nextStep = false;
			setTimeout(aiPlayerMove, 500);
			setTimeout(() => {
				nextStep = true;
			}, 1200);
		}
		screenUpdate();
	});

	//TODO Settings Button
	const menuBtn = document.createElement('button');
	menuBtn.classList.add('menuBtn');
	menuBtn.classList.add('nes-btn');
	menuBtn.classList.add('is-error');
	menuBtn.textContent = 'MENU';
	menuBtn.addEventListener('click', () => {
		location.reload();
	});

	//TODO Allow players to pick their names
	const PvP = () => {
		let newNames = [];

		const mainDiv = document.querySelector('.main');

		const PvPDiv = document.createElement('div');
		PvPDiv.classList.add('PvPDiv');

		const setNamesForm = document.createElement('form');
		setNamesForm.setAttribute('id', 'setNames');
		setNamesForm.classList.add('nes-container');
		setNamesForm.classList.add('is-rounded');
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

			startDiv.appendChild(menuBtn);
			startDiv.appendChild(resetBtn);
			PvPDiv.remove();
		});

		const setName1 = document.createElement('input');
		setName1.setAttribute('type', 'text');
		setName1.setAttribute('id', 'name1');
		setName1.setAttribute('name', 'name1');
		setName1.setAttribute('class', 'nes-input');
		setName1.setAttribute('placeholder', 'Player X');

		const setName2 = document.createElement('input');
		setName2.setAttribute('type', 'text');
		setName2.setAttribute('id', 'name2');
		setName2.setAttribute('name', 'name2');
		setName2.setAttribute('class', 'nes-input');
		setName2.setAttribute('placeholder', 'Player O');

		const submitBtn = document.createElement('button');
		submitBtn.setAttribute('type', 'submit');
		submitBtn.classList.add('submitBtn');
		submitBtn.classList.add('nes-btn');
		submitBtn.classList.add('is-success');
		submitBtn.innerText = 'PLAY!';

		setNamesForm.appendChild(setName1);
		setNamesForm.appendChild(setName2);
		setNamesForm.appendChild(submitBtn);
		PvPDiv.appendChild(setNamesForm);

		mainDiv.appendChild(PvPDiv);
	};

	const PvA = () => {
		let newNames = [];

		const PvADiv = document.createElement('div');
		PvADiv.classList.add('PvADiv');

		const PvASettings = document.createElement('form');
		PvASettings.setAttribute('id', 'PvAform');
		PvASettings.classList.add('nes-container');
		PvASettings.classList.add('is-rounded');
		PvASettings.setAttribute('action', '');
		PvASettings.setAttribute('method', 'post');

		PvASettings.addEventListener('submit', (e) => {
			e.preventDefault();
			const formData = new FormData(PvASettings);
			const newData = Object.fromEntries(formData.entries());

			const marker = newData.marker;
			const difficulty = newData.difficulty;
			const name = newData.name1;

			if (marker === 'X') {
				newNames[0] = name;
				newNames[1] = difficulty;
			}
			if (marker === 'O') {
				newNames[0] = difficulty;
				newNames[1] = name;
			}

			game.setNames(newNames);
			game.newGame();
			screenUpdate();

			//TODO Ai
			if (newNames[0] === difficulty) {
				nextStep = false;
				setTimeout(aiPlayerMove, 1000);
				setTimeout(() => {
					nextStep = true;
				}, 1200);
			}
			startDiv.appendChild(menuBtn);
			startDiv.appendChild(resetBtn);
			PvADiv.remove();
		});

		// Set players name
		const setName1 = document.createElement('input');
		setName1.setAttribute('type', 'text');
		setName1.setAttribute('id', 'name1');
		setName1.setAttribute('name', 'name1');
		setName1.setAttribute('class', 'nes-input');
		setName1.setAttribute('placeholder', 'Player');

		// Set players marker
		const fieldsetMarker = document.createElement('fieldset');
		fieldsetMarker.classList.add('setMarker');
		const legendMarker = document.createElement('legend');
		legendMarker.classList.add('LegendMarker');
		legendMarker.textContent = 'Pick Marker:';

		fieldsetMarker.appendChild(legendMarker);

		// X
		const markerXDiv = document.createElement('div');
		markerXDiv.classList.add('markerXDiv');

		const markerX = document.createElement('label');

		const optionX = document.createElement('input');
		optionX.setAttribute('type', 'radio');
		optionX.setAttribute('id', 'markerX');
		optionX.setAttribute('class', 'nes-radio');
		optionX.setAttribute('name', 'marker');
		optionX.setAttribute('value', 'X');
		optionX.setAttribute('checked', true);

		const spanX = document.createElement('span');
		spanX.textContent = 'X';

		markerX.appendChild(optionX);
		markerX.appendChild(spanX);
		markerXDiv.appendChild(markerX);
		fieldsetMarker.appendChild(markerXDiv);

		// O
		const markerODiv = document.createElement('div');
		markerODiv.classList.add('markerODiv');

		const markerO = document.createElement('label');

		const optionO = document.createElement('input');
		optionO.setAttribute('type', 'radio');
		optionO.setAttribute('id', 'markerO');
		optionO.setAttribute('class', 'nes-radio');
		optionO.setAttribute('name', 'marker');
		optionO.setAttribute('value', 'O');

		const spanO = document.createElement('span');
		spanO.textContent = 'O';

		markerO.appendChild(optionO);
		markerO.appendChild(spanO);
		markerODiv.appendChild(markerO);
		fieldsetMarker.appendChild(markerODiv);

		// Ai options
		const fieldsetAi = document.createElement('fieldset');
		fieldsetAi.classList.add('fieldsetAi');
		const legendAi = document.createElement('legend');
		legendAi.classList.add('LegendAi');
		legendAi.textContent = 'Choose difficulty:';

		// Easy
		const easy = document.createElement('div');
		easy.classList.add('easyDiv');

		const labelEasy = document.createElement('label');

		const difficultyEasy = document.createElement('input');
		difficultyEasy.setAttribute('type', 'radio');
		difficultyEasy.setAttribute('id', 'easy');
		difficultyEasy.setAttribute('name', 'difficulty');
		difficultyEasy.setAttribute('class', 'nes-radio');
		difficultyEasy.setAttribute('value', 'Easy');

		const easySpan = document.createElement('span');
		easySpan.textContent = 'Easy';

		labelEasy.appendChild(difficultyEasy);
		labelEasy.appendChild(easySpan);
		easy.appendChild(labelEasy);

		// Medium
		const medium = document.createElement('div');
		medium.classList.add('mediumDiv');

		const labelMedium = document.createElement('label');

		const difficultyMedium = document.createElement('input');
		difficultyMedium.setAttribute('type', 'radio');
		difficultyMedium.setAttribute('id', 'medium');
		difficultyMedium.setAttribute('checked', true);
		difficultyMedium.setAttribute('name', 'difficulty');
		difficultyMedium.setAttribute('class', 'nes-radio');
		difficultyMedium.setAttribute('value', 'Medium');

		const mediumSpan = document.createElement('span');
		mediumSpan.textContent = 'Medium';

		labelMedium.appendChild(difficultyMedium);
		labelMedium.appendChild(mediumSpan);
		medium.appendChild(labelMedium);

		// Hard
		const hard = document.createElement('div');
		hard.classList.add('hardDiv');

		const labelHard = document.createElement('label');

		const difficultyHard = document.createElement('input');
		difficultyHard.setAttribute('type', 'radio');
		difficultyHard.setAttribute('id', 'hard');
		difficultyHard.setAttribute('name', 'difficulty');
		difficultyHard.setAttribute('class', 'nes-radio');
		difficultyHard.setAttribute('value', 'Hard');

		const hardSpan = document.createElement('span');
		hardSpan.textContent = 'Hard';

		labelHard.appendChild(difficultyHard);
		labelHard.appendChild(hardSpan);
		hard.appendChild(labelHard);

		// Submit Button
		const submitBtn = document.createElement('button');
		submitBtn.setAttribute('type', 'submit');
		submitBtn.classList.add('submitBtn');
		submitBtn.classList.add('nes-btn');
		submitBtn.classList.add('is-success');
		submitBtn.innerText = 'PLAY!';

		// Append
		fieldsetAi.appendChild(legendAi);
		fieldsetAi.appendChild(easy);
		fieldsetAi.appendChild(medium);
		fieldsetAi.appendChild(hard);

		PvASettings.appendChild(setName1);
		PvASettings.appendChild(fieldsetMarker);
		PvASettings.appendChild(fieldsetAi);
		PvASettings.appendChild(submitBtn);
		PvADiv.appendChild(PvASettings);

		mainDiv.appendChild(PvADiv);
	};

	// PvP or PvA
	// Option 1: PvP or PvA
	const settings = () => {
		// Create
		const settingsDiv = document.createElement('div');
		settingsDiv.classList.add('settingsDiv');

		// If PvP:
		// 		Set Names - P1 = X, P2 = O
		const playerVSplayer = document.createElement('button');
		playerVSplayer.classList.add('nes-btn');
		playerVSplayer.classList.add('is-success');
		playerVSplayer.textContent = 'Player vs Player';
		playerVSplayer.addEventListener('click', () => {
			settingsDiv.remove();
			PvP();
		});

		// If PvA:
		// 		Set name for player;
		//      Pick Ai difficulty - radio
		const playerVScomp = document.createElement('button');
		playerVScomp.classList.add('nes-btn');
		playerVScomp.classList.add('is-warning');
		playerVScomp.textContent = 'Player vs Computer';
		playerVScomp.addEventListener('click', () => {
			settingsDiv.remove();
			PvA();
		});

		// Append
		settingsDiv.appendChild(playerVSplayer);
		settingsDiv.appendChild(playerVScomp);
		mainDiv.appendChild(settingsDiv);
	};
	settings();

	// Append
	pointsDiv.appendChild(pointsP1);
	pointsDiv.appendChild(pointsP2);
	mainDiv.appendChild(pointsDiv);
	mainDiv.appendChild(startDiv);
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
			cellButton.classList.add('nes-btn');
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
			if (
				players[0].name === 'Easy' ||
				players[0].name === 'Medium' ||
				players[0].name === 'Hard' ||
				players[1].name === 'Easy' ||
				players[1].name === 'Medium' ||
				players[1].name === 'Hard'
			) {
				nextStep = false;
				setTimeout(aiPlayerMove, 700);
				setTimeout(() => {
					nextStep = true;
				}, 1000);
			}
		}
	};
	boardDiv.addEventListener('click', clickHandlerBoard);
})();
