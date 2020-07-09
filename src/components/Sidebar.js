import React, { useState, Component } from 'react';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { Dropdown, FormControl } from 'react-bootstrap';
import './Sidebar.scss';

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
                {
                    name: 'Categories',
                    css: 'fa fa-angle-right',
                    key: 5,
                    isDropdown: true
                    // children: [
                    //     {
                            
                    //     }
                    // ]
                }
            ]
        }
    }

    onItemClick = (path) => {
        this.setState({ activePath: path });
    }

    render () {
        const { items, activePath } = this.state;
        return (
            <>
                <div className="sidenavbar" />
                <div className ="sticky-top sidenav">
                    {
                        items.map((item) => {
                            if (item.isDropdown) {
                                return (
                                    <CustomNavItem name={item.name}
                                    css={item.css}
                                    key={item.key}/>
                                )
                            }
                            else {
                                return (
                                    <NavItem path={item.path}
                                    name={item.name}
                                    css={item.css}
                                    onItemClick={this.onItemClick} /* Simply passed an entire function to onClick prop */
                                    active={item.path === activePath}
                                    key={item.key}/>
                                )
                            }
                        })
                    }
                </div>
            </>
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
                    <div className="navicon">{ this.props.name }</div>
                </Link>
            </StyledNavItem>
        );
    }
}

class CustomNavItem extends Component {
    render() {
        const { active } = this.props;
        return(
            <StyledNavItem active = { active }>
                <Link className = { this.props.css }>
                    <div className="navicon">{ this.props.name }</div>
                </Link>
                <CustomDropdownButton />
            </StyledNavItem>
        );
    }
}

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </a>
  ));
    
// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');
  
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to filter..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value),
            )}
          </ul>
        </div>
      );
    },
);

class CustomDropdownButton extends Component {
    render() {
        return(
            <Dropdown>
                <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
                Custom toggle
                </Dropdown.Toggle>
            
                <Dropdown.Menu as={CustomMenu}>
                <Dropdown.Item eventKey="1">Red</Dropdown.Item>
                <Dropdown.Item eventKey="2">Blue</Dropdown.Item>
                <Dropdown.Item eventKey="3" active>
                    Orange
                </Dropdown.Item>
                <Dropdown.Item eventKey="1">Red-Orange</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
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