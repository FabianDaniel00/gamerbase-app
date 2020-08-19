import React from "react";
import "./Home.scss";

export const Home = (props) => {
  const { userData } = props;
  return (
    <div className="home">
      <h1 className="title">Home Page</h1>
      <h2 className="title">username: {userData.userName}</h2>
      <h2 className="title">id: {userData.id}</h2>
    </div>
  );
};
