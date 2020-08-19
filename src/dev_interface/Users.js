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

const ADD_USER = gql`
  mutation($userName: String!, $password: String!, $email: String!) {
    createUser(
      user: { userName: $userName, password: $password, email: $email }
    ) {
      userName
      password
      email
    }
  }
`;

const UPDATE_USER = gql`
  mutation($id: ID!, $userName: String!, $password: String!, $email: String!) {
    updateUser(
      id: $id
      user: { userName: $userName, password: $password, email: $email }
    ) {
      id
      userName
      password
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation($id: ID!) {
    deleteUser(id: $id)
  }
`;

const USERS = gql`
  {
    allUsers(limit: 0, page: 1) {
      users {
        id
        userName
        email
        stats
        room {
          name
        }
        slug
      }
    }
  }
`;

const ContentTable = (props) => {
  const {
    usersData,
    usersLoading,
    usersError,
    deleteUser,
    successDelete,
    errorDelete,
    setShowResponse,
    tableClick,
  } = props;

  if (usersLoading) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>User Email</th>
            <th>User Stat</th>
            <th>User Room</th>
            <th>User Slug</th>
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
            <td className="text-center">
              <i className="fas fa-spinner fa-spin" />
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }

  if (usersError) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>User Email</th>
            <th>User Stat</th>
            <th>User Room</th>
            <th>User Slug</th>
            <th className="text-center">Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">Error! {usersError.message}</tr>
        </tbody>
      </Table>
    );
  }

  function remove(id) {
    deleteUser({
      variables: { id: id },
      refetchQueries: [{ query: USERS }],
    })
      .then(() => successDelete(id))
      .catch(() => errorDelete(id));
  }

  return (
    <Table className="content-table" striped bordered hover size="sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>User Email</th>
          <th>User Stat</th>
          <th>User Room</th>
          <th>User Slug</th>
          <th className="text-center">Remove</th>
        </tr>
      </thead>
      <tbody>
        {usersData.map((user, key) => {
          let userRoomName;
          try {
            userRoomName = user.room.name;
          } catch (error_) {
            userRoomName = "null";
          }
          return (
            <tr
              onClick={() => tableClick(user.userName, user.email, user.id)}
              key={key}
            >
              <td className="column">{user.id}</td>
              <td className="column">{user.userName}</td>
              <td className="column">{user.email}</td>
              {user.stats === null ? (
                <td className="column">null</td>
              ) : (
                <td className="column">{user.stats}</td>
              )}
              <td className="column">{userRoomName}</td>
              <td className="column">{user.slug}</td>
              <td className="text-center">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    setShowResponse(false);
                    remove(user.id);
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

export const Users = () => {
  const [createUser, { loading: addLoading, error: addError }] = useMutation(
    ADD_USER
  );

  const [
    updateUser,
    { loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_USER);

  const [
    deleteUser,
    { loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_USER);

  const [usernameDisabled, setUsernameDisabled] = useState(false);
  const [passwordDisabled, setPasswordDisabled] = useState(false);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const [IDDisabled, setIDDisabled] = useState(true);
  const [submitEvent, setSubmitEvent] = useState("Add");
  const [variant, setVariant] = useState(String);
  const [response, setResponse] = useState(String);
  const [showResponse, setShowResponse] = useState(false);
  const [username, setUsername] = useState(String);
  const [password, setPassword] = useState(String);
  const [email, setEmail] = useState(String);
  const [ID, setID] = useState(String);
  const [usernamePlaceholder, setUsernamePlaceholder] = useState("username");
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("password");
  const [emailPlaceholder, setEmailPlaceholder] = useState("email@address.com");
  const [IDPlaceholder, setIDPlaceholder] = useState(String);
  const [usernameError, setUsernameError] = useState(String);
  const [emailError, setEmailError] = useState(String);
  const [IDError, setIDError] = useState(String);
  const [required, setRequired] = useState(true);
  const [users, setUsers] = useState([]);

  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery(USERS);

  useEffect(() => {
    if (usersData) setUsers(usersData.allUsers.users);
  }, [usersData]);

  function tableClick(_username, _email, _id) {
    if (submitEvent === "Delete") {
      setID(_id);
    } else if (submitEvent === "Update") {
      setUsername(_username);
      setEmail(_email);
      setID(_id);
    }
  }

  function successAdd() {
    setResponse(`Successfully added '${username}' user!`);
    setVariant("success");
    setUsername("");
    setPassword("");
    setEmail("");
    setID("");
    setShowResponse(true);
    setUsernameError("");
    setEmailError("");
  }

  function errorAdd(error) {
    if (error === "This username is exist!") {
      setUsernameError("warning");
    } else if (error === "This email is exist!") {
      setEmailError("warning");
    }
    setResponse(`User '${username}' was not added! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function successUpdate() {
    setResponse(`Successfully updated ID: '${ID}' user to '${username}'!`);
    setVariant("success");
    setUsername("");
    setPassword("");
    setEmail("");
    setID("");
    setShowResponse(true);
    setUsernameError("");
    setEmailError("");
    setIDError("");
  }

  function errorUpdate(error) {
    if (error === "This username is exist!") {
      setUsernameError("warning");
    } else if (error === "This email is exist!") {
      setEmailError("warning");
    } else if (error === "This user does not exist!") {
      setIDError("warning");
    }
    setResponse(`User ID: '${ID}' was not updated! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function successDelete(id) {
    if (id) {
      setResponse(`User ID: '${id}' was successfully deleted!`);
    } else {
      setResponse(`User ID: '${ID}' was successfully deleted!`);
    }
    setVariant("success");
    setUsername("");
    setPassword("");
    setEmail("");
    setID("");
    setShowResponse(true);
    setIDError("");
  }

  function errorDelete(id) {
    if (id) {
      setResponse(
        `User ID: '${id}' was not deleted! This user does not exist!`
      );
      setIDError("warning");
    } else {
      setResponse(
        `User ID: '${ID}' was not deleted! This user does not exist!`
      );
      setIDError("warning");
    }
    setVariant("danger");
    setShowResponse(true);
  }

  function handleSubmit() {
    switch (submitEvent) {
      case "Add":
        createUser({
          variables: { userName: username, password: password, email: email },
          refetchQueries: [{ query: USERS }],
        })
          .then(() => successAdd())
          .catch((error) => errorAdd(error.message));
        break;

      case "Update":
        updateUser({
          variables: {
            id: ID,
            userName: username,
            password: password,
            email: email,
          },
          refetchQueries: [{ query: USERS }],
        })
          .then(() => successUpdate())
          .catch((error) => errorUpdate(error.message));
        break;

      case "Delete":
        deleteUser({
          variables: { id: ID },
          refetchQueries: [{ query: USERS }],
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
    setUsernameError("");
    setEmailError("");
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
          <Form.Label className="title">User</Form.Label>
        </div>

        <Form.Group controlId="formHorizontalUsername">
          <Form.Label column>Username</Form.Label>
          <Col>
            <Form.Control
              type="text"
              placeholder={usernamePlaceholder}
              value={username}
              onChange={(event) => {
                setShowResponse(false);
                setUsername(event.target.value);
                setUsernameError("");
              }}
              required={required}
              id={usernameError}
              disabled={usernameDisabled}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="formHorizontalPassword">
          <Form.Label column>User password</Form.Label>
          <Col>
            <Form.Control
              type="password"
              placeholder={passwordPlaceholder}
              value={password}
              onChange={(event) => {
                setShowResponse(false);
                setPassword(event.target.value);
              }}
              required={required}
              disabled={passwordDisabled}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="formHorizontalEmail">
          <Form.Label column>User email</Form.Label>
          <Col>
            <Form.Control
              type="email"
              placeholder={emailPlaceholder}
              value={email}
              onChange={(event) => {
                setShowResponse(false);
                setEmail(event.target.value);
                setEmailError("");
              }}
              id={emailError}
              required={required}
              disabled={emailDisabled}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="formHorizontalUserID">
          <Form.Label column>User ID</Form.Label>
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
                {submitEvent} user
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
                    setUsernameDisabled(false);
                    setPasswordDisabled(false);
                    setEmailDisabled(false);
                    setIDDisabled(true);
                    setUsernamePlaceholder("username");
                    setPasswordPlaceholder("password");
                    setEmailPlaceholder("email@address.com");
                    setIDPlaceholder("");
                    setID("");
                    setShowResponse(false);
                    setUsernameError("");
                    setEmailError("");
                    setIDError("");
                    setRequired(true);
                  }}
                  className="dropdown-item"
                >
                  Add
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    setSubmitEvent("Update");
                    setUsernameDisabled(false);
                    setPasswordDisabled(false);
                    setEmailDisabled(false);
                    setIDDisabled(false);
                    setUsernamePlaceholder("username");
                    setPasswordPlaceholder("password");
                    setEmailPlaceholder("email@address.com");
                    setIDPlaceholder("user id");
                    setShowResponse(false);
                    setUsernameError("");
                    setEmailError("");
                    setIDError("");
                    setRequired(false);
                  }}
                  className="dropdown-item"
                >
                  Update
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    setSubmitEvent("Delete");
                    setUsernameDisabled(true);
                    setPasswordDisabled(true);
                    setEmailDisabled(true);
                    setIDDisabled(false);
                    setUsernamePlaceholder("");
                    setPasswordPlaceholder("");
                    setEmailPlaceholder("");
                    setIDPlaceholder("user id");
                    setUsername("");
                    setPassword("");
                    setEmail("");
                    setShowResponse(false);
                    setUsernameError("");
                    setEmailError("");
                    setIDError("");
                    setRequired(true);
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
        usersLoading={usersLoading}
        usersError={usersError}
        usersData={users}
        deleteUser={deleteUser}
        successDelete={successDelete}
        errorDelete={errorDelete}
        setShowResponse={setShowResponse}
        tableClick={tableClick}
      />
    </div>
  );
};
