export class Player {
  constructor(name, piece = "X", color = "#355bb5", encoding = 1, score = 0) {
    this.name = name;
    this.piece = piece;
    this.color = color;
    this.encoding = encoding;
    this.score = score;
  }

  getPiece() {
    return this.piece;
  }

  getEncoding() {
    return this.encoding;
  }

  getColor() {
    return this.color;
  }

  getName() {
    return this.name;
  }

  increaseScore() {
    this.score++;
  }

  getScore() {
    return this.score;
  }
}

export class AI extends Player {
  constructor(name, piece, color, encoding, score) {
    super(name, piece, color, encoding, score);
  }

  randInt(min, max) {
    // this function generates a random integer between min and max inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomMove(validLocations) {
    let randomIndex = this.randInt(0, validLocations.length - 1);
    let x = validLocations[randomIndex][0];
    let y = validLocations[randomIndex][1];

    return [x, y];
  }

  // getAIMove(smart = true) {}

  evaluate(board, opponent) {
    /* If maximizer wins return +1000, if opponent wins return -1000 */
    // check horizontal column
    for (let row = 0; row < board.length; row++) {
      if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
        if (board[row][0] === this.encoding) {
          return 1000;
        } else if (board[row][0] === opponent.getEncoding()) {
          return -1000;
        }
      }
    }

    // check vertical columns
    for (let col = 0; col < board.length; col++) {
      if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
        if (board[0][col] === this.encoding) {
          return 1000;
        } else if (board[0][col] === opponent.getEncoding()) {
          return -1000;
        }
      }
    }

    // check diagonal
    // top-left to bottom right
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      if (board[0][0] === this.encoding) {
        return 1000;
      } else if (board[0][0] === opponent.getEncoding()) {
        return -1000;
      }
    }

    // top right to bottom left
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      if (board[0][2] === this.encoding) {
        return 1000;
      } else if (board[0][2] === opponent.getEncoding()) {
        return -1000;
      }
    }

    // return 0 otherwise
    return 0;
  }

  hasNoMovesLeft(board) {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] === -1) {
          return false;
        }
      }
    }

    return true;
  }

  isGameOver(board) {
    /* If maximizer wins return +1000, if opponent wins return -1000 */
    // check horizontal column
    for (let row = 0; row < board.length; row++) {
      if (
        board[row][0] === board[row][1] &&
        board[row][1] === board[row][2] &&
        board[row][0] !== -1
      ) {
        return true;
      }
    }

    // check vertical columns
    for (let col = 0; col < board.length; col++) {
      if (
        board[0][col] === board[1][col] &&
        board[1][col] === board[2][col] &&
        board[0][col] !== -1
      ) {
        return true;
      }
    }

    // check diagonal
    // top-left to bottom right
    if (
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2] &&
      board[0][0] !== -1
    ) {
      return true;
    }

    // top right to bottom left
    if (
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0] &&
      board[0][2] !== -1
    ) {
      return true;
    }

    return false;
  }

  getValidLocations(board) {
    const EMPTY = -1;
    let locations = [];

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] === EMPTY) {
          let coordinates = [i, j];
          locations.push(coordinates);
        }
      }
    }

    return locations;
  }

  miniMax(board, depth, alpha, beta, isMaximizer, opponent) {
    // if (gameOver or isTerminalNode or depth == 0) {
    //   return evaluateScore
    // }
    if (this.hasNoMovesLeft(board) || this.isGameOver(board)) {
      return this.evaluate(board, opponent);
    }

    let validLocations = this.getValidLocations(board);

    if (isMaximizer) {
      // is maximizing player/ ai player
      let maximumScore = Number.NEGATIVE_INFINITY; // -INF
      for (let i = 0; i < validLocations.length; i++) {
        let move = validLocations[i];

        // unchoose
        board[move[0]][move[1]] = this.getEncoding();

        // explore
        let score = this.miniMax(
          board,
          depth - 1,
          alpha,
          beta,
          !isMaximizer,
          opponent
        );
        maximumScore = Math.max(score, maximumScore);

        // unchoose
        board[move[0]][move[1]] = -1;

        // alpha beta prunning
        alpha = Math.max(alpha, maximumScore);
        if (alpha >= beta) {
          break;
        }
      }

      return maximumScore;
    }

    if (!isMaximizer) {
      // iis minimizing player/ opponent
      let minimumScore = Number.POSITIVE_INFINITY; // INF
      for (let i = 0; i < validLocations.length; i++) {
        let move = validLocations[i];

        // choose
        board[move[0]][move[1]] = opponent.getEncoding();

        // explore
        let score = this.miniMax(
          board,
          depth - 1,
          alpha,
          beta,
          !isMaximizer,
          opponent
        );
        minimumScore = Math.min(score, minimumScore);

        // unchoose
        board[move[0]][move[1]] = -1;

        // alpha beta prunning
        beta = Math.min(beta, minimumScore);
        if (alpha >= beta) {
          break;
        }
      }

      return minimumScore;
    }
  }

  /**
   * Shuffles array in place.
   * @param {Array} a items An array containing the items.
   */
  shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }

  getBestMove(state, opponent) {
    const EMPTY = -1;
    let board = this.deepCopyBoard(state.getBoard());
    let moves = this.shuffle(state.getValidLocations());
    let bestScore = Number.NEGATIVE_INFINITY;
    let alpha = Number.NEGATIVE_INFINITY;
    let beta = Number.POSITIVE_INFINITY;
    let bestMove = null;

    for (let i = 0; i < moves.length; i++) {
      let move = moves[i];
      board[move[0]][move[1]] = this.getEncoding();
      let moveScore = this.miniMax(board, 5, alpha, beta, false, opponent);

      if (moveScore > bestScore) {
        bestScore = moveScore;
        bestMove = moves[i];
      }

      board[move[0]][move[1]] = EMPTY;
    }

    return bestMove;
  }

  deepCopyBoard(board) {
    let copiedBoard = [];

    for (let i = 0; i < board.length; i++) {
      let row = [];

      for (let j = 0; j < board[0].length; j++) {
        row.push(board[i][j]);
      }

      copiedBoard.push(row);
    }

    return copiedBoard;
  }
}
