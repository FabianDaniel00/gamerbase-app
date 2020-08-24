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

const ADD_POST = gql`
  mutation($posterID: Int!, $content: String!, $title: String!) {
    createPost(post: { poster: $posterID, content: $content, title: $title }) {
      poster {
        id
      }
      title
      content
    }
  }
`;

const UPDATE_POST = gql`
  mutation($id: ID!, $posterID: ID!, $content: String!, $title: String!) {
    updatePost(
      id: $id
      editor: $posterID
      post: { content: $content, title: $title }
    ) {
      id
      content
      title
    }
  }
`;

const DELETE_POST = gql`
  mutation($id: ID!, $posterID: ID!) {
    deletePost(id: $id, editor: $posterID)
  }
`;

const POSTS = gql`
  {
    allPosts(limit: 0, page: 1) {
      posts {
        id
        poster {
          id
          userName
        }
        title
        content
        likes
        comments
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
    postsData,
    postsLoading,
    postsError,
    deletePost,
    successDelete,
    errorDelete,
    setShowResponse,
    tableClick,
  } = props;

  if (postsLoading) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Poster</th>
            <th>title</th>
            <th>Content</th>
            <th>Comments</th>
            <th>Likes</th>
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

  if (postsError) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Poster</th>
            <th>title</th>
            <th>Content</th>
            <th>Comments</th>
            <th>Likes</th>
            <th className="text-center">Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">Error! {postsError.message}</tr>
        </tbody>
      </Table>
    );
  }

  function remove(id, posterID) {
    deletePost({
      variables: { id: id, posterID: posterID },
      refetchQueries: [{ query: POSTS }],
    })
      .then(() => successDelete(id))
      .catch((error) => errorDelete(id, error.message));
  }

  return (
    <Table className="content-table" striped bordered hover size="sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>Poster</th>
          <th>title</th>
          <th>Content</th>
          <th>Comments</th>
          <th>Likes</th>
          <th className="text-center">Remove</th>
        </tr>
      </thead>
      <tbody>
        {postsData.map((post, key) => {
          return (
            <tr
              onClick={() =>
                tableClick(post.poster.id, post.title, post.content, post.id)
              }
              key={key}
            >
              <td className="column">{post.id}</td>
              <td className="column">{post.poster.userName}</td>
              <td className="column">{post.title}</td>
              <td className="column">{post.content}</td>
              <td className="column">{post.likes}</td>
              <td className="column">{post.comments}</td>
              <td className="text-center">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    setShowResponse(false);
                    remove(post.id, post.poster.id);
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

export const Posts = () => {
  const [createPost, { loading: addLoading, error: addError }] = useMutation(
    ADD_POST
  );

  const [
    updatePost,
    { loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_POST);

  const [
    deletePost,
    { loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_POST);

  const [posterIDDisabled, setPosterIDDisabled] = useState(false);
  const [titleDisabled, setTitleDisabled] = useState(false);
  const [contentDisabled, setContentDisabled] = useState(false);
  const [IDDisabled, setIDDisabled] = useState(true);
  const [submitEvent, setSubmitEvent] = useState("Add");
  const [variant, setVariant] = useState(String);
  const [response, setResponse] = useState(String);
  const [showResponse, setShowResponse] = useState(false);
  const [posterID, setPosterID] = useState(String);
  const [title, setTitle] = useState(String);
  const [content, setContent] = useState(String);
  const [ID, setID] = useState(String);
  const [titlePlaceholder, setTitlePlaceholder] = useState("title...");
  const [contentPlaceholder, setContentPlaceholder] = useState("content...");
  const [IDPlaceholder, setIDPlaceholder] = useState(String);
  const [IDError, setIDError] = useState(String);
  const [posterError, setPosterError] = useState(String);
  const [required, setRequired] = useState(true);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const {
    loading: postsLoading,
    error: postsError,
    data: postsData,
  } = useQuery(POSTS);

  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery(USERS);

  useEffect(() => {
    if (postsData) setPosts(postsData.allPosts.posts);
    if (usersData) setUsers(usersData.allUsers.users);
  }, [postsData, usersData]);

  function tableClick(_poster, _title, _content, _id) {
    if (submitEvent === "Update") {
      setPosterID(_poster);
      setTitle(_title);
      setContent(_content);
      setID(_id);
    } else if (submitEvent === "Delete") {
      setID(_id);
      setPosterID(_poster);
    }
  }

  function successAdd() {
    setResponse(`Successfully added '${title}' post!`);
    setVariant("success");
    setPosterID("");
    setTitle("");
    setContent("");
    setID("");
    setShowResponse(true);
    setPosterError("");
  }

  function errorAdd(error) {
    setResponse(`Post '${title}' was not added! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function successUpdate() {
    setResponse(`Successfully updated ID: '${ID}' post to '${title}'!`);
    setVariant("success");
    setPosterID("");
    setTitle("");
    setContent("");
    setID("");
    setShowResponse(true);
    setPosterError("");
    setIDError("");
  }

  function errorUpdate(error) {
    if (error === "This post is not yours!") {
      setPosterError("warning");
    } else if (error === "This post does not exist!") {
      setIDError("warning");
    }
    setResponse(`Post ID: '${ID}' was not updated! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function successDelete(id) {
    if (id) {
      setResponse(`Post ID: '${id}' was successfully deleted!`);
    } else {
      setResponse(`Post ID: '${ID}' was successfully deleted!`);
    }
    setVariant("success");
    setPosterID("");
    setTitle("");
    setContent("");
    setID("");
    setShowResponse(true);
    setIDError("");
    setPosterError("");
  }

  function errorDelete(error) {
    if (error === "This post is not yours!") {
      setPosterError("warning");
    } else if (error === "This post does not exist") {
      setIDError("warning");
    }
    setResponse(`Post ID: '${ID}' was not deleted! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function errorDelete_(id, error) {
    setResponse(`Post ID: '${id}' was not deleted! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function handleSubmit() {
    switch (submitEvent) {
      case "Add":
        createPost({
          variables: { posterID: posterID, title: title, content: content },
          refetchQueries: [{ query: POSTS }],
        })
          .then(() => successAdd())
          .catch((error) => errorAdd(error.message));
        break;

      case "Update":
        updatePost({
          variables: {
            id: ID,
            posterID: posterID,
            title: title,
            content: content,
          },
          refetchQueries: [{ query: POSTS }],
        })
          .then(() => successUpdate())
          .catch((error) => errorUpdate(error.message));
        break;

      case "Delete":
        deletePost({
          variables: { id: ID, posterID: posterID },
          refetchQueries: [{ query: POSTS }],
        })
          .then(() => successDelete())
          .catch((error) => errorDelete(error.message));
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
    setIDError("");
    setPosterError("");
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
          <Form.Label className="title">Post</Form.Label>
        </div>

        <Form.Group controlId="formHorizontalPoster">
          <Form.Label column>Poster</Form.Label>
          <Col>
            <Form.Control
              as="select"
              onChange={(event) => {
                setShowResponse(false);
                setPosterID(event.target.value);
                setPosterError("");
              }}
              value={posterID}
              id={posterError}
              required
              disabled={posterIDDisabled}
            >
              {usersLoading && <option>Loading...</option>}
              {usersError && <option>Error! {usersError.message}</option>}
              {usersData && <option value="">Choose one poster...</option>}
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

        <Form.Group controlId="formHorizontalTitle">
          <Form.Label column>Post title</Form.Label>
          <Col>
            <Form.Control
              type="text"
              placeholder={titlePlaceholder}
              value={title}
              onChange={(event) => {
                setShowResponse(false);
                setTitle(event.target.value);
              }}
              required={required}
              disabled={titleDisabled}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="formHorizontalContent">
          <Form.Label column>Post Content</Form.Label>
          <Col>
            <Form.Control
              type="textarea"
              placeholder={contentPlaceholder}
              value={content}
              onChange={(event) => {
                setShowResponse(false);
                setContent(event.target.value);
              }}
              required={required}
              disabled={contentDisabled}
            />
          </Col>
        </Form.Group>

        <Form.Group controlId="formHorizontalPostID">
          <Form.Label column>Post ID</Form.Label>
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
                {submitEvent} post
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
                    setPosterIDDisabled(false);
                    setTitleDisabled(false);
                    setContentDisabled(false);
                    setIDDisabled(true);
                    setTitlePlaceholder("title...");
                    setContentPlaceholder("content...");
                    setIDPlaceholder("");
                    setID("");
                    setShowResponse(false);
                    setRequired(true);
                    setPosterError("");
                    setIDError("");
                  }}
                  className="dropdown-item"
                >
                  Add
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    setSubmitEvent("Update");
                    setPosterIDDisabled(false);
                    setTitleDisabled(false);
                    setContentDisabled(false);
                    setIDDisabled(false);
                    setTitlePlaceholder("title...");
                    setContentPlaceholder("content...");
                    setIDPlaceholder("game id");
                    setShowResponse(false);
                    setRequired(false);
                    setPosterError("");
                    setIDError("");
                  }}
                  className="dropdown-item"
                >
                  Update
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    setSubmitEvent("Delete");
                    setPosterIDDisabled(false);
                    setTitleDisabled(true);
                    setContentDisabled(true);
                    setIDDisabled(false);
                    setTitlePlaceholder("");
                    setContentPlaceholder("");
                    setIDPlaceholder("game id");
                    setPosterID("");
                    setTitle("");
                    setContent("");
                    setShowResponse(false);
                    setRequired(true);
                    setPosterError("");
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
        postsLoading={postsLoading}
        postsError={postsError}
        postsData={posts}
        deletePost={deletePost}
        successDelete={successDelete}
        errorDelete={errorDelete_}
        setShowResponse={setShowResponse}
        tableClick={tableClick}
      />
    </div>
  );
};
