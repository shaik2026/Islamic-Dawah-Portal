import { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);

        try {
            const result = await register(name, username, password);
            if (result.success) {
                navigate('/login', { state: { message: 'Account created successfully! Please login.' } });
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
                            <h2 className="fw-bold text-secondary mb-2">Create Account</h2>
                            <p className="text-muted">Join the community</p>
                        </div>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Choose a username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-4" controlId="confirmPassword">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                    required
                                />
                            </Form.Group>

                            <div className="d-grid mb-3">
                                <Button variant="success" type="submit" size="lg" disabled={loading}>
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Sign Up'}
                                </Button>
                            </div>

                            <div className="text-center mt-3">
                                <p className="text-muted">
                                    Already have an account? <Link to="/login" className="text-primary text-decoration-none">Login here</Link>
                                </p>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
}

export default Signup;
