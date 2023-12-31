import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import AppleLogo from "./applePixels.png";
import Monitor from "./oldMonitor.png";
import useInterval from "./useInterval";
import Leadboard from "./Leadboard";

const canvasX = 1000;
const canvasY = 1000;
const initialSnake = [
  [4, 10],
  [4, 10],
];
const initialApple = [14, 10];
const scale = 50;
let timeDelay = 150;

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState(initialSnake);
  const [apple, setApple] = useState(initialApple);
  const [direction, setDirection] = useState([0, -1]);
  const [delay, setDelay] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [pause, setPause] = useState(false);
  const [score, setScore] = useState(0);

  useInterval(() => runGame(), delay);

  useEffect(() => {
    let fruit = document.getElementById("fruit") as HTMLCanvasElement;
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = "#a3d001";
        snake.forEach(([x, y]) => ctx.fillRect(x, y, 1, 1));
        ctx.drawImage(fruit, apple[0], apple[1], 1, 1);
      }
    }
  }, [snake, apple, gameOver]);

  function handleSetScore() {
    if (score > Number(localStorage.getItem("snakeScore"))) {
      localStorage.setItem("snakeScore", JSON.stringify(score));
    }
  }

  function play() {
    setSnake(initialSnake);
    setApple(initialApple);
    setDirection([1, 0]);
    setDelay(timeDelay);
    setScore(0);
    setGameOver(false);
    setPause(false);
  }

  function togglePause() {
    setPause((prevState) => !prevState);
  }

  useEffect(() => {
    if (pause) {
      setDelay(null);
    } else setDelay(timeDelay);
  }, [pause]);

  function checkCollision(head: number[]) {
    for (let i = 0; i < head.length; i++) {
      if (head[i] < 0 || head[i] * scale >= canvasX) return true;
    }
    for (const s of snake) {
      if (head[0] === s[0] && head[1] === s[1]) return true;
    }
    return false;
  }

  function appleAte(newSnake: number[][]) {
    let coord = apple.map(() => Math.floor((Math.random() * canvasX) / scale));
    let fruitType = 1; 

    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      fruitType = Math.floor(Math.random() * 3) + 1;

      let points = 0;
      if (fruitType === 1) {
        points = 1;
      } else if (fruitType === 2) {
        points = 5;
      } else if (fruitType === 3) {
        points = 10;
      }

      setScore(score + points);

      let newApple = coord;
      setApple(newApple);

      return true;
    }
    return false;
  }

  function runGame() {
    const newSnake = [...snake];
    const newSnakeHead = [
      newSnake[0][0] + direction[0],
      newSnake[0][1] + direction[1],
    ];
    newSnake.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) {
      setDelay(null);
      setGameOver(true);
      handleSetScore();
    }
    if (!appleAte(newSnake)) {
      newSnake.pop();
    }
    setSnake(newSnake);

    if (score > 0 && score % 50 === 0) {
      setDelay(timeDelay - 20);
    }
  }

  

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      handleKeyDown(e);
    });
    // eslint-disable-next-line
  }, []);

  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      play();
    }
    if (e.key === " ") {
      togglePause();
    }

    changeDirection(e);
  }
  function changeDirection(e: any) {
    switch (e.key) {
      case "ArrowLeft":
        setDirection([-1, 0]);
        break;
      case "ArrowUp":
        setDirection([0, -1]);
        break;
      case "ArrowRight":
        setDirection([1, 0]);
        break;
      case "ArrowDown":
        setDirection([0, 1]);
        break;
    }
  }

	return (
	  
		<div>
		<Leadboard/>
      <img id="fruit" src={AppleLogo} alt="fruit" width="30" />
      <img src={Monitor} alt="fruit" width="4000" className="monitor" />
      <canvas
        className="playArea"
        ref={canvasRef}
        width={`${canvasX}px`}
        height={`${canvasY}px`}
      />
      {gameOver && <div className="gameOver">Game Over</div>}
      {pause && <div className="gameOver">Paused</div>}
      <button className="playButton">Enter</button>
      <div className="scoreBox">
        <h2>Score: {score}</h2>
        <h2>High Score: {localStorage.getItem("snakeScore")}</h2>
      </div>
    </div>
  );
}

export default App;
