import { State } from "./state";

export class Game {
  constructor(state) {
    this.state = state;
  }

  noPossibleMoves() {
    return this.state.hasNoPossibleMoves();
  }

  hasWon(player) {
    this.state.checkWin(player);
  }

  startGame() {}

  newGame(player1, player2) {
    this.state = new State();
  }
}
