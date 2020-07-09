import React, { Component } from 'react';
import './Footer.scss';

class Footer extends Component {
    render() {
        return(
            <div className="footer">
                &copy; {new Date().getFullYear()} Copyright: <a href="/"> GamerBase.com </a>
            </div>
        );
    }
}

export default Footer