import React, { Component } from 'react'
import { Carousel, Image } from 'react-bootstrap'

class ClassCarousel extends Component {
    render(){
        return(
            <Carousel>
                <Carousel.Item>
                    <Image
                    className="d-block w-100 h-100"
                    src="./img/fortnite.jpg"
                    alt="First slide"
                    />
                    <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <Image
                    className="d-block w-100 h-100"
                    src="./img/lol.jpg"
                    alt="Second slide"
                    />

                    <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <Image
                    className="d-block w-100 h-100"
                    src="./img/valorant.jpg"
                    alt="Third slide"
                    />

                    <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        );
    }
}

export default ClassCarousel;