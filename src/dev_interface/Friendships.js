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

const ADD_FRIENDSHIP = gql`
  mutation($senderID: Int!, $reciverID: Int!) {
    createFriendship(friendship: { sender: $senderID, reciver: $reciverID }) {
      sender {
        id
      }
      reciver {
        id
      }
    }
  }
`;

const ACCEPT_FRIENDSHIP = gql`
  mutation($id: ID!) {
    acceptFriendship(id: $id) {
      id
    }
  }
`;

const DELETE_FRIENDSHIP = gql`
  mutation($id: ID!) {
    deleteFriendship(id: $id)
  }
`;

const FRIENDSHIPS = gql`
  {
    allFriendships(limit: 0, page: 1) {
      friendship {
        id
        sender {
          id
          userName
        }
        reciver {
          id
          userName
        }
        status
      }
    }
  }
`;

const USERS = gql`
  {
    allUsers(limit: 0, page: 1) {
      users {
        userName
        id
      }
    }
  }
`;

const ContentTable = (props) => {
  const {
    friendshipsData,
    friendshipsLoading,
    friendshipsError,
    deleteFriendship,
    acceptFriendship,
    successAccept,
    errorAccept,
    successDelete,
    errorDelete,
    setShowResponse,
    tableClick,
  } = props;

  if (friendshipsLoading) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sender</th>
            <th>Reciver</th>
            <th>Accepted</th>
            <th className="text-center">Accept</th>
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
            <td className="text-center">
              <i className="fas fa-spinner fa-spin" />
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }

  if (friendshipsError) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sender</th>
            <th>Reciver</th>
            <th>Accepted</th>
            <th className="text-center">Accept</th>
            <th className="text-center">Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">Error! {friendshipsError.message}</tr>
        </tbody>
      </Table>
    );
  }

  function remove(id) {
    deleteFriendship({
      variables: { id: id },
      refetchQueries: [{ query: FRIENDSHIPS }],
    })
      .then(() => successDelete(id))
      .catch(() => errorDelete(id));
  }

  function accept(id) {
    acceptFriendship({
      variables: { id: id },
      refetchQueries: [{ query: FRIENDSHIPS }],
    })
      .then(() => successAccept(id))
      .catch(() => errorAccept(id));
  }

  const IsAccepted = (props) => {
    const { status, friendshipID } = props;
    if (status === true) {
      return <td className="column">Accepted</td>;
    } else {
      return (
        <td className="text-center">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => {
              setShowResponse(false);
              accept(friendshipID);
            }}
          >
            Accept
          </Button>
        </td>
      );
    }
  };

  return (
    <Table className="content-table" striped bordered hover size="sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>Sender</th>
          <th>Reciver</th>
          <th>Accepted</th>
          <th className="text-center">Accept</th>
          <th className="text-center">Remove</th>
        </tr>
      </thead>
      <tbody>
        {friendshipsData.map((friendship, key) => {
          return (
            <tr onClick={() => tableClick(friendship.id)} key={key}>
              <td className="column">{friendship.id}</td>
              <td className="column">{friendship.sender.userName}</td>
              <td className="column">{friendship.reciver.userName}</td>
              <td className="column">
                {String(friendship.status).charAt(0).toUpperCase() +
                  String(friendship.status).slice(1)}
              </td>
              <IsAccepted
                status={friendship.status}
                friendshipID={friendship.id}
              />
              <td className="text-center">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    setShowResponse(false);
                    remove(friendship.id);
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

export const Friendships = () => {
  const [
    createFriendship,
    { loading: addLoading, error: addError },
  ] = useMutation(ADD_FRIENDSHIP);

  const [
    acceptFriendship,
    { loading: acceptLoading, error: acceptError },
  ] = useMutation(ACCEPT_FRIENDSHIP);

  const [
    deleteFriendship,
    { loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_FRIENDSHIP);

  const [senderDisabled, setSenderDisabled] = useState(false);
  const [reciverDisabled, setReciverDisabled] = useState(false);
  const [IDDisabled, setIDDisabled] = useState(true);
  const [submitEvent, setSubmitEvent] = useState("Create");
  const [variant, setVariant] = useState(String);
  const [response, setResponse] = useState(String);
  const [showResponse, setShowResponse] = useState(false);
  const [senderID, setSenderID] = useState(String);
  const [reciverID, setReciverID] = useState(String);
  const [ID, setID] = useState(String);
  const [IDPlaceholder, setIDPlaceholder] = useState(String);
  const [IDError, setIDError] = useState(String);
  const [SRError, setSRError] = useState(String);
  const [friendships, setFriendships] = useState([]);
  const [users, setUsers] = useState([]);

  const {
    loading: friendshipsLoading,
    error: friendshipsError,
    data: friendshipsData,
  } = useQuery(FRIENDSHIPS);

  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery(USERS);

  useEffect(() => {
    if (friendshipsData)
      setFriendships(friendshipsData.allFriendships.friendship);
    if (usersData) setUsers(usersData.allUsers.users);
  }, [friendshipsData, usersData]);

  function tableClick(_id) {
    if (submitEvent === "Accept" || submitEvent === "Delete") {
      setID(_id);
    }
  }

  function successAdd() {
    setResponse("Successfully created a friendsip!");
    setVariant("success");
    setSenderID("");
    setReciverID("");
    setID("");
    setShowResponse(true);
    setSRError("");
  }

  function errorAdd(error) {
    if (error === "You cannot send a friend request to yourself!") {
      setSRError("warning");
    } else if (
      error === "You are friends or this user sent a request to you!"
    ) {
      setSRError("warning");
    }
    setResponse(`Friendship was not created! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function successAccept(id) {
    setResponse(`Successfully accepted ID: '${id}' friendship!`);
    setVariant("success");
    setSenderID("");
    setReciverID("");
    setID("");
    setShowResponse(true);
    setIDError("");
  }

  function errorAccept(id) {
    setResponse(`Friendship ID: '${id}' was not accepted! Error!`);
    setVariant("danger");
    setShowResponse(true);
  }

  function successDelete(id) {
    if (id) {
      setResponse(`Friendship ID: '${id}' was successfully deleted!`);
    } else {
      setResponse(`Friendship ID: '${ID}' was successfully deleted!`);
    }
    setVariant("success");
    setSenderID("");
    setReciverID("");
    setID("");
    setShowResponse(true);
    setIDError("");
  }

  function errorDelete(id) {
    if (id) {
      setResponse(
        `Friendship ID: '${id}' was not deleted! This friendship does not exist!`
      );
      setIDError("warning");
    } else {
      setResponse(
        `Friendship ID: '${ID}' was not deleted! This friendship does not exist!`
      );
      setIDError("warning");
    }
    setVariant("danger");
    setShowResponse(true);
  }

  function handleSubmit() {
    switch (submitEvent) {
      case "Create":
        createFriendship({
          variables: {
            senderID: senderID,
            reciverID: reciverID,
          },
          refetchQueries: [{ query: FRIENDSHIPS }],
        })
          .then(() => successAdd())
          .catch((error) => errorAdd(error.message));
        break;

      case "Accept":
        acceptFriendship({
          variables: {
            id: ID,
          },
          refetchQueries: [{ query: FRIENDSHIPS }],
        })
          .then(() => successAccept())
          .catch((error) => errorAccept(error.message));
        break;

      case "Delete":
        deleteFriendship({
          variables: { id: ID },
          refetchQueries: [{ query: FRIENDSHIPS }],
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
    } else if (acceptError) {
      errorAccept(acceptError.message);
    } else if (deleteError) {
      errorDelete();
    }
    setSRError("");
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
          <Form.Label className="title">Friendship</Form.Label>
        </div>

        <Form.Group controlId="formHorizontalSender">
          <Form.Label column>Sender Name</Form.Label>
          <Col>
            <Form.Control
              as="select"
              onChange={(event) => {
                setShowResponse(false);
                setSenderID(event.target.value);
                setSRError("");
              }}
              value={senderID}
              id={SRError}
              required
              disabled={senderDisabled}
            >
              {usersLoading && <option>Loading...</option>}
              {usersError && <option>Error! {usersError.message}</option>}
              {usersData && <option value="">Sender...</option>}
              {users.map((user, key) => {
                return (
                  <option key={key} value={user.id}>
                    {user.userName}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group controlId="formHorizontalReciver">
          <Form.Label column>Reciver Name</Form.Label>
          <Col>
            <Form.Control
              as="select"
              onChange={(event) => {
                setShowResponse(false);
                setReciverID(event.target.value);
                setSRError("");
              }}
              value={reciverID}
              id={SRError}
              required
              disabled={reciverDisabled}
            >
              {usersLoading && <option>Loading...</option>}
              {usersError && <option>Error! {usersError.message}</option>}
              {usersData && <option value="">Reciver...</option>}
              {users.map((user, key) => {
                return (
                  <option key={key} value={user.id}>
                    {user.userName}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group controlId="formHorizontalFriendshipID">
          <Form.Label column>Friendship ID</Form.Label>
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
                {submitEvent} friendship
              </Button>

              <Dropdown.Toggle
                split
                variant="success"
                id="dropdown-split-basic"
              />

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setSubmitEvent("Create");
                    setSenderDisabled(false);
                    setReciverDisabled(false);
                    setIDDisabled(true);
                    setIDPlaceholder("");
                    setID("");
                    setShowResponse(false);
                    setIDError("");
                    setSRError("");
                  }}
                  className="dropdown-item"
                >
                  Create
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    setSubmitEvent("Accept");
                    setSenderDisabled(true);
                    setReciverDisabled(true);
                    setIDDisabled(false);
                    setIDPlaceholder("friendship id");
                    setSenderID("");
                    setReciverID("");
                    setShowResponse(false);
                    setIDError("");
                    setSRError("");
                  }}
                  className="dropdown-item"
                >
                  Accept
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    setSubmitEvent("Delete");
                    setSenderDisabled(true);
                    setReciverDisabled(true);
                    setIDDisabled(false);
                    setSenderID("");
                    setIDPlaceholder("friendship id");
                    setReciverID("");
                    setShowResponse(false);
                    setIDError("");
                    setSRError("");
                  }}
                  className="dropdown-item"
                >
                  Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Form.Group>

        {(addLoading || acceptLoading || deleteLoading) && (
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
        friendshipsLoading={friendshipsLoading}
        friendshipsError={friendshipsError}
        friendshipsData={friendships}
        deleteFriendship={deleteFriendship}
        acceptFriendship={acceptFriendship}
        successAccept={successAccept}
        errorAccept={errorAccept}
        successDelete={successDelete}
        errorDelete={errorDelete}
        setShowResponse={setShowResponse}
        tableClick={tableClick}
      />
    </div>
  );
};
