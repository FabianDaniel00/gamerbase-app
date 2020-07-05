import React from 'react';
import './App.css';

function App() {
  let games = [
  {
    name: "COD",
    type: "FPS"
  },
  {
    name: "LOL",
    type: "RPG"
  },
  {
    name: "WOT",
    type: "Strategy"
  },
  {
    name: "Valorant",
    type: "FPS"
  }];

  let fps = games.filter((game) => {
    return game.type === "FPS" ? game : null
  })
  let rpg = games.filter((game) => {
    return game.type === "RPG" ? game : null
  })
  let strategy = games.filter((game) => {
    return game.type === "Strategy" ? game : null
  })

  return (
    <div className="App">
      <h1>Games</h1>
      <h2>FPS:</h2>
      <ul className="fps">
      {
          fps.map((game) => {
          return(<li>Nev: {game.name}, tipus: {game.type}</li>)
          })
        }
      </ul>
      <h2>RPG:</h2>
      <ul className="rpg">
      {
          rpg.map((game) => {
          return(<li>Nev: {game.name}, tipus: {game.type}</li>)
          })
        }
      </ul>
      <h2>Strategy:</h2>
      <ul className="stgy">
      {
          strategy.map((game) => {
          return(<li>Nev: {game.name}, tipus: {game.type}</li>)
          })
        }
      </ul>
    </div>
  );
}

export default App;
