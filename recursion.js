let step = 0;

function collatz(n) {
	if (n === 1) {
		return 0;
	} else if (n % 2 === 0) {
		return 1 + collatz(n / 2);
	} else {
		return 1 + collatz(3 * n + 1);
	}
}

// console.log(collatz(999999999999999));

// Ai setup

/* the original board
 O |   | X
 ---------
 X |   | X
 ---------
   | O | O
 */

// let origBoard = ['O', 1, 'X', 'X', 'X', 'X', 6, 'O', 'O'];

const huPlayer = 'O';

const aiPlayer = 'X';

const emptyIndexes = (board) => {
	return board.filter((s) => s != 'O' && s != 'X');
};

// Winning combos

// winning combinations using the board indexies
// function winning(board, player){
//     if (
//     (board[0] == player && board[1] == player && board[2] == player) ||
//     (board[3] == player && board[4] == player && board[5] == player) ||
//     (board[6] == player && board[7] == player && board[8] == player) ||
//     (board[0] == player && board[3] == player && board[6] == player) ||
//     (board[1] == player && board[4] == player && board[7] == player) ||
//     (board[2] == player && board[5] == player && board[8] == player) ||
//     (board[0] == player && board[4] == player && board[8] == player) ||
//     (board[2] == player && board[4] == player && board[6] == player)
//     ) {
//     return true;
//     } else {
//     return false;
//     }
//    }


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
    
    winningComb.forEach((combo, index) => {
        if (
            board[combo[0]] === player &&
            board[combo[0]] === board[combo[1]] &&
            board[combo[0]] === board[combo[2]]
        ) {
            result = true;
        }
    });
     
    return result;
}

let origBoard = ['O', 'O', 'O', 'X', 4, 'X', 6, 'O', 'O'];

// console.log(winner(origBoard, huPlayer));
console.log(winning(origBoard, huPlayer));

// The main minimax func
const minimax = (newBoard, player) => {
    // Free spots
    let availSpots = emptyIndexes(newBoard);

    //Check terminal states, win, lose, tie
    if (winning(newBoard, huPlayer)) {
        return {score:-10};
    } else if (winning(newBoard, aiPlayer)){
        return {score:10};
    } else if (availSpots.length === 0){
        return {score:0};
    }

    // Collect all objects
    let moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        let move = {};
        move.index = newBoard[availSpots[i]];

        newBoard[availSpots[i]] = player;
        if (player === aiPlayer){
            let result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -10000;
        for(let i = 0; i < moves.length; i++) {
            if(moves[i].score > bestScore){
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
}



origBoard = [
    'O', 1, 'X',
     3, 4, 'X', 
     6, 'O', 'O'
    ];

let boardTemplate = [
    0, 1, 2,
    3, 4, 5,
    6, 7, 8,
]


let board2 = [
    'O', 'X', 2,
    'O', 'X', 5,
    'X', 'O', 8,
]


let board3 = [
    0, 1, 2,
    3, 4, 5,
    6, 7, 8,
]

console.log(minimax(board3, huPlayer));
console.log(minimax(board3, aiPlayer));