const gameboard = (() => {
    // Initialize an array of nine empty strings that represent the game board
    let board = ["", "", "", "", "", "", "", "", ""];

    // Create a function that takes an index and a player object as arguments, and update the game board array with the player"s symbol at the specified index
    const updateBoard = (index, player) => {
        board[index] = player.getSymbol();
    };

    // Create a function that returns the current state of the game board
    const getBoard = () => {
        return board;
    };

    // Create a function that resets the game board to its initial state of nine empty strings
    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
      ;
    }

    // Return an object with the updateBoard, getBoard, and resetBoard functions as properties so that they can be accessed outside of the module
    return { updateBoard, getBoard, resetBoard };

})();


// Create player objects using a factory function
const Player = (name, symbol) => {
    const getName = () => {
      return name;
    };
  
    const getSymbol = () => {
      return symbol;
    };
  
    return { getName, getSymbol };
};
  
const player1 = Player("Player X", "X");
const player2 = Player("Player O", "O");
  
// Create a function to render the game board to the page
const displayController = (() => {
    // Get all elements with the class name "box" on the page and stores them in a variable called boxes
    const boxes = document.querySelectorAll(".box");
  
    // Create function that takes a game board as an argument and updates the content of each box on the page with the corresponding symbol from the game board. The textContent property of each element is set to the symbol at the corresponding index of the board array.
    const render = (board) => {
      for (let i = 0; i < board.length; i++) {
        boxes[i].textContent = board[i];
      }
    };
  
    // Returns an object with the render function as a property so that it can be accessed outside of the module
    return { render };
})();
  
// Create a module for the game controller that handles player moves, checks if the selected box is empty before adding the player's symbol and checks if the game is over after each move
const gameController = (() => {
    // Initialize the current player to player1 and the winner to null
    let currentPlayer = player1;
    let winner = null;
  
    const boxes = document.querySelectorAll(".box");
    const clearBoardBtn = document.querySelector(".clear-board-btn");
    const resetBtn = document.querySelector(".reset-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const closeBtn = document.querySelector(".close-btn");
    const modal = document.querySelector(".modal-scoreboard");
    const message = document.querySelector(".message");
  
    // Add a move to the Tic Tac Toe game board
    const addMove = (event) => {
      // Get the index of the move from the clicked element's data-box attribute
      const index = event.target.getAttribute("data-box");
      // Check if the move is valid (i.e., the box is empty and there is no winner yet)
      if (gameboard.getBoard()[index] === "" && winner === null) {
        // Update the game board with the new move
        gameboard.updateBoard(index, currentPlayer);
        // Render the updated game board on the screen
        displayController.render(gameboard.getBoard());
        // Check if there is a winner or a tie
        if (checkForWinner()) {
          winner = currentPlayer;
          declareWinner();
        } else if (checkForTie()) {
          declareTie();
        } else {
          // If the game is still in progress, switch to the other player and update the instruction
          currentPlayer = currentPlayer === player1 ? player2 : player1;
          updateInstruction();
        }
      }
    };
  
    // Check if there is a winner in the Tic Tac Toe game
    const checkForWinner = () => {
      // Get the current game board state
      const board = gameboard.getBoard();

      // Define the winning combinations as an array of arrays
      const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];

      // Iterate over each winning combination and check if the values in the board match
      for (let i = 0; i < winningCombos.length; i++) {
        // Destructure the winning combination into three separate variables
        const [a, b, c] = winningCombos[i];
        // If the values at the corresponding indexes in the board match, return true
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return true;
        }
      }
      // If no winning combination was found, return false
      return false;
    };
    // Check if the game is tied
    const checkForTie = () => {
      // Get the current state of the game board
      const board = gameboard.getBoard();
      // Check if every box on the game board has been filled
      return board.every((box) => box !== "");
    };
  
    // Declare the winner of the game
    const declareWinner = () => {
      // Get the name of the winner
      const winnerName = winner.getName();
      // Set the message text to display the winner's name
      message.textContent = `${winnerName} wins!`;
      // Display the modal that shows the winner
      modal.style.display = "flex";
    };
  
    // Declare that the game has ended in a tie
    const declareTie = () => {
      // Set the message text to indicate a tie
      message.textContent = "It's a tie!";
      modal.style.display = "flex";
    };

    // Reset the game board and start a new game
    const resetGame = () => {
      // Reset the game board
      gameboard.resetBoard();
      // Render the reset game board on the screen
      displayController.render(gameboard.getBoard());
      // Set the current player to player1
      currentPlayer = player1;
      // Reset the winner variable
      winner = null;
      // Hide the modal
      modal.style.display = "none";
      // Update the instruction to show which player's turn it is
      updateInstruction();
    };

    // Update the instruction that tells the player whose turn it is
    const updateInstruction = () => {
      // Get the instruction element
      const instruction = document.querySelector(".instruction");
      // Set the text of the instruction to indicate whose turn it is
      instruction.textContent = `It's ${currentPlayer.getName()}'s turn`;
    };
  
    // Add event listeners to all box elements on the page
    boxes.forEach((box) => {
      box.addEventListener("click", addMove);
    });

     // Add event listener to the clear-board button
     clearBoardBtn.addEventListener("click", resetGame);
  
    // Add event listener to the reset button
    resetBtn.addEventListener("click", resetGame);
  
    // Add event listener to the cancel button
    cancelBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });

    // Add event listener to the close button
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
  
    // Returns an object with the addMove function as a property so that it can be accessed outside of the module
    return { addMove };
})();
