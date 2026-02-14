import { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Show success message if redirected from signup
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear state so message doesn't persist on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            const result = await login(username, password);
            if (result.success) {
                navigate('/admin');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
                <Card className="login-card shadow-lg">
                    <Card.Body className="p-5">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-primary mb-2">Login</h2>
                            <p className="text-muted">Welcome back! Please enter your details.</p>
                        </div>

                        {successMessage && <Alert variant="success">{successMessage}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </Form.Group>

                            <div className="d-grid mb-3">
                                <Button variant="primary" type="submit" size="lg" disabled={loading}>
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Sign In'}
                                </Button>
                            </div>

                            <div className="text-center mt-3">
                                <p className="text-muted">
                                    Don't have an account? <Link to="/signup" className="text-primary text-decoration-none">Sign up</Link>
                                </p>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default Login;
