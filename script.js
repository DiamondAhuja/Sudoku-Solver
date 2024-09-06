document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("grid");
  let solution = null; // To store the solved board

  // Create the grid of input fields
  for (let i = 0; i < 81; i++) {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("maxlength", "1");
    input.addEventListener("click", () => revealCell(i));
    grid.appendChild(input);
  }

  document.getElementById("solve-btn").addEventListener("click", solveSudoku);
  document.getElementById("reveal-one").addEventListener("click", revealOne);
  document.getElementById("clear-btn").addEventListener("click", clearGrid);

  function getGridValues() {
    const values = [];
    document
      .querySelectorAll("#grid input")
      .forEach((input) => values.push(input.value || "0"));
    return values.map(Number);
  }

  function setGridValues(values) {
    document.querySelectorAll("#grid input").forEach((input, index) => {
      input.value = values[index] !== 0 ? values[index] : "";
    });
  }

  function solveSudoku() {
    const values = getGridValues();
    const board = [];

    for (let i = 0; i < 9; i++) {
      board.push(values.slice(i * 9, (i + 1) * 9));
    }

    if (solve(board)) {
      solution = board.flat(); // Store the solved board
      setGridValues(solution);
    } else {
      alert("No solution found!");
    }
  }

  function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
      if (
        board[row][i] === num ||
        board[i][col] === num ||
        board[Math.floor(row / 3) * 3 + Math.floor(i / 3)][
          Math.floor(col / 3) * 3 + (i % 3)
        ] === num
      ) {
        return false;
      }
    }
    return true;
  }

  function solve(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solve(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  function revealOne() {
    if (!solution) {
      solveSudoku(); // Solve the Sudoku if not already solved
    }

    const values = getGridValues();

    for (let i = 0; i < 81; i++) {
      if (values[i] === 0) {
        values[i] = solution[i];
        break;
      }
    }
    setGridValues(values);
  }

  function revealCell(index) {
    if (!solution) {
      solveSudoku(); // Solve the Sudoku if not already solved
    }

    const values = getGridValues();
    if (values[index] === 0) {
      values[index] = solution[index];
      setGridValues(values);
    }
  }

  function clearGrid() {
    solution = null; // Clear the stored solution
    document
      .querySelectorAll("#grid input")
      .forEach((input) => (input.value = ""));
  }
});
