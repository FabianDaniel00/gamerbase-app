import React, { useState, useEffect } from "react";
import {
  Form,
  Col,
  Button,
  Dropdown,
  ButtonGroup,
  Alert,
  Table,
} from "react-bootstrap";
import { gql, useMutation, useQuery } from "@apollo/client";
import "../Form.scss";
import "./Table.scss";

const ADD_GAME = gql`
  mutation($name: String!, $categoryID: Int!) {
    createGame(game: { name: $name, category: $categoryID }) {
      name
      category {
        name
      }
    }
  }
`;

const UPDATE_GAME = gql`
  mutation($id: ID!, $name: String!, $categoryID: Int!) {
    updateGame(id: $id, game: { name: $name, category: $categoryID }) {
      id
      name
      category {
        id
      }
    }
  }
`;

const DELETE_GAME = gql`
  mutation($id: ID!) {
    deleteGame(id: $id)
  }
`;

const GAMES = gql`
  {
    allGames(limit: 0, page: 1) {
      games {
        id
        name
        slug
        category {
          name
          id
        }
      }
    }
  }
`;

const CATEGORIES = gql`
  {
    allCategories(limit: 0, page: 1) {
      categories {
        name
        id
      }
    }
  }
`;

const ContentTable = (props) => {
  const {
    gamesData,
    gamesLoading,
    gamesError,
    deleteGame,
    successDelete,
    errorDelete,
    setShowResponse,
    tableClick,
  } = props;

  if (gamesLoading) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Game Name</th>
            <th>Game Category</th>
            <th>Game Slug</th>
            <th className="text-center">Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">
              <i className="fas fa-spinner fa-spin" />
            </td>
            <td className="text-center">
              <i className="fas fa-spinner fa-spin" />
            </td>
            <td className="text-center">
              <i className="fas fa-spinner fa-spin" />
            </td>
            <td className="text-center">
              <i className="fas fa-spinner fa-spin" />
            </td>
            <td className="text-center">
              <i className="fas fa-spinner fa-spin" />
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }

  if (gamesError) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Game Name</th>
            <th>Game Category</th>
            <th>Game Slug</th>
            <th className="text-center">Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">Error! {gamesError.message}</tr>
        </tbody>
      </Table>
    );
  }

  function remove(id) {
    deleteGame({
      variables: { id: id },
      refetchQueries: [{ query: GAMES }],
    })
      .then(() => successDelete(id))
      .catch(() => errorDelete(id));
  }

  return (
    <Table className="content-table" striped bordered hover size="sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>Game Name</th>
          <th>Game Category</th>
          <th>Game Slug</th>
          <th className="text-center">Remove</th>
        </tr>
      </thead>
      <tbody>
        {gamesData.map((game, key) => {
          return (
            <tr
              onClick={() => tableClick(game.name, game.category.id, game.id)}
              key={key}
            >
              <td className="column">{game.id}</td>
              <td className="column">{game.name}</td>
              <td className="column">{game.category.name}</td>
              <td className="column">{game.slug}</td>
              <td className="text-center">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    setShowResponse(false);
                    remove(game.id);
                  }}
                >
                  Remove
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export const Games = () => {
  const [createGame, { loading: addLoading, error: addError }] = useMutation(
    ADD_GAME
  );

  const [
    updateGame,
    { loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_GAME);

  const [
    deleteGame,
    { loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_GAME);

  const [nameDisabled, setNameDisabled] = useState(false);
  const [categoryDisabled, setCategoryDisabled] = useState(false);
  const [IDDisabled, setIDDisabled] = useState(true);
  const [submitEvent, setSubmitEvent] = useState("Add");
  const [variant, setVariant] = useState(String);
  const [response, setResponse] = useState(String);
  const [showResponse, setShowResponse] = useState(false);
  const [name, setName] = useState(String);
  const [categoryID, setCategoryID] = useState(String);
  const [ID, setID] = useState(String);
  const [IDPlaceholder, setIDPlaceholder] = useState(String);
  const [namePlaceholder, setNamePlaceholder] = useState("game name");
  const [nameError, setNameError] = useState(String);
  const [IDError, setIDError] = useState(String);
  const [required, setRequired] = useState(true);
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);

  const {
    loading: gamesLoading,
    error: gamesError,
    data: gamesData,
  } = useQuery(GAMES);

  const {
    loading: categoriesLoading,
    error: categoriesError,
    data: categoriesData,
  } = useQuery(CATEGORIES);

  useEffect(() => {
    if (gamesData) setGames(gamesData.allGames.games);
    if (categoriesData) setCategories(categoriesData.allCategories.categories);
  }, [gamesData, categoriesData]);

  function tableClick(_name, _categoryID, _id) {
    if (submitEvent === "Update") {
      setName(_name);
      setCategoryID(_categoryID);
      setID(_id);
    } else if (submitEvent === "Delete") {
      setID(_id);
    }
  }

  function successAdd() {
    setResponse(`Successfully added '${name}' game!`);
    setVariant("success");
    setName("");
    setCategoryID("");
    setID("");
    setShowResponse(true);
    setNameError("");
  }

  function errorAdd(error) {
    if (error === "This game exists!") {
      setNameError("warning");
    }
    setResponse(`Game '${name}' was not added! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function successUpdate() {
    setResponse(`Successfully updated ID: '${ID}' game to '${name}'!`);
    setVariant("success");
    setName("");
    setCategoryID("");
    setID("");
    setShowResponse(true);
    setNameError("");
    setIDError("");
  }

  function errorUpdate(error) {
    if (error === "This game exists!") {
      setNameError("warning");
    } else if (error === "This game is unavailable!") {
      setIDError("warning");
    }
    setResponse(`Game ID: '${ID}' was not updated! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function successDelete(id) {
    if (id) {
      setResponse(`Game ID: '${id}' was successfully deleted!`);
    } else {
      setResponse(`Game ID: '${ID}' was successfully deleted!`);
    }
    setVariant("success");
    setName("");
    setCategoryID("");
    setID("");
    setShowResponse(true);
    setIDError("");
  }

  function errorDelete(id) {
    if (id) {
      setResponse(
        `Game ID: '${id}' was not deleted! This game does not exist!`
      );
      setIDError("warning");
    } else {
      setResponse(
        `Game ID: '${ID}' was not deleted! This game does not exist!`
      );
      setIDError("warning");
    }
    setVariant("danger");
    setShowResponse(true);
  }

  function handleSubmit() {
    switch (submitEvent) {
      case "Add":
        createGame({
          variables: { name: name, categoryID: categoryID },
          refetchQueries: [{ query: GAMES }],
        })
          .then(() => successAdd())
          .catch((error) => errorAdd(error.message));
        break;

      case "Update":
        updateGame({
          variables: { id: ID, name: name, categoryID: categoryID },
          refetchQueries: [{ query: GAMES }],
        })
          .then(() => successUpdate())
          .catch((error) => errorUpdate(error.message));
        break;

      case "Delete":
        deleteGame({
          variables: { id: ID },
          refetchQueries: [{ query: GAMES }],
        })
          .then(() => successDelete())
          .catch(() => errorDelete());
        break;

      default:
        setShowResponse(true);
        setResponse("Error!!!");
        setVariant("danger");
    }
    if (addError) {
      errorAdd(addError.message);
    } else if (updateError) {
      errorUpdate(updateError.message);
    } else if (deleteError) {
      errorDelete();
    }
    setNameError("");
    setIDError("");
  }

  return (
    <div className="dev">
      <Form
        className="dev-form"
        onSubmit={(event) => {
          handleSubmit(event.preventDefault());
          setShowResponse(false);
        }}
      >
        <div className="title-div">
          <Form.Label className="title">Game</Form.Label>
        </div>

        <Form.Group controlId="formHorizontalGameName">
          <Form.Label column>Game name</Form.Label>
          <Col>
            <Form.Control
              type="text"
              placeholder={namePlaceholder}
              value={name}
              onChange={(event) => {
                setShowResponse(false);
                setName(event.target.value);
                setNameError("");
              }}
              id={nameError}
              required={required}
              disabled={nameDisabled}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="formHorizontalCategory">
          <Form.Label column>Game category</Form.Label>
          <Col>
            <Form.Control
              as="select"
              onChange={(event) => {
                setShowResponse(false);
                setCategoryID(event.target.value);
              }}
              value={categoryID}
              required
              disabled={categoryDisabled}
            >
              {categoriesLoading && <option>Loading...</option>}
              {categoriesError && (
                <option>Error! {categoriesError.message}</option>
              )}
              {categoriesData && (
                <option value="">Choose one category...</option>
              )}
              {categories.map((category, key) => {
                return (
                  <option key={key} value={category.id}>
                    {category.name}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group controlId="formHorizontalID">
          <Form.Label column>Game ID</Form.Label>
          <Col>
            <Form.Control
              type="number"
              placeholder={IDPlaceholder}
              value={ID}
              onChange={(event) => {
                setShowResponse(false);
                setID(event.target.value);
                setIDError("");
              }}
              id={IDError}
              required
              disabled={IDDisabled}
            />
          </Col>
        </Form.Group>

        <Form.Group>
          <Col>
            <Dropdown className="event-dropdown" drop="right" as={ButtonGroup}>
              <Button variant="primary" className="event-button" type="submit">
                {submitEvent} game
              </Button>

              <Dropdown.Toggle
                split
                variant="success"
                id="dropdown-split-basic"
              />

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setSubmitEvent("Add");
                    setNameDisabled(false);
                    setCategoryDisabled(false);
                    setIDDisabled(true);
                    setNamePlaceholder("game name");
                    setIDPlaceholder("");
                    setID("");
                    setShowResponse(false);
                    setRequired(true);
                    setNameError("");
                    setIDError("");
                  }}
                  className="dropdown-item"
                >
                  Add
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    setSubmitEvent("Update");
                    setNameDisabled(false);
                    setCategoryDisabled(false);
                    setIDDisabled(false);
                    setNamePlaceholder("game name");
                    setIDPlaceholder("game id");
                    setShowResponse(false);
                    setRequired(false);
                    setNameError("");
                    setIDError("");
                  }}
                  className="dropdown-item"
                >
                  Update
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    setSubmitEvent("Delete");
                    setNameDisabled(true);
                    setCategoryDisabled(true);
                    setIDDisabled(false);
                    setNamePlaceholder("");
                    setName("");
                    setIDPlaceholder("game id");
                    setCategoryID("");
                    setShowResponse(false);
                    setRequired(true);
                    setNameError("");
                    setIDError("");
                  }}
                  className="dropdown-item"
                >
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Form.Group>

        {(addLoading || updateLoading || deleteLoading) && (
          <Form.Group>
            <Col>
              <Alert className="text-center" variant="info">
                <i className="fas fa-spinner fa-spin" />
              </Alert>
            </Col>
          </Form.Group>
        )}

        {showResponse && (
          <Form.Group>
            <Col>
              <Alert variant={variant}>{response}</Alert>
            </Col>
          </Form.Group>
        )}
      </Form>

      <ContentTable
        gamesLoading={gamesLoading}
        gamesError={gamesError}
        gamesData={games}
        deleteGame={deleteGame}
        successDelete={successDelete}
        errorDelete={errorDelete}
        setShowResponse={setShowResponse}
        tableClick={tableClick}
      />
    </div>
  );
};
