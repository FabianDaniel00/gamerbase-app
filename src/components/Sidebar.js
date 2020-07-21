import React, { useState, Component } from "react";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";
import { Dropdown, ButtonGroup, Button } from "react-bootstrap";
import "./Sidebar.scss";

class SideNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePath: props.location.pathname,
      items: [
        {
          path:
            "/" /* path is used as id to check which NavItem is active basically */,
          name: "Home",
          css: "fa fa-home",
          key: 1 /* Key is required, else console throws error. Does this please you Mr. Browser?! */,
        },
        {
          path: "/login",
          name: "Login",
          css: "fa fa-sign-in-alt",
          key: 2,
        },
        {
          path: "/signup",
          name: "Sign up",
          css: "fa fa-user-plus",
          key: 3,
        },
        {
          path: "/about",
          name: "About",
          css: "fa fa-address-card",
          key: 4,
        },
        {
          key: 5,
          isDropdown: true,
        },
      ],
    };
  }

  onItemClick = (path) => {
    this.setState({ activePath: path });
  };
  render() {
    const { categories, games } = this.props;
    const { items, activePath } = this.state;
    return (
      <>
        <div className="sidenavbar" />
        <div className="sticky-top sidenav">
          {items.map((item) => {
            if (item.isDropdown) {
              return (
                <CustomNavItem
                  categories={categories}
                  games={games}
                  key={item.key}
                />
              );
            } else {
              return (
                <NavItem
                  path={item.path}
                  name={item.name}
                  css={item.css}
                  onItemClick={
                    this.onItemClick
                  } /* Simply passed an entire function to onClick prop */
                  active={item.path === activePath}
                  key={item.key}
                />
              );
            }
          })}
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
  margin-bottom: 10px; /* Puts space between NavItems */
  a {
    font-size: 2.7em;
    color: ${(props) => (props.active ? "white" : "#9FFFCB")};
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
  };

  render() {
    const { active, path, css, name } = this.props;
    return (
      <StyledNavItem active={active}>
        <Link to={path} className={css} onClick={this.handleClick}>
          <div className="navicon">{name}</div>
        </Link>
      </StyledNavItem>
    );
  }
}

class CustomNavItem extends Component {
  render() {
    const { categories, games } = this.props;
    return (
      <StyledNavItem>
        <CustomDropdownButton categories={categories} games={games} />
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
  </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(() => !value)}
        </ul>
      </div>
    );
  }
);

class CustomDropdownButton extends Component {
  render() {
    const { categories, games } = this.props;
    return (
      <Dropdown drop="right">
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
          <i className="fas fa-chevron-circle-right">
            <div className="categories">Categories</div>
          </i>
        </Dropdown.Toggle>
        <Dropdown.Menu as={CustomMenu}>
          {categories.map((category, key) => {
            return (
              <Dropdown
                className="d-buttons"
                key={key}
                drop="right"
                as={ButtonGroup}
              >
                <Button
                  className="buttons"
                  href={`/categories/${category.slug}`}
                  variant="secondary"
                >
                  <div className="dropdown-items">{category.name}</div>
                </Button>

                <Dropdown.Toggle
                  split
                  variant="secondary"
                  id="dropdown-split-basic"
                />

                <Dropdown.Menu>
                  {games
                    .filter((game) => game.category.name === category.name)
                    .map((filteredGame, key) => {
                      return (
                        <Dropdown.Item
                          className="item-hover"
                          key={key}
                          href={`/games/${filteredGame.slug}`}
                        >
                          <div className="dropdown-items d-buttons">
                            {filteredGame.name}
                          </div>
                        </Dropdown.Item>
                      );
                    })}
                </Dropdown.Menu>
              </Dropdown>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default class Sidebar extends Component {
  render() {
    const { categories, games } = this.props;
    return <RouterSideNav categories={categories} games={games} />;
  }
}
