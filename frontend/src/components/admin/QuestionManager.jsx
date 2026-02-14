import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { questionsAPI } from '../../services/api';

function QuestionManager() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    content: '',
    author: '',
    category: '',
    tags: ''
  });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await questionsAPI.getAll();
      setQuestions(response.data);
    } catch (error) {
      showAlert('Error fetching questions', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ message, variant });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleShowModal = (question = null) => {
    if (question) {
      setEditMode(true);
      setFormData({
        id: question.id,
        title: question.title,
        content: question.content,
        author: question.author,
        category: question.category,
        tags: question.tags.join(', ')
      });
    } else {
      setEditMode(false);
      setFormData({
        id: 0,
        title: '',
        content: '',
        author: '',
        category: '',
        tags: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const questionData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    try {
      if (editMode) {
        // Note: Update endpoint would need to be added to backend
        showAlert('Update functionality coming soon', 'info');
      } else {
        await questionsAPI.create(questionData);
        showAlert('Question created successfully!');
      }
      handleCloseModal();
      fetchQuestions();
    } catch (error) {
      showAlert('Error saving question', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question and all its answers?')) {
      try {
        await questionsAPI.delete(id);
        showAlert('Question deleted successfully!');
        fetchQuestions();
      } catch (error) {
        showAlert('Error deleting question', 'danger');
      }
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
      {alert && (
        <Alert variant={alert.variant} dismissible onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Questions ({questions.length})</h3>
        <Button variant="success" onClick={() => handleShowModal()}>
          + Add New Question
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ width: '50px' }}>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th style={{ width: '120px' }}>Category</th>
            <th style={{ width: '100px' }}>Answers</th>
            <th style={{ width: '100px' }}>Views</th>
            <th style={{ width: '120px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(question => (
            <tr key={question.id}>
              <td>{question.id}</td>
              <td>
                <strong>{question.title}</strong>
                <br />
                <small className="text-muted">
                  {question.content.substring(0, 60)}...
                </small>
                {question.answers?.some(a => a.isAccepted) && (
                  <Badge bg="success" className="ms-2">✓ Answered</Badge>
                )}
              </td>
              <td>{question.author}</td>
              <td>
                <Badge bg="success">{question.category}</Badge>
              </td>
              <td>{question.answers?.length || 0}</td>
              <td>{question.views}</td>
              <td>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(question.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {questions.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No questions yet. Add your first question!</p>
        </div>
      )}

      {/* Add Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add New Question</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter question title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                placeholder="Describe your question in detail..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author *</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                placeholder="Your name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select category</option>
                <option value="Fiqh">Fiqh (Islamic Law)</option>
                <option value="Aqeedah">Aqeedah (Belief)</option>
                <option value="Quran">Quran</option>
                <option value="Hadith">Hadith</option>
                <option value="Prayer">Prayer</option>
                <option value="Islamic Rulings">Islamic Rulings</option>
                <option value="Spiritual Development">Spiritual Development</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="tag1, tag2, tag3"
              />
              <Form.Text className="text-muted">
                Separate tags with commas
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Create Question
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default QuestionManager;
