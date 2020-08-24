import React, { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import "./Forum.scss";

const POSTS = gql`
  {
    allPosts(limit: 0, page: 1) {
      posts {
        id
        poster {
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

const COMMENTS = gql`
  {
    allComments(limit: 0, page: 1) {
      comments {
        poster {
          userName
        }
        post {
          id
        }
        content
        likes
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
    }
  }
`;

export const Forum = ({ userID }) => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [postLikes, setPostLikes] = useState([]);

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

  useEffect(() => {
    if (postsData && commentsData && postLikesData) {
      setPosts(postsData.allPosts.posts);
      setComments(commentsData.allComments.comments);
      setPostLikes(postLikesData.allPostLikes.postLikes);
    }
  }, [postsData, commentsData, postLikesData]);

  const IsPostLiked = (props) => {
    console.log(postLikes);
    const { postID, postLikesCount } = props;
    for (const postLike in postLikes) {
      if (postLike.post === postID) {
        return (
          <div className="post-likes">
            <i
              onClick={() => likeAPost(postID)}
              className="fas fa-thumbs-up likes"
            />{" "}
            {postLikesCount}
          </div>
        );
      }
    }
    return (
      <div className="post-likes">
        <i
          onClick={() => likeAPost(postID)}
          className="far fa-thumbs-up likes"
        />{" "}
        {postLikesCount}
      </div>
    );
  };

  function likeAPost(postID) {
    postLike({
      variables: {
        likerID: userID,
        postID: postID,
      },
      refetchQueries: [{ query: POST_LIKES, query: POSTS }],
    }).catch(() => {});
    if (postLikeError) {
      //
    }
  }

  return (
    <>
      {postsLoading && (
        <p>
          Posts loading <i className="fas fa-spinner fa-spin" />
        </p>
      )}
      {postsError && (
        <p style="color: red">
          <i>[{postsError.message}]</i>
        </p>
      )}
      {posts.map((post, key) => {
        return (
          <div className="hole-post" key={key}>
            <div className="post">
              {post.poster.userName}:<h3>{post.title}</h3>
              &nbsp;&nbsp;&nbsp;&nbsp;{post.content}
              <div>
                <div className="comment-count">
                  <i>Comments: ({post.comments})</i>
                </div>
                <IsPostLiked postID={post.id} postLikesCount={post.likes} />
              </div>
            </div>
            <div className="comments">
              {commentsLoading && (
                <p>
                  Comments loading <i className="fas fa-spinner fa-spin" />
                </p>
              )}
              {commentsError && (
                <p style="color: red">
                  <i>[{commentsError.message}]</i>
                </p>
              )}
              {comments
                .filter((comment) => post.id === comment.post.id)
                .map((filteredComment, key) => {
                  return (
                    <div className="comment" key={key}>
                      {filteredComment.poster.userName}:
                      <div>
                        &nbsp;&nbsp;&nbsp;&nbsp;{filteredComment.content}
                        <div className="comment-likes">
                          <i className="far fa-thumbs-up likes" />{" "}
                          {filteredComment.likes}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </>
  );
};
