import { useState, useEffect } from "react";

const url =
  "https://snake-game-738ae-default-rtdb.europe-west1.firebasedatabase.app/leaderboard.json";

type Player = {
  id: number;
  username: string;
  score: number;
}

export default function Leadboard() {
  const [inputModal, setInputModal] = useState(false);
  const [username, setUsername] = useState("");
  const [playerList, setPlayerList] = useState<Player[]>([]);

  useEffect(() => {
    fetchLeaderBoard();
  }, []);

  function handleInputModal() {
    setInputModal((prevState) => !prevState);
  }

  async function fetchLeaderBoard() {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Перетворити об'єкт на масив
    const dataArray: Player[] = Object.values(data);

      // Зберегти дані у стані
      const sortedPlayers = dataArray.sort((a, b) => b.score - a.score);

    setPlayerList(sortedPlayers);

    
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const highScore = localStorage.getItem("snakeScore");

    const data = {
      id: Math.random() * 999,
      username: username,
      score: highScore,
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(url, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        fetchLeaderBoard();
      })
      .catch((error) => {
        console.error("Error updating leaderboard:", error);
      });
  }

  return (
    <div className="leadboard">
      <p onClick={handleInputModal} className="addPlayer">
        {" "}
        +{" "}
      </p>
      <h2 style={{ color: "goldenrod" }}>Leaderboard</h2>
      {inputModal && (
        <form onSubmit={handleSubmit} className="inputModal">
          <input
            type="text"
            minLength={3}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            required
          />{" "}
          <button className="submitAdd"> Add</button>{" "}
        </form>
      )}
      <div className="playerList">
        {playerList.map((player, index) => (
            <div key={index} className="player">
                <span className="playerIndex">{index +1}</span>
            <p>{player.username}</p>
            <p className="score">{player.score}p</p>
          </div>
        ))}
      </div>
    </div>
  );
}
