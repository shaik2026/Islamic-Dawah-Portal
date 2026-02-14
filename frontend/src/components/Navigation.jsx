import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

function Navigation() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          ☪️ Islamic Dawah
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/articles">Articles</Nav.Link>
            <Nav.Link as={Link} to="/videos">Videos</Nav.Link>
            <Nav.Link as={Link} to="/questions">Q&A</Nav.Link>
            <Nav.Link as={Link} to="/admin" className="text-warning">
              ⚙️ Admin
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
