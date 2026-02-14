import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Badge, Spinner, Alert } from 'react-bootstrap';
import { categoriesAPI } from '../../services/api';

function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', type: 'Article' });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await categoriesAPI.getAll();
            setCategories(response.data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleShow = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, description: category.description, type: category.type });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '', type: 'Article' });
        }
        setShowModal(true);
        setError(null);
    };

    const handleClose = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await categoriesAPI.update(editingCategory.id, { ...formData, id: editingCategory.id });
            } else {
                await categoriesAPI.create(formData);
            }
            setShowModal(false);
            fetchCategories();
        } catch (err) {
            console.error('Error saving category:', err);
            setError('Failed to save category. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await categoriesAPI.delete(id);
                fetchCategories();
            } catch (err) {
                console.error('Error deleting category:', err);
                setError('Failed to delete category');
            }
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Article': return 'primary';
            case 'Video': return 'danger';
            case 'Question': return 'success';
            default: return 'secondary';
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Categories ({categories.length})</h3>
                <Button variant="primary" onClick={() => handleShow()}>+ Add Category</Button>
            </div>

            {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category.id}>
                            <td><strong>{category.name}</strong></td>
                            <td><Badge bg={getTypeColor(category.type)}>{category.type}</Badge></td>
                            <td>{category.description}</td>
                            <td>
                                <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShow(category)}>Edit</Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(category.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                    {categories.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center">No categories found. Add one above!</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingCategory ? 'Edit Category' : 'Add Category'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="Article">Article</option>
                                <option value="Video">Video</option>
                                <option value="Question">Question</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" className="me-2" onClick={handleClose}>Cancel</Button>
                            <Button variant="primary" type="submit">{editingCategory ? 'Update' : 'Create'}</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default CategoryManager;
