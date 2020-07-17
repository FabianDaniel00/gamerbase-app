import React, { Component } from "react";
import { Carousel, Image } from "react-bootstrap";
import "./Carousel.scss";

class ClassCarousel extends Component {
  render() {
    return (
      <Carousel className="back">
        <Carousel.Item>
          <Image
            className="d-block w-100 h-100"
            src={require("../img/fortnite.jpg")}
            alt="First slide"
          />
        </Carousel.Item>

        <Carousel.Item>
          <Image
            className="d-block w-100 h-100"
            src={require("../img/valorant.jpg")}
            alt="Second slide"
          />
        </Carousel.Item>

        <Carousel.Item>
          <Image
            className="d-block w-100 h-100"
            src={require("../img/lol.jpg")}
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
    );
  }
}

export default ClassCarousel;
