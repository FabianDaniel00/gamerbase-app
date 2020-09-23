import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { Button, Alert, Modal } from "react-bootstrap";
import { Link as ScrollLink } from "react-scroll";
import "./Forum.scss";

const POSTS = gql`
  query($limit: Int!) {
    allPosts(limit: $limit, page: 1, column: "-id") {
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
      total
    }
  }
`;

const COMMENTS = gql`
  query($post: Int!) {
    allComments(limit: 0, page: 1, post: $post) {
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
  const [postsLimit, setPostsLimit] = useState(5);
  const [postsLoading_, setPostsLoading_] = useState(Boolean);
  const [postCount, setPostCount] = useState(Number);
  const [posts, setPosts] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [comments, setComments] = useState([]);
  const [postLikes, setPostLikes] = useState([]);
  const [postLikesCount_, setPostLikesCount_] = useState(Number);
  const [postID, setPostID] = useState(Number);
  const [postTitle, setPostTitle] = useState(String);
  const [postContent, setPostContent] = useState(String);
  const [showPostAlert, setShowPostAlert] = useState(Boolean);
  const [showEditPostAlert, setShowEditPostAlert] = useState(Boolean);
  const [postAlertResponse, setPostAlertResponse] = useState(String);
  const [postAlertVariant, setPostAlertVariant] = useState(String);
  const [showNewPost, setShowNewPost] = useState(Boolean);
  const [commentLikes, setCommentLikes] = useState([]);
  const [commentLikesCount_, setCommentLikesCount_] = useState(Number);
  const [comment, setComment] = useState(String);
  const [showCommentAlert, setShowCommentAlert] = useState(Boolean);
  const [showEditCommentAlert, setShowEditCommentAlert] = useState(Boolean);
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
  const [editing, setEditing] = useState(Boolean);

  const [postLikeLoading, setPostLikeLoading] = useState(Boolean);
  const [commentLikeLoading, setCommentLikeLoading] = useState(Boolean);
  const [createPostLoading, setCreatePostLoading] = useState(Boolean);
  const [deletePostLoading, setDeletePostLoading] = useState(Boolean);
  const [updatePostLoading, setUpdatePostLoading] = useState(Boolean);
  const [deleteCommentLoading, setDeleteCommentLoading] = useState(Boolean);
  const [updateCommentLoading, setUpdateCommentLoading] = useState(Boolean);
  const [createCommentLoading, setCreateCommentLoading] = useState(Boolean);

  const {
    loading: postsLoading,
    error: postsError,
    data: postsData,
    refetch: refetchPosts,
  } = useQuery(POSTS, { variables: { limit: postsLimit } });

  const [
    getComments,
    { loading: commentsLoading, error: commentsError, data: commentsData },
  ] = useLazyQuery(COMMENTS);

  const {
    loading: postLikesLoading,
    error: postLikesError,
    data: postLikesData,
  } = useQuery(POST_LIKES, { variables: { liker: userID } });

  const [postLike, { error: postLikeError }] = useMutation(LIKE_A_POST);

  const {
    loading: commentLikesLoading,
    error: commentLikesError,
    data: commentLikesData,
  } = useQuery(COMMENT_LIKES, { variables: { liker: userID } });

  const [commentLike, { error: commentLikeError }] = useMutation(
    LIKE_A_COMMENT
  );

  const [createPost] = useMutation(CREATE_POST);
  const [updatePost] = useMutation(UPDATE_POST);
  const [deletePost] = useMutation(DELETE_POST);

  const [createComment] = useMutation(CREATE_COMMENT);
  const [updateComment] = useMutation(UPDATE_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);

  useEffect(() => {
    if (postsData && postLikesData) {
      setPosts(postsData.allPosts.posts);
      setPostLikes(postLikesData.allPostLikes.postLikes);
      setPostLikesCount_(postLikesData.allPostLikes.total);
      setPostCount(postsData.allPosts.total);
    }
  }, [postsData, postLikesData]);

  useEffect(() => {
    for (let i = 0; i < 5; i++) {
      setShowComments((showComments) => [
        ...showComments,
        { show: false, showed: false },
      ]);
    }
  }, [postsLimit]);

  useEffect(() => {
    if (commentLikesData) {
      setCommentLikes(commentLikesData.allCommentLikes.commentLikes);
      setCommentLikesCount_(commentLikesData.allCommentLikes.total);
    }
  }, [commentLikesData]);

  useEffect(() => {
    if (commentsData) {
      let comments_ = comments.filter((comment) => comment.post.id !== postID);
      setComments(comments_.concat(commentsData.allComments.comments));
    }
  }, [commentsData]);

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
                setPostLikeLoading(true);
                likeAPost(post_ID);
                setPostID(post_ID);
                setComment("");
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
              setPostLikeLoading(true);
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
              setPostLikeLoading(true);
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
        { query: POSTS, variables: { limit: postsLimit } },
        { query: POST_LIKES, variables: { liker: userID } },
      ],
    })
      .then(() => {
        setPostLikeLoading(false);
      })
      .catch(() => {
        setPostLikeLoading(false);
      });
  }

  function submitPost() {
    if (!postTitle || !postContent) {
      setPostAlertResponse("Title or content cannot be empty!");
      setPostAlertVariant("danger");
      setShowPostAlert(true);
      setCreatePostLoading(false);
    } else {
      createPost({
        variables: { posterID: userID, title: postTitle, content: postContent },
        refetchQueries: [{ query: POSTS, variables: { limit: postsLimit } }],
      })
        .then(() => {
          setCreatePostLoading(false);
          setPostAlertResponse("Post successfully submitted!");
          setPostAlertVariant("success");
          setPostTitle("");
          setPostContent("");
          setShowPostAlert(true);
        })
        .catch((error) => {
          setCreatePostLoading(false);
          setPostAlertResponse(
            `Post was not submitted! Error: ${error.message}`
          );
          setPostAlertVariant("danger");
          setShowPostAlert(true);
        });
    }
  }

  function submitPostEdit() {
    if (!postTitle || !postContent) {
      setShowEditPostAlert(true);
      setCreatePostLoading(false);
      setUpdatePostLoading(false);
    } else {
      updatePost({
        variables: {
          id: postID,
          posterID: userID,
          title: postTitle,
          content: postContent,
        },
        refetchQueries: [{ query: POSTS, variables: { limit: postsLimit } }],
      })
        .then(() => {
          setUpdatePostLoading(false);
          setPostTitle("");
          setPostContent("");
          setShowEditPostModal(false);
        })
        .catch((error) => {
          setUpdatePostLoading(false);
          setErrorMessage(
            `Something went wrong during editing the post! Error: ${error.message}`
          );
          setShowErrorModal(true);
        });
    }
  }

  function DeletePost() {
    deletePost({
      variables: { id: postID, posterID: userID },
      refetchQueries: [{ query: POSTS, variables: { limit: postsLimit } }],
    })
      .then(() => {
        setDeletePostLoading(false);
      })
      .catch((error) => {
        setDeletePostLoading(false);
        setErrorMessage(
          `Something went wrong during deleteing the post! Error: ${error.message}`
        );
        setShowErrorModal(true);
      });
  }

  const IsCommentLiked = (props) => {
    const { comment_ID, commentLikesCount, post_ID } = props;

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
              setCommentLikeLoading(true);
              likeAComment(comment_ID, post_ID);
              setCommentID(comment_ID);
              setPostID(post_ID);
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
              setCommentLikeLoading(true);
              likeAComment(comment_ID, post_ID);
              setCommentID(comment_ID);
              setPostID(post_ID);
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
              setCommentLikeLoading(true);
              likeAComment(comment_ID, post_ID);
              setCommentID(comment_ID);
              setPostID(post_ID);
            }}
            className="far fa-thumbs-up likes"
          />{" "}
          {commentLikesCount}
        </div>
      );
    }
  };

  function likeAComment(comment_ID, post_ID) {
    commentLike({
      variables: {
        likerID: userID,
        commentID: comment_ID,
      },
      refetchQueries: [
        { query: COMMENTS, variables: { post: post_ID } },
        { query: COMMENT_LIKES, variables: { liker: userID } },
      ],
    })
      .then(() => {
        setCommentLikeLoading(false);
      })
      .catch(() => {
        setCommentLikeLoading(false);
      });
  }

  function submitComment(post_ID) {
    if (!comment) {
      setCommentAlertResponse("Comment cannot be empty!");
      setCommentAlertVariant("danger");
      setShowCommentAlert(true);
      setCreateCommentLoading(false);
    } else {
      createComment({
        variables: { posterID: userID, postID: post_ID, content: comment },
        refetchQueries: [
          { query: COMMENTS, variables: { post: post_ID } },
          { query: POSTS, variables: { limit: postsLimit } },
        ],
      })
        .then(() => {
          setCreateCommentLoading(false);
          setCommentAlertResponse("Comment successfully submitted!");
          setCommentAlertVariant("success");
          setComment("");
          setShowCommentAlert(true);
        })
        .catch((error) => {
          setCreateCommentLoading(false);
          setCommentAlertResponse(
            `Comment was not submitted! Error: ${error.message}`
          );
          setCommentAlertVariant("danger");
          setShowCommentAlert(true);
        });
    }
  }

  function submitCommentEdit() {
    if (!comment) {
      setShowEditCommentAlert(true);
      setCreateCommentLoading(false);
      setUpdateCommentLoading(false);
    } else {
      updateComment({
        variables: {
          id: commentID,
          posterID: userID,
          content: comment,
        },
        refetchQueries: [{ query: COMMENTS, variables: { post: postID } }],
      })
        .then(() => {
          setUpdateCommentLoading(false);
          setComment("");
          setShowEditCommentModal(false);
        })
        .catch((error) => {
          setUpdateCommentLoading(false);
          setErrorMessage(
            `Something went wrong during editing the comment! Error: ${error.message}`
          );
          setShowErrorModal(true);
        });
    }
  }

  function DeleteComment() {
    deleteComment({
      variables: { id: commentID, posterID: userID },
      refetchQueries: [
        { query: COMMENTS, variables: { post: postID } },
        { query: POSTS, variables: { limit: postsLimit } },
      ],
    })
      .then(() => {
        setDeleteCommentLoading(false);
      })
      .catch((error) => {
        setDeleteCommentLoading(false);
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
              setShowEditPostAlert(false);
              setPostTitle(event.target.value);
            }}
            onClick={() => {
              setShowPostAlert(false);
              setShowEditPostAlert(false);
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
          {showEditPostAlert && (
            <Alert className="post-alert" variant="danger">
              Title or content cannot be empty!
            </Alert>
          )}
          <Button variant="info" onClick={() => setShowEditPostModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setUpdatePostLoading(true);
              submitPostEdit();
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
              setShowEditCommentAlert(false);
              setComment(event.target.value);
            }}
            onClick={() => {
              setShowEditCommentAlert(false);
            }}
            value={comment}
            className="comment-modaltextarea"
          />
        </Modal.Body>
        <Modal.Footer>
          {showEditCommentAlert && (
            <Alert className="post-alert" variant="danger">
              Content cannot be empty!
            </Alert>
          )}
          <Button variant="info" onClick={() => setShowEditCommentModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setUpdateCommentLoading(true);
              submitCommentEdit();
            }}
          >
            Save Changes
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
              setDeletePostLoading(true);
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
              setDeleteCommentLoading(true);
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
            onClick={() => {
              setShowPostAlert(false);
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
            onClick={() => {
              setCreatePostLoading(true);
              submitPost();
            }}
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
      {posts.map((post, postKey) => {
        return (
          <div id={`post${postKey}`} className="hole-post" key={postKey}>
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
              <h3 className="posttitle">{post.title}</h3>
              <div className="postcontent">{post.content}</div>
              <div>
                <div className="comment-count">
                  <i className="commentslabel">Comments: ({post.comments})</i>
                </div>
                <IsPostLiked post_ID={post.id} postLikesCount={post.likes} />
              </div>
            </div>
            <div className="comments">
              {commentsLoading && postID === post.id && (
                <p className="comments-loading">
                  Loading comments <i className="fas fa-spinner fa-spin" />
                </p>
              )}
              {commentsError && postID === post.id && (
                <p className="error">
                  <i>[{commentsError.message}]</i>
                </p>
              )}
              {showComments[postKey].show ? (
                <>
                  {!commentsLoading && (
                    <div
                      onClick={() => {
                        let showComments_ = [...showComments];
                        showComments_[postKey].show = false;
                        setShowComments(showComments_);
                      }}
                      className="show-comments"
                    >
                      Hide comments <i className="fas fa-arrow-circle-up" />
                    </div>
                  )}
                  {comments
                    .filter((comment) => post.id === comment.post.id)
                    .map((filteredComment, commentKey) => {
                      return (
                        <>
                          {commentKey % 10 === 0 && commentKey !== 0 && (
                            <ScrollLink
                              to={`post${postKey}`}
                              smooth={true}
                              duration={500}
                              className="up-to-post"
                              style={{
                                color: "#d9d9d9",
                                display: "grid",
                                textAlign: "center",
                                marginTop: "5px",
                              }}
                            >
                              Up to the post
                              <i className="fas fa-arrow-circle-up" />
                            </ScrollLink>
                          )}
                          <div className="comment" key={commentKey}>
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
                                        setPostID(post.id);
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
                                        setPostID(post.id);
                                        setComment(filteredComment.content);
                                        setShowEditCommentModal(true);
                                        setEditing(true);
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
                            {filteredComment.updated ===
                            filteredComment.created ? (
                              <div className="date-comment">
                                Created at {filteredComment.created}
                              </div>
                            ) : (
                              <div className="date-comment">
                                Edited at {filteredComment.updated}
                              </div>
                            )}
                            <div>
                              <div className="comment-content">
                                {filteredComment.content}
                              </div>
                              <IsCommentLiked
                                comment_ID={filteredComment.id}
                                commentLikesCount={filteredComment.likes}
                                post_ID={post.id}
                              />
                            </div>
                          </div>
                        </>
                      );
                    })}
                  {post.comments > 5 && !commentsLoading && (
                    <ScrollLink
                      onClick={() => {
                        let showComments_ = [...showComments];
                        showComments_[postKey].show = false;
                        setShowComments(showComments_);
                      }}
                      to={`post${postKey}`}
                      smooth={true}
                      duration={500}
                      className="unshow-comments"
                      style={{
                        color: "#d9d9d9",
                        display: "grid",
                        textAlign: "center",
                        marginTop: "5px",
                      }}
                    >
                      Hide comments
                      <i className="fas fa-arrow-circle-up" />
                    </ScrollLink>
                  )}
                </>
              ) : post.comments !== 0 ? (
                <>
                  {!commentsLoading && (
                    <div
                      onClick={() => {
                        setPostID(post.id);
                        let showComments_ = [...showComments];
                        if (!showComments[postKey].showed) {
                          showComments_[postKey].showed = true;
                          getComments({ variables: { post: post.id } });
                        }
                        showComments_[postKey].show = true;
                        setShowComments(showComments_);
                      }}
                      className="show-comments"
                    >
                      Show Comments <i className="fas fa-arrow-circle-down" />
                    </div>
                  )}
                </>
              ) : (
                <div className="no-comment">There is no comment!</div>
              )}

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
                    setEditing(false);
                    setComment("");
                    setPostID(post.id);
                    setShowCommentAlert(false);
                  }}
                  value={post.id === postID && !editing ? comment : ""}
                  className="comment-textarea"
                />

                <Button
                  onClick={() => {
                    setPostID(post.id);
                    setCreateCommentLoading(true);
                    submitComment(post.id);
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
      {postsLoading_ ? (
        <div className="loading">
          <i className="fas fa-spinner fa-spin" />
        </div>
      ) : (
        postCount > postsLimit && (
          <div
            onClick={() => {
              setPostsLoading_(true);
              setPostsLimit(postsLimit + 5);
              refetchPosts().then(() => setPostsLoading_(false));
            }}
            className="load-more-post"
          >
            Load more <i className="far fa-plus-square" />
          </div>
        )
      )}
    </>
  );
};
