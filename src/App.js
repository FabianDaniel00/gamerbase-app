import React, { useState, useLayoutEffect } from "react";
import "./App.scss";
import Headroom from "react-headroom";
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
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost",
  cache: new InMemoryCache(),
});

const App = () => {
  const [categories, setCategories] = useState([]);
  const [games, setGames] = useState([]);

  client
    .query({
      query: gql`
        {
          allCategories(limit: 30, page: 1) {
            categories {
              name
              slug
            }
          }
        }
      `,
    })
    .then(({ data }) => {
      setCategories(data.allCategories.categories);
    });

  client
    .query({
      query: gql`
        {
          allGames(limit: 30, page: 1) {
            games {
              name
              slug
              category {
                name
              }
            }
          }
        }
      `,
    })
    .then(({ data }) => {
      setGames(data.allGames.games);
    });

  const useWindowSize = () => {
    const [size, setSize] = useState([0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth]);
      }
      window.addEventListener("resize", updateSize);
      updateSize();
      return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        {useWindowSize() <= 500 && (
          <Headroom>
            <div className="sticky-navbar">
              <NavigationBar categories={categories} games={games} />
            </div>
          </Headroom>
        )}
        {useWindowSize() > 500 && (
          <div className="sticky-navbar">
            <NavigationBar categories={categories} games={games} />
          </div>
        )}
        <div className="height">
          <Sidebar categories={categories} games={games} />
          <div className="content-wrapper">
            <ClassCarousel />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route
                path="/login"
                component={() => <Login client={client} />}
              />
              <Route
                path="/signup"
                component={() => <Register client={client} />}
              />
              <Route path="/about" component={About} />
              <Route component={NoMatch} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
};

export default App;
