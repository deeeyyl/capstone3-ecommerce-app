import React, { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, NavLink } from 'react-router-dom';

import UserContext from '../context/UserContext';

export default function AppNavbar() {
  const { user } = useContext(UserContext);

  return (
    <Navbar expand="lg" variant="light" className="navbar m-0 p-0">
      <Container>
        <Navbar.Brand as={Link} to="/home" className='d-flex align-items-center gradient-text'>
          <img
            src="/images/logo.png" 
            alt="Logo"
            height="40"
            className="me-2"
          />
          Bubble Technology
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto text-dark">
            <Nav.Link as={NavLink} to="/home" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/products" end>Products</Nav.Link>
            

            {!user ? (
              <>
                <Nav.Link as={NavLink} to="/login" end>Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register" end>Register</Nav.Link>
              </>
            ) : (
              <>
                {user.isAdmin ? (
                  <>
                    <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
                    <Nav.Link as={NavLink} to="/add-product" end>Add Product</Nav.Link>
                    <Nav.Link as={NavLink} to="/set-user-as-admin" end>Set User As Admin</Nav.Link>
                    <Nav.Link as={NavLink} to="/admin-sale" end>Admin Sales Manager</Nav.Link>
                  </>
                ) : (
                  <>
                  <Nav.Link as={NavLink} to="/cart" end>My Cart</Nav.Link>
                  <Nav.Link as={NavLink} to="/orders" end>My Orders</Nav.Link> 
                   <Nav.Link as={NavLink} to="/mylikes" end>My Likes</Nav.Link> 
                  </>
                )}
                <Nav.Link as={NavLink} to="/logout" end>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}