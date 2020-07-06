import React, { Component, NavItem, Link , onClick} from 'react';
import styled from 'styled-components';
import './Sidebar.scss';

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePath: "/",
            items: [
                {
                    path: '/', /* path is used as id to check which NavItem is active basically */
                    name: 'Home',
                    css: 'fa fa-fw fa-home',
                    key: 1 /* Key is required, else console throws error. Does this please you Mr. Browser?! */
                  },
                  {
                    path: '/about',
                    name: 'About',
                    css: 'fa fa-fw fa-clock',
                    key: 2
                  },
                  {
                    path: '/NoMatch',
                    name: 'NoMatch',
                    css: 'fas fa-hashtag',
                    key: 3
                  },
            ]
        }
    }

    onItemClick = (path) => {
        this.setState({ activePath:path});
    }
    render() {
        const { items, activePath } = this.state;
        return(
            <div className="side-nav">
                {
                    /* items = just array AND map() loops thru that array AND item is param of that loop */
                    items.map((item) => {
                    /* Return however many NavItems in array to be rendered */
                    return (
                        <NavItem
                            path={item.path}
                            name={item.name}
                            css={item.css}
                            onItemClick={this.onItemClick} /* Simply passed an entire function to onClick prop */ active={item.path === activePath} key={item.key}/>
                    )
                    })
                }
            </div>
        );
    }
}

class Navitem extends Component {
    handleClick = () => {
        const{ path, onclick } = this.props;
        onClick(path);
    }
    render() {
        const { active } = this.props;
        return(
            <div active={ active } className="side-nav">
                <Link to={this.props.path} className={this.props.css} onclick={this.handleClick}></Link>
            </div>
        );
    }
}

export default Sidebar;

const StyledNavItem = styled.div`
  height: 70px;
  width: 75px; /* width must be same size as NavBar to center */
  text-align: center; /* Aligns <a> inside of NavIcon div */
  margin-bottom: 0;   /* Puts space between NavItems */
  a {
    font-size: 2.7em;
    color: ${(props) => props.active ? "white" : "#9FFFCB"};
    :hover {
      opacity: 0.7;
      text-decoration: none; /* Gets rid of underlining of icons */
    }  
  }
`;