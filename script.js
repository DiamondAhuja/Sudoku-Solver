document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("grid");
  let solution = null;
  let isCleared = false;

  for (let i = 0; i < 81; i++) {
    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.setAttribute("maxlength", "1");
    input.addEventListener("input", () => markUserInput(input));
    input.addEventListener("click", () => revealCell(i));
    input.addEventListener("keydown", (event) => navigateGrid(event, i));
    grid.appendChild(input);
  }

  document.getElementById("solve-btn").addEventListener("click", solveSudoku);
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
      if (input.classList.contains("user-input")) {
        input.value = values[index] !== 0 ? values[index] : "";
      } else {
        input.value = values[index] !== 0 ? values[index] : "";
        input.classList.remove("user-input");
      }
    });
  }

  function navigateGrid(event, index) {
    const rowSize = 9;
    let newIndex;

    switch (event.key) {
      case "ArrowUp":
        newIndex = index - rowSize;
        break;
      case "ArrowDown":
        newIndex = index + rowSize;
        break;
      case "ArrowLeft":
        newIndex = index - 1;
        break;
      case "ArrowRight":
        newIndex = index + 1;
        break;
      default:
        return;
    }

    if (newIndex >= 0 && newIndex < 81) {
      document.querySelectorAll("#grid input")[newIndex].focus();
    }

    event.preventDefault();
  }

  function solveSudoku() {
    const values = getGridValues();
    if (values.every((value) => value === 0)) {
      alert("The grid is empty!");
      return;
    }

    const board = [];

    for (let i = 0; i < 9; i++) {
      board.push(values.slice(i * 9, (i + 1) * 9));
    }

    if (solve(board)) {
      solution = board.flat();
      setGridValues(solution);
      isCleared = false;
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

  function revealCell(index) {
    if (!solution || isCleared) {
      return;
    }

    const values = getGridValues();
    if (values[index] === 0) {
      values[index] = solution[index];
      setGridValues(values);
    }
  }

  function markUserInput(input) {
    if (input.value) {
      input.classList.add("user-input");
    } else {
      input.classList.remove("user-input");
    }
  }

  function clearGrid() {
    solution = null;
    isCleared = true;
    document.querySelectorAll("#grid input").forEach((input) => {
      input.value = "";
      input.classList.remove("user-input");
    });
  }
});
