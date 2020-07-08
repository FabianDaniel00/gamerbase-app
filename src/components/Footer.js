import React, { Component } from 'react';
import styled from 'styled-components';

const StyledFooter = styled.div`
    background-color: #ededed;
    border-top: 2px solid #E7E7E7;
    border-bottom: 2px solid #E7E7E7;
    text-align: center;
    padding: 20px;
    position: relative;
    bottom: 5px;
    height: 60px;
    width: 100%;
    margin-top: 70px;
`;

class Footer extends Component {
    render() {
        return(
            <StyledFooter>
                &copy; {new Date().getFullYear()} Copyright: <a href="/"> GamerBase.com </a>
            </StyledFooter>
        );
    }
}

export default Footer