import React, { Component } from "react";
import { Categories } from "./Categories";
import { Games } from "./Games";
import { Users } from "./Users";
import { Rooms } from "./Rooms";
import { Friendships } from "./Friendships";
import { Posts } from "./Posts";

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
      </>
    );
  }
}

export default DevInterface;
