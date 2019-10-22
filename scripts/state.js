const EMPTY = -1;
const PLAYER_TURN = 0;
const COMP_TURN = 1;

export class State {
  // player1 is always user
  // player 2 is always ai
  constructor() {
    this.board = [
      [EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY],
      [EMPTY, EMPTY, EMPTY]
    ];

    this.gameOver = false;

    this.turn = Math.round(Math.random());
    this.winner = null;
  }

  getBoard() {
    return this.board;
  }

  getValidLocations() {
    let locations = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j] === EMPTY) {
          let coordinates = [i, j];
          locations.push(coordinates);
        }
      }
    }

    return locations;
  }

  // this method returns true if no additional moves are available
  hasNoPossibleMoves() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[0].length; j++) {
        if (this.board[i][j] === EMPTY) {
          return false;
        }
      }
    }

    this.gameOver = true;
    return true;
  }

  getTurn() {
    return this.turn;
  }

  updateState(player, x, y) {
    if (this.board[x][y] !== EMPTY) {
      return;
    }

    this.board[x][y] = player.getEncoding();
    this.turn = (this.turn + 1) % 2;
  }

  checkHorizontal(encoding) {
    // first row
    if (
      this.board[0][0] === this.board[0][1] &&
      this.board[0][1] === this.board[0][2] &&
      this.board[0][0] === encoding
    ) {
      return true;
    }

    // second row
    if (
      this.board[1][0] === this.board[1][1] &&
      this.board[1][1] === this.board[1][2] &&
      this.board[1][0] === encoding
    ) {
      return true;
    }

    // third row
    if (
      this.board[2][0] === this.board[2][1] &&
      this.board[2][1] === this.board[2][2] &&
      this.board[2][0] === encoding
    ) {
      return true;
    }

    return false;
  }

  checkVertical(encoding) {
    // check first column
    if (
      this.board[0][0] === this.board[1][0] &&
      this.board[1][0] === this.board[2][0] &&
      this.board[0][0] === encoding
    ) {
      return true;
    }

    // check second column
    if (
      this.board[0][1] === this.board[1][1] &&
      this.board[1][1] === this.board[2][1] &&
      this.board[0][1] === encoding
    ) {
      return true;
    }

    // check third column
    if (
      this.board[0][2] === this.board[1][2] &&
      this.board[1][2] === this.board[2][2] &&
      this.board[0][2] === encoding
    ) {
      return true;
    }

    return false;
  }

  checkDiagonal(encoding) {
    // top left to bottom right
    if (
      this.board[0][0] === this.board[1][1] &&
      this.board[1][1] === this.board[2][2] &&
      this.board[0][0] === encoding
    ) {
      return true;
    }

    // top right to bottom left
    if (
      this.board[0][2] === this.board[1][1] &&
      this.board[1][1] === this.board[2][0] &&
      this.board[0][2] === encoding
    ) {
      return true;
    }

    return false;
  }

  checkWin(player) {
    let encoding = player.getEncoding();

    let horizontal = this.checkHorizontal(encoding);
    let vertical = this.checkVertical(encoding);
    let diagonal = this.checkDiagonal(encoding);

    // console.log(
    //   `Horizontal: ${horizontal}\nVertical: ${vertical}\nDiagonal: ${diagonal}`
    // );

    if (horizontal || vertical || diagonal) {
      this.gameOver = true;
      this.winner = player;

      return true;
    }

    return false;
  }

  isGameOver() {
    return this.gameOver;
  }

  getWinner() {
    return this.winner;
  }
}
