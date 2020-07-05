import React from 'react';
import {render} from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import ClassNavbar from './Navbar';
import SideNavbar from './SideNavbar';
import ClassCarousel from './Carousel';
import Register from './Register';
import Login from './Login';
import * as serviceWorker from './serviceWorker';

render(
  <React.StrictMode>
    <ClassNavbar />
    {/* <SideNavbar /> */}
    <ClassCarousel />
    <Login />
    {/* <Register /> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
