import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';

/* This defines the actual bar going down the screen */
const StyledSideNav = styled.div`
    position: fixed;     /* Fixed Sidebar (stay in place on scroll and position relative to viewport) */
    height: 100%;
    width: 75px;     /* Set the width of the sidebar */
    // z-index: 1;      /* Stay on top of everything */
    // top: 0;      /* Stay at the top */
    background-color: #222; /* Black */
    overflow-x: hidden;     /* Disable horizontal scroll */
    padding-top: 70px;
`;

class SideNav extends Component {
    constructor (props) {
        super(props);
        this.state = {
            activePath: props.location.pathname,
            items: [
                {
                    path: '/', /* path is used as id to check which NavItem is active basically */
                    name: 'Home',
                    css: 'fa fa-home',
                    key: 1 /* Key is required, else console throws error. Does this please you Mr. Browser?! */
                },
                {
                    path: '/login',
                    name: 'Login',
                    css: 'fa fa-sign-in-alt',
                    key: 2
                },
                {
                    path: '/signup',
                    name: 'Sign up',
                    css: 'fa fa-user-plus',
                    key: 3
                },
                {
                    path: '/about',
                    name: 'About',
                    css: 'fa fa-address-card',
                    key: 4
                },
            ]
        }
    }

    onItemClick = (path) => {
        this.setState({ activePath: path });
    }

    render () {
        const { items, activePath } = this.state;
        return (
            <StyledSideNav>
                {
                    items.map((item) => {
                        return (
                            <NavItem path={item.path}
                            name={item.name}
                            css={item.css}
                            onItemClick={this.onItemClick} /* Simply passed an entire function to onClick prop */
                            active={item.path === activePath}
                            key={item.key}/>
                        )
                    })
                }
            </StyledSideNav>
        );
    }
}

const RouterSideNav = withRouter(SideNav);

const StyledNavItem = styled.div`
    height: 70px;
    width: 75px; /* width must be same size as NavBar to center */
    text-align: center; /* Aligns <a> inside of NavIcon div */
    margin-bottom: 10px;   /* Puts space between NavItems */
    a {
      font-size: 2.7em;
      color: ${(props) => props.active ? "white" : "#9FFFCB"};
      :hover {
        opacity: 0.7;
        text-decoration: none; /* Gets rid of underlining of icons */
      }  
    }
`;

const NavIcon = styled.div`
    font-size: 12px;
    margin-top: 5px;
`;

class NavItem extends Component {
    handleClick = () => {
        const { path, onItemClick } = this.props;
        onItemClick(path);
    }

    render() {
        const { active } = this.props;
        return(
            <StyledNavItem active = { active }>
                <Link to = { this.props.path }
                className = { this.props.css }
                onClick = { this.handleClick }>
                    <NavIcon>{ this.props.name }</NavIcon>
                </Link>
            </StyledNavItem>
        );
    }
}

export default class Sidebar extends Component {
    render() {
        return (
            <RouterSideNav />
        );
    }
}