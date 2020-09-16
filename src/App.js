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
import { useQuery, gql } from "@apollo/client";

const CATEGORIES = gql`
  {
    allCategories(limit: 0, page: 1) {
      categories {
        name
        slug
      }
    }
  }
`;

const GAMES = gql`
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
`;

const App = () => {
  const [categories, setCategories] = useState([]);
  const [games, setGames] = useState([]);
  const [redirectToHome_, setRedirectToHome_] = useState(Boolean);
  const [redirectToLogin_, setRedirectToLogin_] = useState(Boolean);
  const [userData, setUserData] = useState({});

  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(CATEGORIES);

  const {
    loading: gamesLoading,
    error: gamesError,
    data: gamesData,
  } = useQuery(GAMES);

  useEffect(() => {
    if (categoriesData && gamesData) {
      setCategories(categoriesData.allCategories.categories);
      setGames(gamesData.allGames.games);
    }
  }, [categoriesData, gamesData]);

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
    setRedirectToHome_(true);
  };

  useEffect(() => {
    return () => {
      setRedirectToHome_(false);
      return <Redirect to="/" />;
    };
  }, [redirectToHome_]);

  const redirectToLogin = () => {
    setRedirectToLogin_(true);
  };

  useEffect(() => {
    return () => {
      setRedirectToLogin_(false);
      return <Redirect to="/login" />;
    };
  }, [redirectToLogin_]);

  function getUserData() {
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
          response
            .json()
            .then((result) => {
              setUserData(result.data.userFromToken);
            })
            .catch(() => {
              localStorage.clear();
              setRedirectToLogin_(true);
            });
        })
        .catch((error) => {
          setUserData({
            userName: <i className="error">[{error.message}]</i>,
            id: <i className="error">[{error.message}]</i>,
          });
        });
    }
  }

  useEffect(() => {
    getUserData();
  }, [redirectToHome_]);

  return (
    <Router>
      {useWindowSize() <= 500 ? (
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
      ) : (
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
          redirectToLogin={redirectToLogin}
        />
        <div className="content-wrapper">
          <ClassCarousel />
          <Switch>
            <Route exact path="/">
              {localStorage.getItem("token") &&
              JSON.parse(localStorage.getItem("token")).isLogged ? (
                <>
                  {userData.id && (
                    <Home
                      // getUserData={getUserData}
                      userID={parseInt(userData.id)}
                    />
                  )}
                </>
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
  );
};

export default App;
