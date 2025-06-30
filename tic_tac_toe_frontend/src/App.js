import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Returns the winner symbol ("X" or "O") or "draw" if all cells are filled and no winner.
 * Returns null otherwise.
 *
 * @param {Array<string|null>} squares - Flat array of board state.
 * @returns {"X" | "O" | "draw" | null}
 */
function calculateWinner(squares) {
  // All possible winning lines (rows, columns, diagonals)
  const lines = [
    [0, 1, 2], // Row 1
    [3, 4, 5], // Row 2
    [6, 7, 8], // Row 3
    [0, 3, 6], // Col 1
    [1, 4, 7], // Col 2
    [2, 5, 8], // Col 3
    [0, 4, 8], // Diagonal \
    [2, 4, 6], // Diagonal /
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  if (squares.every((cell) => cell != null)) {
    return "draw";
  }
  return null;
}

// PUBLIC_INTERFACE
function Square({ value, onClick, isHighlight }) {
  /** Renders one square in the Tic Tac Toe board. */
  return (
    <button
      className={`ttt-square${isHighlight ? " highlight" : ""}`}
      onClick={onClick}
      aria-label={value ? `Cell ${value}` : "Empty cell"}
      disabled={!!value}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function GameBoard({ board, onCellClick, winLine }) {
  /**
   * Renders the 3x3 grid, passes click events.
   * winLine: array of indexes to highlight when game is won.
   */
  return (
    <div className="ttt-board">
      {board.map((value, idx) => (
        <Square
          key={idx}
          value={value}
          onClick={() => onCellClick(idx)}
          isHighlight={winLine && winLine.includes(idx)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Main App - renders centered board, status, reset.
   */
  // Board is a flat array, 0-8
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null); // "X", "O", "draw", or null
  const [winLine, setWinLine] = useState(null);

  // Effect to check for winner on board change
  useEffect(() => {
    const nextWinner = calculateWinner(board);
    setWinner(nextWinner);

    if (nextWinner && nextWinner !== "draw") {
      // Highlight the winning combination
      // Find the win line
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (let line of lines) {
        const [a, b, c] = line;
        if (
          board[a] &&
          board[a] === board[b] &&
          board[a] === board[c]
        ) {
          setWinLine(line);
          return;
        }
      }
    } else {
      setWinLine(null);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  const handleCellClick = (idx) => {
    if (board[idx] !== null || winner) return;
    const newBoard = [...board];
    newBoard[idx] = isXNext ? "X" : "O";
    setBoard(newBoard);
    setIsXNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinLine(null);
  };

  // Status Message
  let statusMessage;
  if (winner === "X" || winner === "O") {
    statusMessage = (
      <span>
        <span className="ttt-winner">{winner}</span> wins!
      </span>
    );
  } else if (winner === "draw") {
    statusMessage = <>It&apos;s a draw!</>;
  } else {
    statusMessage = (
      <>
        <span className="ttt-turn">
          {isXNext ? "X" : "O"}
        </span>
        &apos;s turn
      </>
    );
  }

  return (
    <div className="ttt-app-root">
      <div className="ttt-game-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status">{statusMessage}</div>
        <GameBoard
          board={board}
          onCellClick={handleCellClick}
          winLine={winLine}
        />
        <button className="ttt-reset-btn" onClick={handleReset} aria-label="Restart game">
          {winner ? "Play Again" : "Reset"}
        </button>
        <div className="ttt-meta">
          <span className="ttt-credits">
            Made with ♥ for browser play
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;
