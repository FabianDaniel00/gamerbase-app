import React, { Component } from "react";
import { Categories } from "./Categories";
import { Games } from "./Games";
import { Users } from "./Users";
import { Rooms } from "./Rooms";
import { Friendships } from "./Friendships";
import { Posts } from "./Posts";
import { PostLikes } from "./PostLikes";
import { Comments } from "./Comments";
import { CommentLikes } from "./CommentLikes";

class DevInterface extends Component {
  render() {
    return (
      <>
        <Categories />
        <Games />
        <Users />
        <Rooms />
        <Friendships />
        <Posts />
        <PostLikes />
        <Comments />
        <CommentLikes />
      </>
    );
  }
}

export default DevInterface;
