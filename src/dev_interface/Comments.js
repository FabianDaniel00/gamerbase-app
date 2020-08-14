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

const ADD_COMMENT = gql`
  mutation($posterID: Int!, $postID: Int!, $content: String!) {
    createComment(
      comment: { poster: $posterID, post: $postID, content: $content }
    ) {
      poster {
        id
      }
      post {
        id
      }
      content
    }
  }
`;

const UPDATE_COMMENT = gql`
  mutation($id: ID!, $posterID: ID!, $content: String!) {
    updateComment(id: $id, editor: $posterID, comment: { content: $content }) {
      id
      content
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation($id: ID!, $posterID: ID!) {
    deleteComment(id: $id, editor: $posterID)
  }
`;

const COMMENTS = gql`
  {
    allComments(limit: 0, page: 1) {
      comments {
        id
        poster {
          id
          userName
        }
        post {
          id
          title
        }
        content
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

const POSTS = gql`
  {
    allPosts(limit: 0, page: 1) {
      posts {
        title
        id
      }
    }
  }
`;

const ContentTable = (props) => {
  const {
    commentsData,
    commentsLoading,
    commentsError,
    deleteComment,
    successDelete,
    errorDelete,
    setShowResponse,
    tableClick,
  } = props;

  if (commentsLoading) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Poster</th>
            <th>Post Title</th>
            <th>Content</th>
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

  if (commentsError) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Poster</th>
            <th>Post Title</th>
            <th>Content</th>
            <th className="text-center">Remove</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">Error! {commentsError.message}</tr>
        </tbody>
      </Table>
    );
  }

  function remove(id, posterID) {
    deleteComment({
      variables: { id: id, posterID: posterID },
      refetchQueries: [{ query: COMMENTS }],
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
          <th>Post Title</th>
          <th>Content</th>
          <th className="text-center">Remove</th>
        </tr>
      </thead>
      <tbody>
        {commentsData.map((comment, key) => {
          return (
            <tr
              onClick={() =>
                tableClick(
                  comment.poster.id,
                  comment.post.id,
                  comment.content,
                  comment.id
                )
              }
              key={key}
            >
              <td className="column">{comment.id}</td>
              <td className="column">{comment.poster.userName}</td>
              <td className="column">{comment.post.title}</td>
              <td className="column">{comment.content}</td>
              <td className="text-center">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => {
                    setShowResponse(false);
                    remove(comment.id, comment.poster.id);
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

export const Comments = () => {
  const [createComment, { loading: addLoading, error: addError }] = useMutation(
    ADD_COMMENT
  );

  const [
    updateComment,
    { loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_COMMENT);

  const [
    deleteComment,
    { loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_COMMENT);

  const [posterIDDisabled, setPosterIDDisabled] = useState(false);
  const [postDisabled, setPostDisabled] = useState(false);
  const [contentDisabled, setContentDisabled] = useState(false);
  const [IDDisabled, setIDDisabled] = useState(true);
  const [submitEvent, setSubmitEvent] = useState("Add");
  const [variant, setVariant] = useState(String);
  const [response, setResponse] = useState(String);
  const [showResponse, setShowResponse] = useState(false);
  const [posterID, setPosterID] = useState(String);
  const [postID, setPostID] = useState(String);
  const [content, setContent] = useState(String);
  const [ID, setID] = useState(String);
  const [contentPlaceholder, setContentPlaceholder] = useState("content...");
  const [IDPlaceholder, setIDPlaceholder] = useState(String);
  const [IDError, setIDError] = useState(String);
  const [posterError, setPosterError] = useState(String);
  const [required, setRequired] = useState(true);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const {
    loading: commentsLoading,
    error: commentsError,
    data: commentsData,
  } = useQuery(COMMENTS);

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
    if (commentsData) setComments(commentsData.allComments.comments);
    if (postsData) setPosts(postsData.allPosts.posts);
    if (usersData) setUsers(usersData.allUsers.users);
  }, [commentsData, postsData, usersData]);

  function tableClick(_poster, _post, _content, _id) {
    if (submitEvent === "Update") {
      setPosterID(_poster);
      setPostID(_post);
      setContent(_content);
      setID(_id);
    } else if (submitEvent === "Delete") {
      setID(_id);
      setPosterID(_poster);
    }
  }

  function successAdd() {
    setResponse(`Successfully added ID: '${ID}' comment!`);
    setVariant("success");
    setPosterID("");
    setPostID("");
    setContent("");
    setID("");
    setShowResponse(true);
    setPosterError("");
  }

  function errorAdd(error) {
    setResponse(`Comment ID: '${ID}' was not added! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function successUpdate() {
    setResponse(`Successfully updated ID: '${ID}' comment!`);
    setVariant("success");
    setPosterID("");
    setPostID("");
    setContent("");
    setID("");
    setShowResponse(true);
    setPosterError("");
    setIDError("");
  }

  function errorUpdate(error) {
    if (error === "This comment is not yours!") {
      setPosterError("warning");
    } else if (error === "This comment does not exist or it was removed!") {
      setIDError("warning");
    }
    setResponse(`Comment ID: '${ID}' was not updated! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function successDelete(id) {
    if (id) {
      setResponse(`Comment ID: '${id}' was successfully deleted!`);
    } else {
      setResponse(`Comment ID: '${ID}' was successfully deleted!`);
    }
    setVariant("success");
    setPosterID("");
    setPostID("");
    setContent("");
    setID("");
    setShowResponse(true);
    setIDError("");
    setPosterError("");
  }

  function errorDelete(error) {
    if (error === "This comment is not yours!") {
      setPosterError("warning");
    } else if (error === "This comment does not exist!") {
      setIDError("warning");
    }
    setResponse(`Comment ID: '${ID}' was not deleted! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function errorDelete_(id, error) {
    setResponse(`Comment ID: '${id}' was not deleted! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function handleSubmit() {
    switch (submitEvent) {
      case "Add":
        createComment({
          variables: { posterID: posterID, postID: postID, content: content },
          refetchQueries: [{ query: COMMENTS }],
        })
          .then(() => successAdd())
          .catch((error) => errorAdd(error.message));
        break;

      case "Update":
        updateComment({
          variables: {
            id: ID,
            posterID: posterID,
            content: content,
          },
          refetchQueries: [{ query: COMMENTS }],
        })
          .then(() => successUpdate())
          .catch((error) => errorUpdate(error.message));
        break;

      case "Delete":
        deleteComment({
          variables: { id: ID, posterID: posterID },
          refetchQueries: [{ query: COMMENTS }],
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
          <Form.Label className="title">Comment</Form.Label>
        </div>

        <Form.Group controlId="formHorizontalPoster_">
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

        <Form.Group controlId="formHorizontalPost">
          <Form.Label column>Post</Form.Label>
          <Col>
            <Form.Control
              as="select"
              onChange={(event) => {
                setShowResponse(false);
                setPostID(event.target.value);
              }}
              value={postID}
              required
              disabled={postDisabled}
            >
              {postsLoading && <option>Loading...</option>}
              {postsError && <option>Error! {postsError.message}</option>}
              {postsData && <option value="">Choose one post...</option>}
              {posts.map((post, key) => {
                return (
                  <option key={key} value={post.id}>
                    {post.title}
                  </option>
                );
              })}
            </Form.Control>
          </Col>
        </Form.Group>

        <Form.Group controlId="formHorizontalContent_">
          <Form.Label column>Comment Content</Form.Label>
          <Col>
            <Form.Control
              type="text"
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

        <Form.Group controlId="formHorizontalCommentID">
          <Form.Label column>Comment ID</Form.Label>
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
                {submitEvent} comment
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
                    setPostDisabled(false);
                    setContentDisabled(false);
                    setIDDisabled(true);
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
                    setPostDisabled(true);
                    setContentDisabled(false);
                    setIDDisabled(false);
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
                    setPostDisabled(true);
                    setContentDisabled(true);
                    setIDDisabled(false);
                    setContentPlaceholder("");
                    setIDPlaceholder("game id");
                    setPosterID("");
                    setPostID("");
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
        commentsLoading={commentsLoading}
        commentsError={commentsError}
        commentsData={comments}
        deleteComment={deleteComment}
        successDelete={successDelete}
        errorDelete={errorDelete_}
        setShowResponse={setShowResponse}
        tableClick={tableClick}
      />
    </div>
  );
};
