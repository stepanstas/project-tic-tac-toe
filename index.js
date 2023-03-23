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
  
// Create a function that handles player moves, checks if the selected box is empty before adding the player's symbol and checks if the game is over after each move
const gameController = (() => {
    let currentPlayer = player1;
    let winner = null;
  
    const boxes = document.querySelectorAll(".box");
    const resetBtn = document.querySelector(".reset-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const closeBtn = document.querySelector(".close-btn");
    const modal = document.querySelector(".modal-scoreboard");
    const message = document.querySelector(".message");
  
    const addMove = (event) => {
      const index = event.target.getAttribute("data-box");
      if (gameboard.getBoard()[index] === "" && winner === null) {
        gameboard.updateBoard(index, currentPlayer);
        displayController.render(gameboard.getBoard());
        if (checkForWinner()) {
          winner = currentPlayer;
          declareWinner();
        } else if (checkForTie()) {
          declareTie();
        } else {
          currentPlayer = currentPlayer === player1 ? player2 : player1;
          updateInstruction();
        }
      }
    };
  
    const checkForWinner = () => {
      const board = gameboard.getBoard();
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
      for (let i = 0; i < winningCombos.length; i++) {
        const [a, b, c] = winningCombos[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return true;
        }
      }
      return false;
    };
  
    const checkForTie = () => {
      const board = gameboard.getBoard();
      return board.every((box) => box !== "");
    };
  
    const declareWinner = () => {
      const winnerName = winner.getName();
      message.textContent = `${winnerName} wins!`;
      modal.style.display = "flex";
    };
  
    const declareTie = () => {
      message.textContent = "It's a tie!";
      modal.style.display = "flex";
    };
  
    const resetGame = () => {
      gameboard.resetBoard();
      displayController.render(gameboard.getBoard());
      currentPlayer = player1;
      winner = null;
      modal.style.display = "none";
      updateInstruction();
    };
  
    const updateInstruction = () => {
      const instruction = document.querySelector(".instruction");
      instruction.textContent = `It's ${currentPlayer.getName()}'s turn`;
    };
  
    // Add event listeners to all box elements on the page
    boxes.forEach((box) => {
      box.addEventListener("click", addMove);
    });
  
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
