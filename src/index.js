import React from 'react';
import {render} from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import ClassNavbar from './Navbar';
import ClassSidebar from './Sidebar';
import ClassCarousel from './Carousel';
import Register from './Register';
import Login from './Login';
import * as serviceWorker from './serviceWorker';

render(
  <React.StrictMode>
    <ClassNavbar />
    <ClassCarousel />
    <ClassSidebar />
    <Login />
    {/* <Register /> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
