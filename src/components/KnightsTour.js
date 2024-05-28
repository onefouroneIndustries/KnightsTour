// src/components/KnightsTour.js
import React, { useState, useEffect } from "react";
import Chessboard from "./Chessboard";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #1e1e1e;
  min-height: 100vh;
  color: #fff;
  font-family: Arial, sans-serif;
`;

const Controls = styled.div`
  margin: 20px;
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  background-color: #444;
  color: #fff;
  border: 2px solid #555;
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #666;
  }
`;

const Select = styled.select`
  background-color: #444;
  color: #fff;
  border: 2px solid #555;
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #666;
  }
`;

const KnightsTour = () => {
  const N = 8;
  const initialBoard = Array(N)
    .fill()
    .map(() => Array(N).fill(null));
  const [board, setBoard] = useState(initialBoard);
  const [path, setPath] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [knightPosition, setKnightPosition] = useState(null);
  const [algorithm, setAlgorithm] = useState("backtracking");

  const moves = [
    [2, 1],
    [1, 2],
    [-1, 2],
    [-2, 1],
    [-2, -1],
    [-1, -2],
    [1, -2],
    [2, -1],
  ];

  const isSafe = (x, y, board) =>
    x >= 0 && y >= 0 && x < N && y < N && board[x][y] === null;

  const solveKnightsTour = () => {
    let newBoard = Array(N)
      .fill()
      .map(() => Array(N).fill(null));
    let newPath = [[0, 0]];
    newBoard[0][0] = "K";
    if (algorithm === "backtracking") {
      if (solveKnightsTourBacktracking(newBoard, 0, 0, 1, newPath)) {
        setBoard(newBoard);
        setPath(newPath);
        setCurrentStep(0); // Reset current step
      } else {
        alert("No solution exists");
      }
    } else if (algorithm === "warnsdorff") {
      if (solveKnightsTourWarnsdorff(newBoard, newPath)) {
        setBoard(newBoard);
        setPath(newPath);
        setCurrentStep(0);
      } else {
        alert("No solution exists");
      }
    }
  };

  const solveKnightsTourBacktracking = (board, currX, currY, moveI, path) => {
    if (moveI === N * N) return true;

    for (let [dx, dy] of moves) {
      let nextX = currX + dx;
      let nextY = currY + dy;
      if (isSafe(nextX, nextY, board)) {
        board[nextX][nextY] = "K";
        path.push([nextX, nextY]);
        if (solveKnightsTourBacktracking(board, nextX, nextY, moveI + 1, path))
          return true;
        board[nextX][nextY] = null;
        path.pop();
      }
    }
    return false;
  };

  const solveKnightsTourWarnsdorff = (board, path) => {
    let x = 0,
      y = 0;
    for (let i = 1; i < N * N; i++) {
      let minDegIdx = -1,
        minDeg = 9;
      for (let k = 0; k < moves.length; k++) {
        let nx = x + moves[k][0],
          ny = y + moves[k][1];
        if (isSafe(nx, ny, board)) {
          let c = getDegree(nx, ny, board);
          if (c < minDeg) {
            minDegIdx = k;
            minDeg = c;
          }
        }
      }

      if (minDegIdx === -1) return false;

      x += moves[minDegIdx][0];
      y += moves[minDegIdx][1];
      board[x][y] = "K";
      path.push([x, y]);
    }
    return true;
  };

  const getDegree = (x, y, board) => {
    let count = 0;
    for (let [dx, dy] of moves) {
      if (isSafe(x + dx, y + dy, board)) {
        count++;
      }
    }
    return count;
  };

  useEffect(() => {
    solveKnightsTour();
  }, [algorithm]);

  useEffect(() => {
    if (path.length > 0) {
      const [x, y] = path[currentStep];
      setKnightPosition([x, y]);
    }
  }, [currentStep, path]);

  return (
    <Container>
      <Chessboard
        board={board}
        knightPosition={knightPosition}
        path={path.slice(0, currentStep)}
        speed={0.5}
      />
      <Controls>
        <Select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="backtracking">Backtracking</option>
          <option value="warnsdorff">Warnsdorff's Rule</option>
        </Select>
        <Button onClick={() => setCurrentStep(0)}>First</Button>
        <Button onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}>
          Previous
        </Button>
        <Button
          onClick={() =>
            setCurrentStep((step) => Math.min(step + 1, path.length - 1))
          }
        >
          Next
        </Button>
        <Button onClick={() => setCurrentStep(path.length - 1)}>Last</Button>
        <Button onClick={solveKnightsTour}>Restart</Button>
      </Controls>
    </Container>
  );
};

export default KnightsTour;
