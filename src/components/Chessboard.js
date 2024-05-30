import React from "react";
import styled, { keyframes } from "styled-components";
import knightImage from "../knight.jpg";

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 60px);
  grid-template-rows: repeat(8, 60px);
  margin: 20px auto;
  border: 2px solid #444;
  position: relative;
`;

const Square = styled.div`
  width: 60px;
  height: 60px;
  background-color: ${(props) => (props.isDark ? "#da8a8b" : "#282157")};
  border: 1px solid #444;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  position: relative;
`;

const moveKnight = keyframes`
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(${(props) => props.x * 100}%, ${(props) =>
  props.y * 100}%);
  }
`;

const Knight = styled.div`
  position: absolute;
  top: ${(props) => props.y * 60}px;
  left: ${(props) => props.x * 60}px;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  color: #000;
  border: 2px solid #ffcc00;
  background-color: #ffcc00;
  box-sizing: border-box;
  animation: ${(props) => moveKnight} ${(props) => props.speed}s ease-in-out
    forwards;
  img {
    width: 150%;
    height: 150%;
    object-fit: contain;
  }
`;

const PathSquare = styled.div`
  position: absolute;
  top: ${(props) => props.y * 60}px;
  left: ${(props) => props.x * 60}px;
  width: 60px;
  height: 60px;
  background-color: rgba(255, 0, 0, 0.5); /* Changed to a reddish shade */
  pointer-events: none;
`;

const Chessboard = ({ board, knightPosition, path, speed }) => {
  return (
    <Board>
      {board.map((row, rowIndex) =>
        row.map((col, colIndex) => (
          <Square
            key={`${rowIndex}-${colIndex}`}
            isDark={(rowIndex + colIndex) % 2 === 1}
          ></Square>
        ))
      )}
      {path.map(([x, y], index) => (
        <PathSquare key={index} x={y} y={x} />
      ))}
      {knightPosition && (
        <Knight x={knightPosition[1]} y={knightPosition[0]} speed={speed}>
          <img src={knightImage} alt="Knight" width="40" />
        </Knight>
      )}
    </Board>
  );
};

export default Chessboard;
