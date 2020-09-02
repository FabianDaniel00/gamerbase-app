import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Button, Alert, Modal } from "react-bootstrap";
import "./Forum.scss";

const POSTS = gql`
  {
    allPosts(limit: 0, page: 1, column: "-id") {
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
        created
        updated
      }
    }
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
        }
        content
        likes
        created
        updated
      }
    }
  }
`;

const LIKE_A_POST = gql`
  mutation($likerID: Int!, $postID: Int!) {
    PostLike(postLike: { liker: $likerID, post: $postID }) {
      id
    }
  }
`;

const POST_LIKES = gql`
  query($liker: Int!) {
    allPostLikes(limit: 0, page: 1, liker: $liker) {
      postLikes {
        post {
          id
        }
      }
      total
    }
  }
`;

const CREATE_POST = gql`
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

const LIKE_A_COMMENT = gql`
  mutation($likerID: Int!, $commentID: Int!) {
    CommentLike(commentLike: { liker: $likerID, comment: $commentID }) {
      id
    }
  }
`;

const COMMENT_LIKES = gql`
  query($liker: Int!) {
    allCommentLikes(limit: 0, page: 1, liker: $liker) {
      commentLikes {
        comment {
          id
        }
      }
      total
    }
  }
`;

const CREATE_COMMENT = gql`
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

export const Forum = ({ userID }) => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [postLikes, setPostLikes] = useState([]);
  const [postLikesCount_, setPostLikesCount_] = useState(Number);
  const [postID, setPostID] = useState(Number);
  const [postTitle, setPostTitle] = useState(String);
  const [postContent, setPostContent] = useState(String);
  const [showPostAlert, setShowPostAlert] = useState(Boolean);
  const [postAlertResponse, setPostAlertResponse] = useState(String);
  const [postAlertVariant, setPostAlertVariant] = useState(String);
  const [showNewPost, setShowNewPost] = useState(Boolean);
  const [commentLikes, setCommentLikes] = useState([]);
  const [commentLikesCount_, setCommentLikesCount_] = useState(Number);
  const [comment, setComment] = useState(String);
  const [showCommentAlert, setShowCommentAlert] = useState(Boolean);
  const [commentAlertResponse, setCommentAlertResponse] = useState(String);
  const [commentAlertVariant, setCommentAlertVariant] = useState(String);
  const [errorMessage, setErrorMessage] = useState(String);
  const [showEditCommentModal, setShowEditCommentModal] = useState(Boolean);
  const [showEditPostModal, setShowEditPostModal] = useState(Boolean);
  const [showErrorModal, setShowErrorModal] = useState(Boolean);
  const [commentID, setCommentID] = useState(Number);
  const [showPostConfirmModal, setShowPostConfirmModal] = useState(Boolean);
  const [showCommentConfirmModal, setShowCommentConfirmModal] = useState(
    Boolean
  );

  const {
    loading: postsLoading,
    error: postsError,
    data: postsData,
  } = useQuery(POSTS);

  const {
    loading: commentsLoading,
    error: commentsError,
    data: commentsData,
  } = useQuery(COMMENTS);

  const {
    loading: postLikesLoading,
    error: postLikesError,
    data: postLikesData,
  } = useQuery(POST_LIKES, { variables: { liker: userID } });

  const [
    postLike,
    { loading: postLikeLoading, error: postLikeError },
  ] = useMutation(LIKE_A_POST);

  const {
    loading: commentLikesLoading,
    error: commentLikesError,
    data: commentLikesData,
  } = useQuery(COMMENT_LIKES, { variables: { liker: userID } });

  const [
    commentLike,
    { loading: commentLikeLoading, error: commentLikeError },
  ] = useMutation(LIKE_A_COMMENT);

  useEffect(() => {
    if (postsData && postLikesData) {
      setPosts(postsData.allPosts.posts);
      setPostLikes(postLikesData.allPostLikes.postLikes);
      setPostLikesCount_(postLikesData.allPostLikes.total);
    }
  }, [postsData, postLikesData]);

  useEffect(() => {
    if (commentsData && commentLikesData) {
      setComments(commentsData.allComments.comments);
      setCommentLikes(commentLikesData.allCommentLikes.commentLikes);
      setCommentLikesCount_(commentLikesData.allCommentLikes.total);
    }
  }, [commentsData, commentLikesData]);

  const [createPost, { loading: createPostLoading }] = useMutation(CREATE_POST);

  const [updatePost, { loading: updatePostLoading }] = useMutation(UPDATE_POST);

  const [deletePost, { loading: deletePostLoading }] = useMutation(DELETE_POST);

  const [createComment, { loading: createCommentLoading }] = useMutation(
    CREATE_COMMENT
  );

  const [updateComment, { loading: updateCommentLoading }] = useMutation(
    UPDATE_COMMENT
  );

  const [deleteComment, { loading: deleteCommentLoading }] = useMutation(
    DELETE_COMMENT
  );

  const IsPostLiked = (props) => {
    const { post_ID, postLikesCount } = props;

    let i = -1;
    let liked = false;

    while (i + 1 < postLikesCount_) {
      i++;
      if (postLikes[i].post.id === post_ID) {
        liked = true;
        break;
      }
    }

    if ((postLikeLoading && post_ID === postID) || postLikesLoading) {
      return (
        <div className="post-likes">
          <i className="fas fa-spinner fa-spin likes" /> {postLikesCount}
        </div>
      );
    }

    if ((postLikeError && post_ID === postID) || postLikesError) {
      return (
        <div className="post-likes">
          <i>
            <p
              onClick={() => {
                likeAPost(post_ID);
                setPostID(post_ID);
              }}
              className="error"
            >
              [Error! Retry!]
            </p>
          </i>{" "}
          {postLikesCount}
        </div>
      );
    }

    if (liked) {
      return (
        <div className="post-likes">
          <i
            onClick={() => {
              likeAPost(post_ID);
              setPostID(post_ID);
            }}
            className="fas fa-thumbs-up likes"
          />{" "}
          {postLikesCount}
        </div>
      );
    } else {
      return (
        <div className="post-likes">
          <i
            onClick={() => {
              likeAPost(post_ID);
              setPostID(post_ID);
            }}
            className="far fa-thumbs-up likes"
          />{" "}
          {postLikesCount}
        </div>
      );
    }
  };

  function likeAPost(post_ID) {
    postLike({
      variables: {
        likerID: userID,
        postID: post_ID,
      },
      refetchQueries: [
        { query: POSTS },
        { query: POST_LIKES, variables: { liker: userID } },
      ],
    }).catch(() => {});
  }

  function submitPost() {
    if (!postTitle || !postContent) {
      setPostAlertResponse("Title or content cannot be empty!");
      setPostAlertVariant("danger");
      setShowPostAlert(true);
    } else {
      createPost({
        variables: { posterID: userID, title: postTitle, content: postContent },
        refetchQueries: [{ query: POSTS }],
      })
        .then(() => {
          setPostAlertResponse("Post successfully submitted!");
          setPostAlertVariant("success");
          setPostTitle("");
          setPostContent("");
          setShowPostAlert(true);
        })
        .catch((error) => {
          setPostAlertResponse(
            `Post was not submitted! Error: ${error.message}`
          );
          setPostAlertVariant("danger");
          setShowPostAlert(true);
        });
    }
  }

  function submitPostEdit() {
    updatePost({
      variables: {
        id: postID,
        posterID: userID,
        title: postTitle,
        content: postContent,
      },
      refetchQueries: [{ query: POSTS }],
    })
      .then(() => {
        setPostTitle("");
        setPostContent("");
      })
      .catch((error) => {
        setErrorMessage(
          `Something went wrong during editing the post! Error: ${error.message}`
        );
        setShowErrorModal(true);
      });
  }

  function DeletePost() {
    deletePost({
      variables: { id: postID, posterID: userID },
      refetchQueries: [{ query: COMMENTS }, { query: POSTS }],
    }).catch((error) => {
      setErrorMessage(
        `Something went wrong during deleteing the post! Error: ${error.message}`
      );
      setShowErrorModal(true);
    });
  }

  const IsCommentLiked = (props) => {
    const { comment_ID, commentLikesCount } = props;

    let i = -1;
    let liked = false;

    while (i + 1 < commentLikesCount_) {
      i++;
      if (commentLikes[i].comment.id === comment_ID) {
        liked = true;
        break;
      }
    }

    if (
      (commentLikeLoading && comment_ID === commentID) ||
      commentLikesLoading
    ) {
      return (
        <div className="comment-likes">
          <i className="fas fa-spinner fa-spin likes" /> {commentLikesCount}
        </div>
      );
    }

    if ((commentLikeError && comment_ID === commentID) || commentLikesError) {
      return (
        <div className="comment-likes">
          <i
            onClick={() => {
              likeAComment(comment_ID);
              setCommentID(comment_ID);
            }}
            className="error"
          >
            [Error! Retry!]
          </i>{" "}
          {commentLikesCount}
        </div>
      );
    }

    if (liked) {
      return (
        <div className="comment-likes">
          <i
            onClick={() => {
              likeAComment(comment_ID);
              setCommentID(comment_ID);
            }}
            className="fas fa-thumbs-up likes"
          />{" "}
          {commentLikesCount}
        </div>
      );
    } else {
      return (
        <div className="comment-likes">
          <i
            onClick={() => {
              likeAComment(comment_ID);
              setCommentID(comment_ID);
            }}
            className="far fa-thumbs-up likes"
          />{" "}
          {commentLikesCount}
        </div>
      );
    }
  };

  function likeAComment(comment_ID) {
    commentLike({
      variables: {
        likerID: userID,
        commentID: comment_ID,
      },
      refetchQueries: [
        { query: COMMENTS },
        { query: COMMENT_LIKES, variables: { liker: userID } },
      ],
    }).catch(() => {});
  }

  function submitComment(post_ID) {
    if (!comment) {
      setCommentAlertResponse("Comment cannot be empty!");
      setCommentAlertVariant("danger");
      setShowCommentAlert(true);
    } else {
      createComment({
        variables: { posterID: userID, postID: post_ID, content: comment },
        refetchQueries: [{ query: COMMENTS }, { query: POSTS }],
      })
        .then(() => {
          setCommentAlertResponse("Comment successfully submitted!");
          setCommentAlertVariant("success");
          setComment("");
          setShowCommentAlert(true);
        })
        .catch((error) => {
          setCommentAlertResponse(
            `Comment was not submitted! Error: ${error.message}`
          );
          setCommentAlertVariant("danger");
          setShowCommentAlert(true);
        });
    }
  }

  function submitCommentEdit() {
    updateComment({
      variables: {
        id: commentID,
        posterID: userID,
        content: comment,
      },
      refetchQueries: [{ query: COMMENTS }],
    })
      .then(() => setComment(""))
      .catch((error) => {
        setErrorMessage(
          `Something went wrong during editing the comment! Error: ${error.message}`
        );
        setShowErrorModal(true);
      });
  }

  function DeleteComment() {
    deleteComment({
      variables: { id: commentID, posterID: userID },
      refetchQueries: [{ query: COMMENTS }, { query: POSTS }],
    }).catch((error) => {
      setErrorMessage(
        `Something went wrong during deleteing the comment! Error: ${error.message}`
      );
      setShowErrorModal(true);
    });
  }

  return (
    <>
      <Modal
        show={showEditPostModal}
        onHide={() => setShowEditPostModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editing post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Title:</label>
          <input
            type="text"
            onChange={(event) => {
              setShowPostAlert(false);
              setPostTitle(event.target.value);
            }}
            value={postTitle}
            className="post-modaltitle"
          />
          <label>Content:</label>
          <textarea
            onChange={(event) => {
              setShowPostAlert(false);
              setPostContent(event.target.value);
            }}
            value={postContent}
            className="post-modaltextarea"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={() => setShowEditPostModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              submitPostEdit();
              setShowEditPostModal(false);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showEditCommentModal}
        onHide={() => setShowEditCommentModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editing comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            onChange={(event) => {
              setShowCommentAlert(false);
              setComment(event.target.value);
            }}
            value={comment}
            className="comment-modaltextarea"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={() => setShowEditCommentModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              submitCommentEdit();
              setShowEditCommentModal(false);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error!</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={() => setShowErrorModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showPostConfirmModal}
        onHide={() => setShowPostConfirmModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              DeletePost();
              setShowPostConfirmModal(false);
            }}
          >
            Yes
          </Button>
          <Button variant="info" onClick={() => setShowPostConfirmModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showCommentConfirmModal}
        onHide={() => setShowCommentConfirmModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure want to delete this comment?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              DeleteComment();
              setShowCommentConfirmModal(false);
            }}
          >
            Yes
          </Button>
          <Button
            variant="info"
            onClick={() => setShowCommentConfirmModal(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showNewPost} onHide={() => setShowNewPost(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Title:</label>
          <input
            type="text"
            onChange={(event) => {
              setShowPostAlert(false);
              setPostTitle(event.target.value);
            }}
            value={postTitle}
            className="post-title"
          />
          <label>Content:</label>
          <textarea
            onChange={(event) => {
              setShowPostAlert(false);
              setPostContent(event.target.value);
            }}
            value={postContent}
            className="post-content"
          />
        </Modal.Body>
        <Modal.Footer>
          {showPostAlert && (
            <Alert className="post-alert" variant={postAlertVariant}>
              {postAlertResponse}
            </Alert>
          )}
          <Button
            variant="primary"
            className="post-button"
            onClick={() => submitPost()}
          >
            {createPostLoading ? (
              <i className="fas fa-spinner fa-spin" />
            ) : (
              "Create post"
            )}
          </Button>
          <Button variant="info" onClick={() => setShowNewPost(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="create-post">
        <Button
          onClick={() => setShowNewPost(true)}
          className="createpost-button"
          variant="outline-primary"
        >
          Create post
        </Button>
      </div>

      {postsLoading && (
        <p className="posts-loading">
          Posts loading <i className="fas fa-spinner fa-spin" />
        </p>
      )}
      {postsError && (
        <p className="error">
          <i>[{postsError.message}]</i>
        </p>
      )}
      {posts.map((post, key) => {
        return (
          <div className="hole-post" key={key}>
            <div className="post">
              {parseInt(post.poster.id) === userID ? (
                <>
                  <div>
                    {deletePostLoading && post.id === postID ? (
                      <i className="fas fa-spinner fa-spin remove-post" />
                    ) : (
                      <i
                        onClick={() => {
                          setPostID(post.id);
                          setShowPostConfirmModal(true);
                          setShowPostAlert(false);
                        }}
                        className="far fa-trash-alt remove-post"
                      />
                    )}
                    {updatePostLoading && post.id === postID ? (
                      <i className="fas fa-spinner fa-spin edit-post" />
                    ) : (
                      <i
                        onClick={() => {
                          setPostID(post.id);
                          setPostTitle(post.title);
                          setPostContent(post.content);
                          setShowEditPostModal(true);
                        }}
                        className="fas fa-pencil-alt edit-post"
                      />
                    )}
                  </div>
                  <b>
                    <i className="my-post">{post.poster.userName}:</i>
                  </b>
                </>
              ) : (
                <b>
                  <i className="post-writer">{post.poster.userName}:</i>
                </b>
              )}
              {post.updated === post.created ? (
                <div className="date-post">Created at {post.created}</div>
              ) : (
                <div className="date-post">Edited at {post.updated}</div>
              )}
              <h3>{post.title}</h3>
              <div className="postcontent">{post.content}</div>
              <div>
                <div className="comment-count">
                  <i className="commentslabel">Comments: ({post.comments})</i>
                </div>
                <IsPostLiked post_ID={post.id} postLikesCount={post.likes} />
              </div>
            </div>
            <div className="comments">
              {commentsLoading && (
                <p>
                  Comments loading <i className="fas fa-spinner fa-spin" />
                </p>
              )}
              {commentsError && (
                <p className="error">
                  <i>[{commentsError.message}]</i>
                </p>
              )}
              {comments
                .filter((comment) => post.id === comment.post.id)
                .map((filteredComment, key) => {
                  return (
                    <div className="comment" key={key}>
                      {parseInt(filteredComment.poster.id) === userID ? (
                        <>
                          <div>
                            {deleteCommentLoading &&
                            filteredComment.id === commentID ? (
                              <i className="fas fa-spinner fa-spin remove-comment" />
                            ) : (
                              <i
                                onClick={() => {
                                  setCommentID(filteredComment.id);
                                  setShowCommentConfirmModal(true);
                                  setShowCommentAlert(false);
                                }}
                                className="far fa-trash-alt remove-comment"
                              />
                            )}
                            {updateCommentLoading &&
                            filteredComment.id === commentID ? (
                              <i className="fas fa-spinner fa-spin edit-comment" />
                            ) : (
                              <i
                                onClick={() => {
                                  setCommentID(filteredComment.id);
                                  setComment(filteredComment.content);
                                  setShowEditCommentModal(true);
                                }}
                                className="fas fa-pencil-alt edit-comment"
                              />
                            )}
                          </div>
                          <b>
                            <i className="my-comment">
                              {filteredComment.poster.userName}:
                            </i>
                          </b>
                        </>
                      ) : (
                        <b>
                          <i>{filteredComment.poster.userName}:</i>
                        </b>
                      )}
                      {filteredComment.updated === filteredComment.created ? (
                        <div className="date-comment">
                          Created at {filteredComment.created}
                        </div>
                      ) : (
                        <div className="date-comment">
                          Edited at {filteredComment.updated}
                        </div>
                      )}
                      <div>
                        &nbsp;&nbsp;&nbsp;&nbsp;{filteredComment.content}
                        <IsCommentLiked
                          comment_ID={filteredComment.id}
                          commentLikesCount={filteredComment.likes}
                        />
                      </div>
                    </div>
                  );
                })}
              <div className="add-comment">
                <label className="comments-label">
                  <i>Comment:</i>
                </label>
                <textarea
                  onChange={(event) => {
                    setShowCommentAlert(false);
                    setComment(event.target.value);
                  }}
                  onClick={() => {
                    setComment("");
                    setPostID(post.id);
                  }}
                  value={post.id === postID ? comment : ""}
                  className="comment-textarea"
                />

                <Button
                  onClick={() => {
                    submitComment(post.id);
                    setPostID(post.id);
                  }}
                  className="comment-button"
                  variant="primary"
                >
                  {createCommentLoading && post.id === postID ? (
                    <i className="fas fa-spinner fa-spin" />
                  ) : (
                    "Submit comment"
                  )}
                </Button>

                {showCommentAlert && post.id === postID && (
                  <Alert
                    className="comment-alert"
                    variant={commentAlertVariant}
                  >
                    {commentAlertResponse}
                  </Alert>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
