import React, { useState, useEffect } from 'react';
import Tile from './Tile';

const initialBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function addRandomTile(board) {
  let newBoard = [...board];
  let emptyCells = [];
  
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (newBoard[row][col] === 0) {
        emptyCells.push({ row, col });
      }
    }
  }
  
  if (emptyCells.length > 0) {
    let { row, col } = emptyCells[getRandomInt(emptyCells.length)];
    newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
  }
  
  return newBoard;
}

function Board() {
  const [board, setBoard] = useState(addRandomTile(addRandomTile(initialBoard)));

  const resetBoard = () => {
    window.location.reload();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          handleMove(moveUp);
          break;
        case 'ArrowDown':
          handleMove(moveDown);
          break;
        case 'ArrowLeft':
          handleMove(moveLeft);
          break;
        case 'ArrowRight':
          handleMove(moveRight);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board]);

  const handleMove = (moveFn) => {
    const newBoard = moveFn(board);
    if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
      setBoard(addRandomTile(newBoard));
    }
  };

  const combineTiles = (tiles) => {
    let newTiles = [];
    let skipNext = false;

    for (let i = 0; i < tiles.length; i++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }
      if (tiles[i] === tiles[i + 1]) {
        newTiles.push(tiles[i] * 2);
        skipNext = true;
      } else {
        newTiles.push(tiles[i]);
      }
    }

    while (newTiles.length < tiles.length) {
      newTiles.push(0);
    }

    return newTiles;
  };

  const moveUp = (board) => {
    let newBoard = [[], [], [], []];

    for (let col = 0; col < 4; col++) {
      let column = board.map(row => row[col]);
      let combinedColumn = combineTiles(column.filter(value => value));
      for (let row = 0; row < 4; row++) {
        newBoard[row][col] = combinedColumn[row] || 0;
      }
    }

    return newBoard;
  };

  const moveDown = (board) => {
    let newBoard = [[], [], [], []];

    for (let col = 0; col < 4; col++) {
      let column = board.map(row => row[col]);
      let combinedColumn = combineTiles(column.filter(value => value).reverse()).reverse();
      for (let row = 0; row < 4; row++) {
        newBoard[row][col] = combinedColumn[row] || 0;
      }
    }

    return newBoard;
  };

  const moveLeft = (board) => {
    let newBoard = board.map(row => {
      let combinedRow = combineTiles(row.filter(value => value));
      return [...combinedRow, ...Array(4 - combinedRow.length).fill(0)];
    });

    return newBoard;
  };

  const moveRight = (board) => {
    let newBoard = board.map(row => {
      let combinedRow = combineTiles(row.filter(value => value).reverse()).reverse();
      return [...Array(4 - combinedRow.length).fill(0), ...combinedRow];
    });

    return newBoard;
  };

  const isGameOver = () => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === 0) return false;
        if (row < 3 && board[row][col] === board[row + 1][col]) return false;
        if (col < 3 && board[row][col] === board[row][col + 1]) return false;
      }
    }
    return true;
  };

  const isGameWon = () => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] === 2048) return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (isGameOver()) {
      alert('Game Over');
      resetBoard();
    } else if (isGameWon()) {
      alert('You Win!');
      resetBoard();
    }
  }, [board]);

  return (
    <div>
    <div className="board">
      {board.map((row, rowIndex) =>
        row.map((value, colIndex) => (
          <Tile key={`${rowIndex}-${colIndex}`} value={value} />
        ))
      )}
    </div>
    <button className="new-game-button" onClick={resetBoard}>New Game</button>
    </div>
  );
}

export default Board;
