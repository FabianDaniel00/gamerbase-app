import React, { useState, useEffect } from "react";
import { Form, Col, Button, Alert, Table } from "react-bootstrap";
import { gql, useMutation, useQuery } from "@apollo/client";
import "../Form.scss";
import "./Table.scss";

const POST_LIKE = gql`
  mutation($likerID: Int!, $postID: Int!) {
    PostLike(postLike: { liker: $likerID, post: $postID }) {
      id
    }
  }
`;

const LIKES = gql`
  {
    allPostLikes(limit: 0, page: 1) {
      postLikes {
        id
        liker {
          id
          userName
        }
        post {
          id
          title
        }
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
    likesData,
    likesLoading,
    likesError,
    postLike,
    successLike,
    errorLike,
    setShowResponse,
    tableClick,
  } = props;

  if (likesLoading) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Liker</th>
            <th>Post Title</th>
            <th className="text-center">Like</th>
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
          </tr>
        </tbody>
      </Table>
    );
  }

  if (likesError) {
    return (
      <Table className="content-table" striped bordered hover size="sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Liker</th>
            <th>Post Title</th>
            <th className="text-center">Like</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">Error! {likesError.message}</tr>
        </tbody>
      </Table>
    );
  }

  function Like(likerID, postID) {
    postLike({
      variables: { likerID: likerID, postID: postID },
      refetchQueries: [{ query: LIKES }],
    })
      .then(() => successLike(postID))
      .catch((error) => errorLike(postID, error.message));
  }

  return (
    <Table className="content-table" striped bordered hover size="sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>Liker</th>
          <th>Post Title</th>
          <th className="text-center">Like</th>
        </tr>
      </thead>
      <tbody>
        {likesData.map((like, key) => {
          return (
            <tr
              onClick={() => tableClick(like.liker.id, like.post.id)}
              key={key}
            >
              <td className="column">{like.id}</td>
              <td className="column">{like.liker.userName}</td>
              <td className="column">
                {like.post.title} <i>(ID: {like.post.id})</i>
              </td>
              <td className="text-center">
                <i
                  onClick={() => {
                    setShowResponse(false);
                    Like(like.liker.id, like.post.id);
                  }}
                  id="like-button"
                  className="fas fa-thumbs-up"
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export const PostLikes = () => {
  const [
    postLike,
    { loading: postLikeLoading, error: postLikeError },
  ] = useMutation(POST_LIKE);

  const [variant, setVariant] = useState(String);
  const [response, setResponse] = useState(String);
  const [showResponse, setShowResponse] = useState(false);
  const [likerID, setLikerID] = useState(String);
  const [postID, setPostID] = useState(String);
  const [likes, setLikes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const {
    loading: likesLoading,
    error: likesError,
    data: likesData,
  } = useQuery(LIKES);

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
    if (likesData) setLikes(likesData.allPostLikes.postLikes);
    if (postsData) setPosts(postsData.allPosts.posts);
    if (usersData) setUsers(usersData.allUsers.users);
  }, [likesData, postsData, usersData]);

  function tableClick(_liker, _post) {
    setLikerID(_liker);
    setPostID(_post);
  }

  function successLike(id) {
    if (id) {
      setResponse(`Successfully liked ID: '${id}' post!`);
    } else {
      setResponse(`Successfully liked ID: '${postID}' post!`);
    }
    setVariant("success");
    setLikerID("");
    setPostID("");
    setShowResponse(true);
  }

  function errorLike(error) {
    setResponse(`Post ID: '${postID}' was not liked! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function errorLike_(id, error) {
    setResponse(`Post ID: '${id}' was not liked! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function handleSubmit() {
    postLike({
      variables: {
        likerID: likerID,
        postID: postID,
      },
      refetchQueries: [{ query: LIKES }],
    })
      .then(() => successLike())
      .catch((error) => errorLike(error.message));
    if (postLikeError) {
      errorLike(postLikeError.message);
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
          <Form.Label className="title">Post likes</Form.Label>
        </div>

        <Form.Group controlId="formHorizontalLiker">
          <Form.Label column>Liker</Form.Label>
          <Col>
            <Form.Control
              as="select"
              onChange={(event) => {
                setShowResponse(false);
                setLikerID(event.target.value);
              }}
              value={likerID}
              required
            >
              {usersLoading && <option>Loading...</option>}
              {usersError && <option>Error! {usersError.message}</option>}
              {usersData && <option value="">Choose one liker...</option>}
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

        <Form.Group controlId="formHorizontalPost_">
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

        <Form.Group>
          <Col>
            <Button variant="primary" type="submit" block>
              Like post
            </Button>
          </Col>
        </Form.Group>

        {postLikeLoading && (
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
        likesLoading={likesLoading}
        likesError={likesError}
        likesData={likes}
        postLike={postLike}
        successLike={successLike}
        errorLike={errorLike_}
        setShowResponse={setShowResponse}
        tableClick={tableClick}
      />
    </div>
  );
};
