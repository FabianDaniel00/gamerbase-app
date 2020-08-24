import React from "react";
import { Forum } from "./Forum";
import "./Home.scss";

export const Home = (props) => {
  const { userID } = props;
  return (
    <div className="home">
      <h1 className="title">Forum</h1>
      <Forum userID={userID} />
    </div>
  );
};
