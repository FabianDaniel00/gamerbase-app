import React, { Component } from 'react';
import './App.scss';
import ClassNavbar from './Navbar';
import Sidebar from './Sidebar';
import ClassCarousel from './Carousel';
import Login from './Login';

class App extends Component {
    render(){
        return(
            <div>
                <ClassNavbar />
                <Sidebar />
                <ClassCarousel />
                <Login />
            </div>
        );
    }
}

export default App;
