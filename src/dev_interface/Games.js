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
  mutation($name: String!, $category: !String) {
    createGame(game: { name: $name, category: $category}) {
      name
      category {
          id
      }
    }
  }
`;

const UPDATE_GAME = gql`
  mutation($id: ID!, $name: String!) {
    updateGame(id: $id, game: { name: $name }) {
      id
      name
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
    allGames(limit: 100, page: 1) {
      games {
        id
        name
        slug
        category {
            name
        }
      }
    }
  }
`;

const ContentTable = (props) => {
  const {
    data,
    loading,
    error,
    deleteGame,
    successDelete,
    errorDelete,
    setShowResponse,
  } = props;

  if (loading) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Game Name</th>
            <th>Game Slug</th>
            <th>Game Category</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr>Loading...</tr>
        </tbody>
      </Table>
    );
  }

  if (error) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Game Name</th>
            <th>Game Slug</th>
            <th>Game Category</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr>Error! {error.message}</tr>
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
    <Table
      className="content-table"
      striped
      bordered
      hover
      reaponsive
      size="sm"
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Game Name</th>
          <th>Game Slug</th>
          <th>Game Category</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        {data.map((game, key) => {
          return (
            <tr key={key}>
              <td className="column">{game.id}</td>
              <td className="column">{game.name}</td>
              <td className="column">{game.slug}</td>
              <td className="column">{game.category.name}</td>
              <td className="column">
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
  const [createGame, { loading: addLoading }] = useMutation(
    ADD_GAME
  );
  const [updateGame, { loading: updateLoading }] = useMutation(
    UPDATE_GAME
  );
  const [deleteGame, { loading: deleteLoading }] = useMutation(
    DELETE_GAME
  );

  const [nameDisabled, setNameDisabled] = useState(false);
  const [IDDisabled, setIDDisabled] = useState(true);
  const [submitEvent, setSubmitEvent] = useState("Add");
  const [variant, setVariant] = useState(String);
  const [reponse, setResponse] = useState(String);
  const [showReponse, setShowResponse] = useState(false);
  const [name, setName] = useState(String);
  const [ID, setID] = useState(String);
  const [IDPlaceholder, setIDPlaceholder] = useState(String);
  const [games, setGames] = useState([]);
  const [namePlaceholder, setNamePlaceholder] = useState(
    "game name"
  );

  const {
    loading: gamesLoading,
    error: gamesError,
    data: gamesData,
  } = useQuery(GAMES);

  useEffect(() => {
    if (gamesData) setGames(gamesData.allGames.games);
  });

  function successAdd() {
    setResponse(`Successfully added '${name}' game!`);
    setVariant("success");
    setName("");
    setID("");
    setShowResponse(true);
  }

  function errorAdd() {
    setResponse(`Game '${name}' was not added!`);
    setVariant("danger");
    setShowResponse(true);
  }

  function successUpdate() {
    setResponse(
      `Successfully updated ID: '${ID}' category to '${name}'!`
    );
    setVariant("success");
    setName("");
    setID("");
    setShowResponse(true);
  }

  function errorUpdate() {
    setResponse(`Game ID: '${ID}' was not updated!`);
    setVariant("danger");
    setShowResponse(true);
  }

  function successDelete(id) {
    if (id) {
      setResponse(`Game ID: '${id}' was successfully deleted!`);
    } else {
      setResponse(
        `Game ID: '${ID}' was successfully deleted!`
      );
    }
    setVariant("success");
    setName("");
    setID("");
    setShowResponse(true);
  }

  function errorDelete(id) {
    if (id) {
      setResponse(`Game ID: '${id}' was not deleted!`);
    } else {
      setResponse(`Game ID: '${ID}' was not deleted!`);
    }
    setVariant("danger");
    setShowResponse(true);
  }

  function handleCategorySubmit() {
    switch (categorySubmitEvent) {
      case "Add":
        createCategory({
          variables: { name: categoryName },
          refetchQueries: [{ query: CATEGORIES }],
        })
          .then(() => successCategoryAdd())
          .catch(() => errorCategoryAdd());
        break;

      case "Update":
        updateCategory({
          variables: { id: categoryID, name: categoryName },
          refetchQueries: [{ query: CATEGORIES }],
        })
          .then(() => successCategoryUpdate())
          .catch(() => errorCategoryUpdate());
        break;

      case "Delete":
        deleteCategory({
          variables: { id: categoryID },
          refetchQueries: [{ query: CATEGORIES }],
        })
          .then(() => successCategoryDelete())
          .catch(() => errorCategoryDelete());
        break;

      default:
        setShowCategoryResponse(true);
        setCategoryResponse("Error!!!");
        setCategoryVariant("danger");
    }
  }

  return (
    <div className="dev">
      <Form
        className="dev-form"
        onSubmit={(event) => handleCategorySubmit(event.preventDefault())}
      >
        <div className="title-div">
          <Form.Label className="title">Category</Form.Label>
        </div>

        <Form.Group controlId="formHorizontalCategoryName">
          <Form.Label column>Category name</Form.Label>
          <Col>
            <Form.Control
              type="text"
              placeholder={categoryNamePlaceholder}
              value={categoryName}
              onChange={(event) => {
                setShowCategoryResponse(false);
                setCategoryName(event.target.value);
              }}
              required
              disabled={categoryNameDisabled}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="formHorizontalCategoryID">
          <Form.Label column>Category ID</Form.Label>
          <Col>
            <Form.Control
              type="number"
              placeholder={categoryIDPlaceholder}
              value={categoryID}
              onChange={(event) => {
                setShowCategoryResponse(false);
                setCategoryID(event.target.value);
              }}
              required
              disabled={categoryIDDisabled}
            />
          </Col>
        </Form.Group>

        <Form.Group>
          <Col>
            <Dropdown className="event-dropdown" drop="right" as={ButtonGroup}>
              <Button variant="primary" className="event-button" type="submit">
                {categorySubmitEvent} category
              </Button>

              <Dropdown.Toggle
                split
                variant="success"
                id="dropdown-split-basic"
              />

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setCategorySubmitEvent("Add");
                    setCategoryNameDisabled(false);
                    setCategoryIDDisabled(true);
                    setCategoryNamePlaceholder("category name");
                    setCategoryIDPlaceholder("");
                    setCategoryID("");
                    setShowCategoryResponse(false);
                  }}
                  className="dropdown-item"
                >
                  Add
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    setCategorySubmitEvent("Update");
                    setCategoryNameDisabled(false);
                    setCategoryIDDisabled(false);
                    setCategoryNamePlaceholder("category name");
                    setCategoryIDPlaceholder("category id");
                    setShowCategoryResponse(false);
                  }}
                  className="dropdown-item"
                >
                  Update
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    setCategorySubmitEvent("Delete");
                    setCategoryNameDisabled(true);
                    setCategoryIDDisabled(false);
                    setCategoryNamePlaceholder("");
                    setCategoryName("");
                    setCategoryIDPlaceholder("category id");
                    setShowCategoryResponse(false);
                  }}
                  className="dropdown-item"
                >
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Form.Group>

        {(categoryAddLoading ||
          categoryUpdateLoading ||
          categoryDeleteLoading) && (
          <Form.Group>
            <Col>
              <Alert variant="info">Working...</Alert>
            </Col>
          </Form.Group>
        )}

        {showCategoryReponse && (
          <Form.Group>
            <Col>
              <Alert variant={categoryVariant}>{categoryReponse}</Alert>
            </Col>
          </Form.Group>
        )}
      </Form>

      <ContentTable
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        categoriesData={categories}
        deleteCategory={deleteCategory}
        successCategoryDelete={successCategoryDelete}
        errorCategoryDelete={errorCategoryDelete}
        setShowCategoryResponse={setShowCategoryResponse}
      />
    </div>
  );
};
