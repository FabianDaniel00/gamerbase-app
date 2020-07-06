import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';

class ClassNavbar extends Component {
    render(){
        return(
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#" id="menu-toggle">&#9776;</Navbar.Brand>
                <Navbar.Brand href="#home">GamerBaseDotNet</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Category1</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Category2</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Category3</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Category4</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Category5</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Other</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
  
export default ClassNavbar;