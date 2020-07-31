import React, { Component } from "react";
import { Categories } from "./Categories";
import { Games } from "./Games";

class DevInterface extends Component {
  render() {
    return (
      <>
        <Categories />
        <Games />
      </>
    );
  }
}

export default DevInterface;
