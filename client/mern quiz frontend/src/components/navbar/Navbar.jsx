import React from 'react';
import { GiBookStorm } from "react-icons/gi";
import { AiOutlineLogout } from "react-icons/ai";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';

const NavbarComponent = ({ isAuthenticated, onLogout }) => {
    return (
        <Navbar bg="primary" expand="lg" data-bs-theme="dark">
            <Container>
                <Navbar.Brand as={Link} to="/" style={{ fontSize: '25px' }}>Quizzy <GiBookStorm /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav>
                        {isAuthenticated ? (
                            <>
                                <Nav.Link as={Link} to="/home" className="nav-link-custom" style={{ fontSize: '20px' }}>Home</Nav.Link>
                                <Nav.Link as={Link} to="/about" className="nav-link-custom" style={{ fontSize: '20px' }}>About</Nav.Link>
                                <Nav.Link as={Link} to="/contact-us" className="nav-link-custom" style={{ fontSize: '20px' }}>Contact Us</Nav.Link>
                                <Nav.Link onClick={onLogout} style={{ fontSize: '20px' }}>
                                    Logout <AiOutlineLogout />
                                </Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login" className="nav-link-custom">Login</Nav.Link>
                                <Nav.Link as={Link} to="/signup" className="nav-link-custom">Signup</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
