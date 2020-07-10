import React, { Component } from 'react';
import './App.scss';
import NavigationBar from './components/NavigationBar';
import Sidebar from './components/Sidebar';
import ClassCarousel from './components/Carousel';
import Footer from './components/Footer';
import { Login } from './Login';
import { Register} from './Register';
import { Home } from './Home';
import { About } from './About';
import { NoMatch } from './NoMatch';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {
    render() {
        return(
            <React.Fragment>
                <Router>
                    <div className="sticky-navbar">
                        <NavigationBar />
                    </div>
                    <div className="height">
                        <Sidebar />
                        <div className="content-wrapper">
                            <ClassCarousel />
                            <Switch>
                                <Route exact path="/" component={ Home } />
                                <Route path="/login" component={ Login } />
                                <Route path="/signup" component={ Register } />
                                <Route path="/about" component={ About } />
                                <Route component={ NoMatch } />
                            </Switch>
                        </div>
                        <Footer />
                    </div>
                </Router>
            </React.Fragment>
        );
    }
}

export default App;
