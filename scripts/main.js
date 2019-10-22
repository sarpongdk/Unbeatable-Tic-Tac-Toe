import { State } from "./state.js";
import { Player, AI } from "./player.js";

const PLAYER_TURN = 0;
const COMP_TURN = 1;

const turnChangeEvent = new Event("turnChange");

const cells = document.querySelectorAll("td");
const message = document.querySelector(".message");
const button = document.querySelector("#new-game");
const userScore = document.querySelector(".user-score");
const compScore = document.querySelector(".comp-score");

const humanPlayer = new Player("user", "X", "red", 3);
const ai = new AI("comp", "O", "blue", 4);
let state = new State(humanPlayer, ai);

function updateTurnMessage(msg) {
  message.innerHTML = msg;
}

function updateButtonText(text) {
  button.innerHTML = text;
}

function onBoardClickListener(event) {
  let turn = state.getTurn();
  let currentPlayer = null;
  if (turn === COMP_TURN) {
    // updateTurnMessage(`It's ${ai.getName()} turn!`);
    return;
  }

  currentPlayer = humanPlayer;

  // if (currentPlayer === ai) {
  //   return;
  // }

  let cell = event.target;
  let x = parseInt(cell.id[0]);
  let y = parseInt(cell.id[1]);

  updateTurnMessage(`It's ${currentPlayer.getName()} turn!`);

  state.updateState(currentPlayer, x, y);
  cell.style.color = currentPlayer.getColor();
  cell.innerHTML = currentPlayer.getPiece();
  cell.removeEventListener("click", onBoardClickListener);

  // check win condition
  let win = state.checkWin(currentPlayer);
  if (win) {
    updateTurnMessage(`You win ${currentPlayer.getName()}!!`);
    // removeEventListener when a user wins
    currentPlayer.increaseScore();

    if (currentPlayer === humanPlayer) {
      userScore.innerHTML = currentPlayer.getScore();
    } else {
      compScore.innerHTML = currentPlayer.getScore();
    }

    removeAllBoardActionListeners();
    updateButtonText("Play Again!");
    return;
  } else if (state.hasNoPossibleMoves()) {
    // its a draw
    updateTurnMessage("It's a <strong>draw!</strong>");
    updateButtonText("Play Again!");
    // removeAllBoardActionListeners();
    return;
  }

  message.dispatchEvent(turnChangeEvent);
}

function removeAllBoardActionListeners() {
  cells.forEach(cell => {
    cell.removeEventListener("click", onBoardClickListener);
  });
}

function resetBoard() {
  cells.forEach(cell => {
    cell.innerHTML = "";
  });
}

function onTurnChangeListener() {
  if (state.getTurn() === PLAYER_TURN) {
    updateTurnMessage(`It's ${humanPlayer.getName()} turn!`);
  } else {
    updateTurnMessage(`It's ${ai.getName()} turn!`);

    // let validLocations = state.getValidLocations();
    let move = ai.getBestMove(state, humanPlayer);
    // console.log(humanPlayer.getEncoding());

    state.updateState(ai, move[0], move[1]);
    let cell = document.getElementById(`${move[0]}${move[1]}`);
    cell.style.color = ai.getColor();
    cell.innerHTML = ai.getPiece();
    cell.removeEventListener("click", onBoardClickListener);

    let win = state.checkWin(ai);
    if (win) {
      updateTurnMessage(`You win ${ai.getName()}!!`);

      // removeEventListener when a user wins
      ai.increaseScore();
      compScore.innerHTML = ai.getScore();

      removeAllBoardActionListeners();
      updateButtonText("Play Again!");
      return;
    } else if (state.hasNoPossibleMoves()) {
      // its a draw
      updateTurnMessage("It's a <strong>draw!</strong>");
      updateButtonText("Play Again!");
      removeAllBoardActionListeners();

      return;
    }

    message.dispatchEvent(turnChangeEvent);
  }
}

function initializeGUI() {
  cells.forEach(cell => {
    cell.addEventListener("click", onBoardClickListener);
    message.addEventListener("turnChange", onTurnChangeListener);
  });

  button.addEventListener("click", reset);

  if (state.getTurn() === PLAYER_TURN) {
    updateTurnMessage(`It's ${humanPlayer.getName()} turn!`);
  } else {
    updateTurnMessage(`It's ${ai.getName()} turn!`);

    // let validLocations = state.getValidLocations();
    let move = ai.getBestMove(state, humanPlayer);

    state.updateState(ai, move[0], move[1]);
    let cell = document.getElementById(`${move[0]}${move[1]}`);
    cell.style.color = ai.getColor();
    cell.innerHTML = ai.getPiece();
    cell.removeEventListener("click", onBoardClickListener);

    message.dispatchEvent(turnChangeEvent);
  }
}

function reset() {
  state = new State();

  resetBoard();
  initializeGUI();
}

initializeGUI();

/*
 TODO:
 - Create option to play vs ai or vs another human
 - Minimax algorithm for ai
*/
