import React, { Component } from "react";
import "./App.scss";
import NavigationBar from "./components/NavigationBar";
import Sidebar from "./components/Sidebar";
import ClassCarousel from "./components/Carousel";
import Footer from "./components/Footer";
import { Login } from "./Login";
import { Register } from "./Register";
import { Home } from "./Home";
import { About } from "./About";
import { NoMatch } from "./NoMatch";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {
  state = {
    categories: [
      {
        name: "FPS",
        url: "/categories/fps",
      },
      {
        name: "MOBA",
        url: "/categories/moba",
      },
      {
        name: "TPS",
        url: "/categories/tps",
      },
      {
        name: "Party",
        url: "/categories/paty",
      },
      {
        name: "Survival",
        url: "/categories/survival",
      },
      {
        name: "Platformer",
        url: "/categories/platformer",
      },
      {
        name: "Racing",
        url: "/categories/racing",
      },
      {
        name: "Sport",
        url: "/categories/sport",
      },
      {
        name: "RTS",
        url: "/categories/rts",
      },
    ],
    games: [
      {
        name: "League of Legends",
        url: "/games/league-of-legends",
        category: "MOBA",
      },
      {
        name: "Counter Strike: Global Offensive",
        url: "/games/counter-strike-global-offensive",
        category: "FPS",
      },
      {
        name: "Skribblio",
        url: "/games/skribblio",
        category: "Party",
      },
      {
        name: "Call of Duty: Warzone",
        url: "/games/call-of-duty-warzone",
        category: "FPS",
      },
      {
        name: "Minecraft",
        url: "/games/minecraft",
        category: "Survival",
      },
      {
        name: "Terraria",
        url: "/games/terraria",
        category: "Platformer",
      },
      {
        name: "Dying Light",
        url: "/games/dying-light",
        category: "Survival",
      },
      {
        name: "Assetto Corsa",
        url: "/games/assetto-corsa",
        category: "Racing",
      },
      {
        name: "The Crew",
        url: "/games/the-crew",
        category: "Racing",
      },
      {
        name: "Pummel Party",
        url: "/games/pummel-party",
        category: "Party",
      },
      {
        name: "The Forest",
        url: "/games/the-forest",
        category: "Survival",
      },
      {
        name: "Homeworld Remastered",
        url: "/games/homeworld-remastered",
        category: "RTS",
      },
      {
        name: "Grand Theft Auto V: Online",
        url: "/games/grand-theft-auto-v-online",
        category: "",
      },
      {
        name: "Red Dead Redemption Online",
        url: "/games/red-dead-redemption-online",
        category: "TPS",
      },
      {
        name: "Fortnite",
        url: "/games/fortnite",
        category: "TPS",
      },
      {
        name: "FIFA21",
        url: "/games/fifa21",
        category: "Sport",
      },
    ],
  };
  render() {
    const { categories, games } = this.state;
    return (
      <React.Fragment>
        <Router>
          <div className="sticky-navbar">
            <NavigationBar categories={categories} games={games} />
          </div>
          <div className="height">
            <Sidebar categories={categories} games={games} />
            <div className="content-wrapper">
              <ClassCarousel />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Register} />
                <Route path="/about" component={About} />
                <Route component={NoMatch} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </React.Fragment>
    );
  }
}

export default App;
