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

const Slider = styled.input`
  margin: 0 10px;
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
  const [speed, setSpeed] = useState(0.5);

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
    if (solveKnightsTourUtil(newBoard, 0, 0, 1, newPath)) {
      setBoard(newBoard);
      setPath(newPath);
      setCurrentStep(0);
    } else {
      alert("No solution exists");
    }
  };

  const solveKnightsTourUtil = (board, currX, currY, moveI, path) => {
    if (moveI === N * N) return true;

    for (let [dx, dy] of moves) {
      let nextX = currX + dx;
      let nextY = currY + dy;
      if (isSafe(nextX, nextY, board)) {
        board[nextX][nextY] = "K";
        path.push([nextX, nextY]);
        if (solveKnightsTourUtil(board, nextX, nextY, moveI + 1, path))
          return true;
        board[nextX][nextY] = null;
        path.pop();
      }
    }
    return false;
  };

  useEffect(() => {
    solveKnightsTour();
  }, []);

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
        speed={speed}
      />
      <Controls>
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
