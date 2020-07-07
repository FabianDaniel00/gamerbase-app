import React from 'react';
import './App.scss';
import Sidebar from './components/Sidebar';
import ClassCarousel from './components/Carousel';
import { Login } from './Login';
import { Register} from './Register';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NavigationBar } from './components/NavigationBar';
import { Home } from './Home';
import { About } from './About';
import { NoMatch } from './NoMatch';

function App() {
    return(
        <React.Fragment>
            <Router>
                 <Sidebar />
                <NavigationBar />
                <div className="grid-wrapper">
                    <ClassCarousel />
                    <Switch>
                        <Route exact path="/" component={ Home } />
                        <Route path="/login" component={ Login } />
                        <Route path="/signup" component={ Register } />
                        <Route path="/about" component={ About } />
                        <Route component={ NoMatch } />
                    </Switch>
                </div>
            </Router>
        </React.Fragment>
    );
}

export default App;
