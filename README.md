# Unbeatable-Tic-Tac-Toe

The famous tic tac toe game with the AI, i.e., the computer opponent, programmed using an implementation of the minimax algorithm. 

To play the game, navigate to `https://sarpongdk-tictactoe.herokuapp.com`


## Minimax Algorithm

The minimax algorithm seeks to minimize the maximum losses a player can make in a turn-based zero sum game. A zero-sum game is a game in which one player's gain/loss is equal to other player's loss/gain. A simple example is tic tac toe. If I win a game, that gain I get from winning is equal to the loss you incur from losing. Hence adding the loss and the gain equals to 0, giving the name zero-sum game.

Minimax minimizes the maximum losses a player incurs by looking ahead all possible moves a player can make giving a starting point, and making the best move, assuming that the opposing player also picks all of his/her best moves. 
There are two notions in this algorithm:
1. The maximizing player, i.e., the player trying to win
2. The minimizing player, i.e., the opponent
