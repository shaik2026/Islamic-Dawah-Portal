import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          ☪️ Islamic Dawah
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/articles">Articles</Nav.Link>
            <Nav.Link as={Link} to="/videos">Videos</Nav.Link>
            <Nav.Link as={Link} to="/questions">Q&A</Nav.Link>

            {user ? (
              <>
                {user.role === 'Admin' && (
                  <Nav.Link as={Link} to="/admin" className="text-warning">
                    ⚙️ Admin
                  </Nav.Link>
                )}
                <div className="d-flex align-items-center ms-lg-3">
                  <span className="text-light me-2 small d-none d-lg-block">
                    {user.name}
                  </span>
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={handleLogout}
                    className="ms-2"
                  >
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="ms-lg-2">
                <Button variant="primary" size="sm">Login</Button>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
