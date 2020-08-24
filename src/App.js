import React, { useState, useLayoutEffect, useEffect } from "react";
import "./App.scss";
import DevInterface from "./dev_interface/DevInterface";
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
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
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
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(String);
  const [games, setGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(true);
  const [gamesError, setGamesError] = useState(String);
  const [redirect, setRedirect] = useState(Boolean);
  const [userData, setUserData] = useState({});

  client
    .query({
      query: gql`
        {
          allCategories(limit: 0, page: 1) {
            categories {
              name
              slug
            }
          }
        }
      `,
    })
    .then(({ error, data }) => {
      if (error) setCategoriesError(error.message);
      if (data) {
        setCategories(data.allCategories.categories);
        setCategoriesLoading(false);
      }
    })
    .catch((error) => {
      setCategoriesError(error.message);
    });

  client
    .query({
      query: gql`
        {
          allGames(limit: 0, page: 1) {
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
    .then(({ error, data }) => {
      if (error) setGamesError(error.message);
      if (data) {
        setGames(data.allGames.games);
        setGamesLoading(false);
      }
    })
    .catch((error) => {
      setGamesError(error.message);
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

  const redirectToHome = () => {
    setRedirect(true);
  };

  useEffect(() => {
    return () => {
      setRedirect(false);
      return <Redirect to="/" />;
    };
  }, [redirect]);

  useEffect(() => {
    if (
      localStorage.getItem("token") &&
      JSON.parse(localStorage.getItem("token")).token
    ) {
      require("es6-promise").polyfill();
      require("isomorphic-fetch");

      fetch("http://localhost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("token")).token
          }`,
        },
        body: JSON.stringify({ query: "{userFromToken{id, userName}}" }),
      })
        .then((response) => {
          response.json().then((result) => {
            setUserData(result.data.userFromToken);
          });
        })
        .catch((error) => {
          setUserData({
            userName: <i style="color: red">[{error.message}]</i>,
            id: <i style="color: red">[{error.message}]</i>,
          });
        });
    }
  }, [redirect]);

  return (
    <ApolloProvider client={client}>
      <Router>
        {useWindowSize() <= 500 && (
          <Headroom>
            <div className="sticky-navbar">
              <NavigationBar
                categoriesLoading={categoriesLoading}
                categoriesError={categoriesError}
                gamesLoading={gamesLoading}
                gamesError={gamesError}
                categories={categories}
                games={games}
                userData={userData}
              />
            </div>
          </Headroom>
        )}
        {useWindowSize() > 500 && (
          <div className="sticky-navbar">
            <NavigationBar
              categoriesLoading={categoriesLoading}
              categoriesError={categoriesError}
              gamesLoading={gamesLoading}
              gamesError={gamesError}
              categories={categories}
              games={games}
              userData={userData}
            />
          </div>
        )}
        <div className="height">
          <Sidebar
            categoriesLoading={categoriesLoading}
            categoriesError={categoriesError}
            gamesLoading={gamesLoading}
            gamesError={gamesError}
            categories={categories}
            games={games}
            redirectToHome={redirectToHome}
          />
          <div className="content-wrapper">
            <ClassCarousel />
            <Switch>
              <Route exact path="/">
                {localStorage.getItem("token") &&
                JSON.parse(localStorage.getItem("token")).isLogged ? (
                  <>{userData.id && <Home userID={parseInt(userData.id)} />}</>
                ) : (
                  <Redirect to="/login" />
                )}
              </Route>

              <Route path="/signup">
                {localStorage.getItem("token") &&
                JSON.parse(localStorage.getItem("token")).isLogged ? (
                  <Redirect to="/" />
                ) : (
                  <Register />
                )}
              </Route>

              <Route path="/login">
                {localStorage.getItem("token") &&
                JSON.parse(localStorage.getItem("token")).isLogged ? (
                  <Redirect to="/" />
                ) : (
                  <Login redirectToHome={redirectToHome} />
                )}
              </Route>

              <Route path="/about" component={About} />
              <Route path="/dev-interface">
                {localStorage.getItem("token") &&
                JSON.parse(localStorage.getItem("token")).isLogged ? (
                  <DevInterface />
                ) : (
                  <Redirect to="/login" />
                )}
              </Route>

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
