import React, { Component } from "react";
import { Categories } from "./Categories";
import { Games } from "./Games";
import { Users } from "./Users";
import { Rooms } from "./Rooms";

class DevInterface extends Component {
  render() {
    return (
      <>
        <Categories />
        <Games />
        <Users />
        <Rooms />
      </>
    );
  }
}

export default DevInterface;
