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

const ADD_ROOM = gql`
  mutation($game: Int!, $isPrivate: Boolean!, $name: String!) {
    createRoom(room: { game: $game, isPrivate: $isPrivate, name: $name }) {
      name
      isPrivate
      game {
        name
      }
    }
  }
`;

const UPDATE_ROOM = gql`
  mutation($id: ID!, $name: String!, $isPrivate: Boolean!, $gameID: Int!) {
    updateRoom(
      id: $id
      room: { name: $name, isPrivate: $isPrivate, game: $gameID }
    ) {
      id
      name
      isPrivate
      game {
        name
      }
    }
  }
`;

const DELETE_ROOM = gql`
  mutation($id: ID!) {
    deleteRoom(id: $id)
  }
`;

const ROOMS = gql`
  {
    allRooms(limit: 0, page: 1) {
      rooms {
        id
        name
        game {
          name
          id
        }
        isPrivate
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
        id
      }
    }
  }
`;

const ContentTable = (props) => {
  const {
    roomsData,
    roomsLoading,
    roomsError,
    deleteRoom,
    successDelete,
    errorDelete,
    setShowResponse,
    tableClick,
  } = props;

  if (roomsLoading) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Room Name</th>
            <th>Room Game</th>
            <th>Room is private</th>
            <th>Rooom Slug</th>
            <th className="text-center">Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">Loading...</tr>
        </tbody>
      </Table>
    );
  }

  if (roomsError) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Room Name</th>
            <th>Room Game</th>
            <th>Room is private</th>
            <th>Rooom Slug</th>
            <th className="text-center">Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">Error! {roomsError.message}</tr>
        </tbody>
      </Table>
    );
  }

  function remove(id) {
    deleteRoom({
      variables: { id: id },
      refetchQueries: [{ query: ROOMS }],
    })
      .then(() => successDelete(id))
      .catch(() => errorDelete(id));
  }

  return (
    <Table className="content-table" striped bordered hover size="sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>Room Name</th>
          <th>Room Game</th>
          <th>Room is private</th>
          <th>Rooom Slug</th>
          <th className="text-center">Remove</th>
        </tr>
      </thead>
      <tbody>
        {roomsData.map((room, key) => {
          return (
            <tr
              onClick={() =>
                tableClick(room.name, room.game.id, room.isPrivate, room.id)
              }
              key={key}
            >
              <td className="column">{room.id}</td>
              <td className="column">{room.name}</td>
              <td className="column">{room.game.name}</td>
              <td className="column">
                {String(room.isPrivate).charAt(0).toUpperCase() +
                  String(room.isPrivate).slice(1)}
              </td>
              <td className="column">{room.slug}</td>
              <td className="text-center">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    setShowResponse(false);
                    remove(room.id);
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

export const Rooms = () => {
  const [createRoom, { loading: addLoading, error: addError }] = useMutation(
    ADD_ROOM
  );
  const [
    updateRoom,
    { loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_ROOM);
  const [
    deleteRoom,
    { loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_ROOM);

  const [nameDisabled, setNameDisabled] = useState(false);
  const [gameDisabled, setGameDisabled] = useState(false);
  const [isPrivateDisabled, setIsPrivateDisabled] = useState(false);
  const [IDDisabled, setIDDisabled] = useState(true);
  const [submitEvent, setSubmitEvent] = useState("Add");
  const [variant, setVariant] = useState(String);
  const [response, setResponse] = useState(String);
  const [showResponse, setShowResponse] = useState(false);
  const [name, setName] = useState(String);
  const [namePlaceholder, setNamePlaceholder] = useState("room name");
  const [gameID, setGameID] = useState(String);
  const [isPrivate, setIsPrivate] = useState(String);
  const [ID, setID] = useState(String);
  const [IDPlaceholder, setIDPlaceholder] = useState(String);
  const [IDError, setIDError] = useState(String);
  const [required, setRequired] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [games, setGames] = useState([]);

  const {
    loading: roomsLoading,
    error: roomsError,
    data: roomsData,
  } = useQuery(ROOMS);

  const {
    loading: gamesLoading,
    error: gamesError,
    data: gamesData,
  } = useQuery(GAMES);

  useEffect(() => {
    if (roomsData) setRooms(roomsData.allRooms.rooms);
    if (gamesData) setGames(gamesData.allGames.games);
  });

  function tableClick(_name, _gameID, _isPrivate, _id) {
    if (submitEvent === "Update") {
      setName(_name);
      setGameID(_gameID);
      setIsPrivate(_isPrivate);
      setID(_id);
    } else if (submitEvent === "Delete") {
      setID(_id);
    }
  }

  function successAdd() {
    setResponse(`Successfully added '${name}' room!`);
    setVariant("success");
    setName("");
    setGameID("");
    setIsPrivate("");
    setID("");
    setShowResponse(true);
  }

  function errorAdd(error) {
    setResponse(`Room '${name}' was not added! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function successUpdate() {
    setResponse(`Successfully updated ID: '${ID}' room to '${name}'!`);
    setVariant("success");
    setName("");
    setGameID("");
    setIsPrivate("");
    setID("");
    setShowResponse(true);
    setIDError("");
  }

  function errorUpdate(error) {
    if (error === "This room does not exist!") {
      setIDError("warning");
    }
    setResponse(`Room ID: '${ID}' was not updated! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function successDelete(id) {
    if (id) {
      setResponse(`Room ID: '${id}' was successfully deleted!`);
    } else {
      setResponse(`Room ID: '${ID}' was successfully deleted!`);
    }
    setVariant("success");
    setName("");
    setGameID("");
    setIsPrivate("");
    setID("");
    setShowResponse(true);
    setIDError("");
  }

  function errorDelete(id) {
    if (id) {
      setResponse(
        `Room ID: '${id}' was not deleted! This room does not exist!`
      );
      setIDError("warning");
    } else {
      setResponse(
        `Room ID: '${ID}' was not deleted! This room does not exist!`
      );
      setIDError("warning");
    }
    setVariant("danger");
    setShowResponse(true);
  }

  function convertToBoolean(value) {
    if (value === "true") {
      setIsPrivate(true);
    } else if (value === "false") {
      setIsPrivate(false);
    }
  }

  function handleSubmit() {
    switch (submitEvent) {
      case "Add":
        createRoom({
          variables: {
            game: gameID,
            isPrivate: isPrivate,
            name: name,
          },
          refetchQueries: [{ query: ROOMS }],
        })
          .then(() => successAdd())
          .catch((error) => errorAdd(error.message));
        break;

      case "Update":
        updateRoom({
          variables: {
            id: ID,
            name: name,
            isPrivate: isPrivate,
            gameID: gameID,
          },
          refetchQueries: [{ query: ROOMS }],
        })
          .then(() => successUpdate())
          .catch((error) => errorUpdate(error.message));
        break;

      case "Delete":
        deleteRoom({
          variables: { id: ID },
          refetchQueries: [{ query: ROOMS }],
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
          <Form.Label className="title">Room</Form.Label>
        </div>

        <Form.Group controlId="formHorizontalRoomName">
          <Form.Label column>Room name</Form.Label>
          <Col>
            <Form.Control
              type="text"
              placeholder={namePlaceholder}
              value={name}
              onChange={(event) => {
                setShowResponse(false);
                setName(event.target.value);
              }}
              required={required}
              disabled={nameDisabled}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="formHorizontalGame">
          <Form.Label column>Room game</Form.Label>
          <Col>
            <Form.Control
              as="select"
              onChange={(event) => {
                setShowResponse(false);
                setGameID(event.target.value);
              }}
              value={gameID}
              required
              disabled={gameDisabled}
            >
              {gamesLoading && <option>Loading...</option>}
              {gamesError && <option>Error! {gamesError.message}</option>}
              <option value="">Choose one game...</option>
              {games.map((game, key) => {
                return (
                  <option key={key} value={game.id}>
                    {game.name}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group controlId="formHorizontalIsPrivate">
          <Form.Label column>Room is private</Form.Label>
          <Col>
            <Form.Control
              as="select"
              onChange={(event) => {
                setShowResponse(false);
                setIsPrivate(event.target.value);
                convertToBoolean(event.target.value);
              }}
              value={String(isPrivate)}
              required
              disabled={isPrivateDisabled}
            >
              <option value="">Choose...</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group controlId="formHorizontalID">
          <Form.Label column>Room ID</Form.Label>
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
                {submitEvent} room
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
                    setGameDisabled(false);
                    setIsPrivateDisabled(false);
                    setIDDisabled(true);
                    setNamePlaceholder("game name");
                    setIDPlaceholder("");
                    setID("");
                    setShowResponse(false);
                    setRequired(true);
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
                    setGameDisabled(false);
                    setIsPrivateDisabled(false);
                    setIDDisabled(false);
                    setNamePlaceholder("room name");
                    setIDPlaceholder("game id");
                    setShowResponse(false);
                    setRequired(false);
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
                    setGameDisabled(true);
                    setIsPrivateDisabled(true);
                    setIDDisabled(false);
                    setNamePlaceholder("");
                    setName("");
                    setIDPlaceholder("room id");
                    setGameID("");
                    setIsPrivate("");
                    setShowResponse(false);
                    setRequired(true);
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
              <Alert variant="info">Working...</Alert>
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
        roomsLoading={roomsLoading}
        roomsError={roomsError}
        roomsData={rooms}
        deleteRoom={deleteRoom}
        successDelete={successDelete}
        errorDelete={errorDelete}
        setShowResponse={setShowResponse}
        tableClick={tableClick}
      />
    </div>
  );
};
