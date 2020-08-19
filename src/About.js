import React from "react";
import { Image } from "react-bootstrap";
import "./About.scss";

export const About = () => {
  return (
    <div className="about">
      <div className="relative">
        <div className="header">About us</div>
        <div className="top">
          <Image width="100%" src={require("./img/phonepicutres-TA.jpg")} />
        </div>
        <div className="content">
          &emsp;&emsp;Millions of people use MailChimp every day to create,
          send, and track email newsletters. That’s the clever part behind
          MailChimp’s About Page. It’s a great example of how to use such a page
          as a sort of pre-sales platform. It’s simple, fun and effective, quite
          colorful, and displays a welcoming mix of diverseness.
          <br />
          &emsp;&emsp;Millions of people use MailChimp every day to create,
          send, and track email newsletters. That’s the clever part behind
          MailChimp’s About Page. It’s a great example of how to use such a page
          as a sort of pre-sales platform. It’s simple, fun and effective, quite
          colorful, and displays a welcoming mix of diverseness.
          <br />
          &emsp;&emsp;Millions of people use MailChimp every day to create,
          send, and track email newsletters. That’s the clever part behind
          MailChimp’s About Page. It’s a great example of how to use such a page
          as a sort of pre-sales platform. It’s simple, fun and effective, quite
          colorful, and displays a welcoming mix of diverseness.
          <br />
          &emsp;&emsp;Millions of people use MailChimp every day to create,
          send, and track email newsletters. That’s the clever part behind
          MailChimp’s About Page. It’s a great example of how to use such a page
          as a sort of pre-sales platform. It’s simple, fun and effective, quite
          colorful, and displays a welcoming mix of diverseness.
          <br />
          &emsp;&emsp;Millions of people use MailChimp every day to create,
          send, and track email newsletters. That’s the clever part behind
          MailChimp’s About Page. It’s a great example of how to use such a page
          as a sort of pre-sales platform. It’s simple, fun and effective, quite
          colorful, and displays a welcoming mix of diverseness.
        </div>
      </div>
    </div>
  );
};
