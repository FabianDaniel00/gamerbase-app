import React, { useState, useEffect } from "react";
import { Form, Col, Button, Alert, Table } from "react-bootstrap";
import { gql, useMutation, useQuery } from "@apollo/client";
import "../Form.scss";
import "./Table.scss";

const COMMENT_LIKE = gql`
  mutation($likerID: Int!, $commentID: Int!) {
    CommentLike(postLike: { liker: $likerID, comment: $commentID }) {
      id
    }
  }
`;

const LIKES = gql`
  {
    allCommentLikes(limit: 0, page: 1) {
      commentLikes {
        id
        liker {
          id
          userName
        }
        comment {
          id
          content
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

const COMMENTS = gql`
  {
    allComments(limit: 0, page: 1) {
      comments {
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
    commentLike,
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
            <th>Comment</th>
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
            <th>Comment</th>
            <th className="text-center">Like</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">Error! {likesError.message}</tr>
        </tbody>
      </Table>
    );
  }

  function Like(likerID, commentID) {
    commentLike({
      variables: { likerID: likerID, commentID: commentID },
      refetchQueries: [{ query: LIKES }],
    })
      .then(() => successLike(commentID))
      .catch((error) => errorLike(commentID, error.message));
  }

  return (
    <Table className="content-table" striped bordered hover size="sm">
      <thead>
        <tr>
          <th>ID</th>
          <th>Liker</th>
          <th>Comment</th>
          <th className="text-center">Like</th>
        </tr>
      </thead>
      <tbody>
        {likesData.map((like, key) => {
          return (
            <tr
              onClick={() => tableClick(like.liker.id, like.comment.id)}
              key={key}
            >
              <td className="column">{like.id}</td>
              <td className="column">{like.liker.userName}</td>
              <td className="column">
                {like.comment.content} <i>(ID: {like.comment.id})</i>
              </td>
              <td className="text-center">
                <i
                  onClick={() => {
                    setShowResponse(false);
                    Like(like.liker.id, like.comment.id);
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

export const CommentLikes = () => {
  const [
    commentLike,
    { loading: commentLikeLoading, error: commentLikeError },
  ] = useMutation(COMMENT_LIKE);

  const [variant, setVariant] = useState(String);
  const [response, setResponse] = useState(String);
  const [showResponse, setShowResponse] = useState(false);
  const [likerID, setLikerID] = useState(String);
  const [commentID, setCommentID] = useState(String);
  const [likes, setLikes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const {
    loading: likesLoading,
    error: likesError,
    data: likesData,
  } = useQuery(LIKES);

  const {
    loading: commentsLoading,
    error: commentsError,
    data: commentsData,
  } = useQuery(COMMENTS);

  const {
    loading: usersLoading,
    error: usersError,
    data: usersData,
  } = useQuery(USERS);

  useEffect(() => {
    if (likesData) setLikes(likesData.allPostLikes.postLikes);
    if (commentsData) setPosts(commentsData.allComments.comments);
    if (usersData) setUsers(usersData.allUsers.users);
  }, [likesData, commentsData, usersData]);

  function tableClick(_liker, _post) {
    setLikerID(_liker);
    setCommentID(_post);
  }

  function successLike(id) {
    if (id) {
      setResponse(`Successfully liked ID: '${id}' post!`);
    } else {
      setResponse(`Successfully liked ID: '${commentID}' post!`);
    }
    setVariant("success");
    setLikerID("");
    setCommentID("");
    setShowResponse(true);
  }

  function errorLike(error) {
    setResponse(`Post ID: '${commentID}' was not liked! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function errorLike_(id, error) {
    setResponse(`Post ID: '${id}' was not liked! ${error}`);
    setVariant("danger");
    setShowResponse(true);
  }

  function handleSubmit() {
    commentLike({
      variables: {
        likerID: likerID,
        postID: commentID,
      },
      refetchQueries: [{ query: LIKES }],
    })
      .then(() => successLike())
      .catch((error) => errorLike(error.message));
    if (commentLikeError) {
      errorLike(commentLikeError.message);
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
          <Form.Label className="title">Comment likes</Form.Label>
        </div>

        <Form.Group controlId="formHorizontalLiker_">
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

        <Form.Group controlId="formHorizontalComment_">
          <Form.Label column>Comment</Form.Label>
          <Col>
            <Form.Control
              as="select"
              onChange={(event) => {
                setShowResponse(false);
                setCommentID(event.target.value);
              }}
              value={commentID}
              required
            >
              {commentsLoading && <option>Loading...</option>}
              {commentsError && <option>Error! {commentsError.message}</option>}
              {commentsData && <option value="">Choose one comment...</option>}
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
              Like comment
            </Button>
          </Col>
        </Form.Group>

        {commentLikeLoading && (
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
        commentLike={commentLike}
        successLike={successLike}
        errorUpdate={errorLike_}
        setShowResponse={setShowResponse}
        tableClick={tableClick}
      />
    </div>
  );
};
