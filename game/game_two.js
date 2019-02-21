// keeps track of what's on the board

var board;
//setting constant
const huPlayer = "O"
const aiPlayer = "X"
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [0, 4, 8],
];
const cells = document.querySelectorAll('td');


startGame();





//function to start Game
function startGame() {
  document.querySelector(".endgame").style.display = "none";
  board = Array.from(Array(9).keys()); //[0,1,2,3,4,5,6,7,8,]

  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', click, false);
  }
}

//function calls turn, to change the checker on the board
function click(square) {
  // make sure that nobody took this spot
  if (typeof board[square.target.id.slice(1) - 1] == 'number') {
    turn(square.target.id, huPlayer);
    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }

}

function turn(squareId, player) {
  if (player == huPlayer) {
    board[squareId.slice(1) - 1] = player;
    document.getElementById(squareId).innerText = player
  } else if (player == aiPlayer) {
    board[squareId] = player;
    debugger;
    document.getElementById('n' + (squareId + 1)).innerText = player;
  }


  let gameWon = determine_winner(board, player);
  if (gameWon) gameOver(gameWon);
}

//cecks the win
function determine_winner(board, player) {

  let plays = board.reduce((accumilator, element, index) =>
    (element === player) ? accumilator.concat(index) : accumilator, []); // returns the accumilator array that is initialized to [] V.I
  let gameWon = null;

  //loop through the win combos array. .entries returns the index and the element
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = {
        index: index,
        player: player
      };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {

  for (let index of winCombos[gameWon.index]) {
    document.getElementById('n' + (index + 1)).style.backgroundColor =
      gameWon.player == huPlayer ? "rgba(71, 216, 194,.8)" : 'rgba(4, 234, 161, .8)';
  }

  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', click, false);
  }
  declareWinner(gameWon.player)
}

function declareWinner(who) {
  if (who === huPlayer) {
    document.querySelector('.endgame .text').innerText = 'Player One Wins!';
    document.querySelector('.endgame').style.backgroundColor = 'rgba(71, 216, 194,.8)';
  } else if (who == aiPlayer) {
    document.querySelector('.endgame .text').innerText = 'AI Wins!';
    document.querySelector('.endgame').style.backgroundColor = 'rgba(4, 234, 161, .8)';
  } else {
    document.querySelector('.endgame .text').innerText = who;
  }
  document.querySelector('.endgame').style.display = "block"
}

// function bestSpot(){
//   return emptySquares()[0];
// }

// if AI Player is playing
function bestSpot() {
  return minMax(board, aiPlayer).index;
}

function emptySquares() {
  return board.filter(s => typeof s == 'number');
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "rgba(197, 206, 221,.8)";
      cells[i].removeEventListener('click', click, false);
    }
    declareWinner("Tie Game!")
    return true;
  }
  return false;
}


function minMax(newBoard, player) {
  var availSpots = emptySquares(newBoard);

  // recursive return
  if (determine_winner(newBoard, player)) {
    return {
      score: -10
    };
  } else if (determine_winner(newBoard, aiPlayer)) {
    return {
      score: 10
    };
  } else if (availSpots.length == 0) {
    return {
      score: 0
    };
  }


  //collecting the recursive returns in a new array called moves
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    // move. index = the modified board at the index of available spot i  inside the for loop
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;
    //recursion call to the other player, will keep recirsively going deeper into the game
    if (player == aiPlayer) {
      var result = minMax(newBoard, huPlayer)
      move.score = result.score;
    } else {
      var result = minMax(newBoard, aiPlayer)
      move.score = result.score;
    }

    // reset newBoard to what it was before this fucking function call and while we're in the for loop
    newBoard[availSpots[i]] = move.index;
    //push move to the moves array
    moves.push(move);
  }

  var bestMove;

  if (player == aiPlayer) {
    var bestScore = -10000;
    //get the highest score in moves
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    //get the lowest score for human moves
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}
