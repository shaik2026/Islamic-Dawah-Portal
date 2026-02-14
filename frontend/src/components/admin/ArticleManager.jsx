import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { articlesAPI, categoriesAPI } from '../../services/api';

function ArticleManager() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    content: '',
    author: '',
    categoryId: '',
    imageUrl: '',
    tags: ''
  });

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll('Article');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories', error);
    }
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await articlesAPI.getAll();
      setArticles(response.data);
    } catch (error) {
      showAlert('Error fetching articles', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ message, variant });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleShowModal = (article = null) => {
    if (article) {
      setEditMode(true);
      setCurrentArticle(article);
      setFormData({
        id: article.id,
        title: article.title,
        content: article.content,
        author: article.author,
        categoryId: article.categoryId,
        imageUrl: article.imageUrl,
        tags: article.tags.join(', ')
      });
    } else {
      setEditMode(false);
      setCurrentArticle(null);
      setFormData({
        id: 0,
        title: '',
        content: '',
        author: '',
        categoryId: '',
        imageUrl: '',
        tags: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      id: 0,
      title: '',
      content: '',
      author: '',
      categoryId: '',
      imageUrl: '',
      tags: ''
    });
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

    const articleData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    try {
      if (editMode) {
        await articlesAPI.update(formData.id, articleData);
        showAlert('Article updated successfully!');
      } else {
        await articlesAPI.create(articleData);
        showAlert('Article created successfully!');
      }
      handleCloseModal();
      fetchArticles();
    } catch (error) {
      showAlert('Error saving article', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await articlesAPI.delete(id);
        showAlert('Article deleted successfully!');
        fetchArticles();
      } catch (error) {
        showAlert('Error deleting article', 'danger');
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
        <h3>Articles ({articles.length})</h3>
        <Button variant="primary" onClick={() => handleShowModal()}>
          + Add New Article
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ width: '50px' }}>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th style={{ width: '120px' }}>Category</th>
            <th style={{ width: '100px' }}>Views</th>
            <th style={{ width: '120px' }}>Published</th>
            <th style={{ width: '180px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map(article => (
            <tr key={article.id}>
              <td>{article.id}</td>
              <td>
                <strong>{article.title}</strong>
                <br />
                <small className="text-muted">
                  {article.content.substring(0, 60)}...
                </small>
              </td>
              <td>{article.author}</td>
              <td>
                <Badge bg="primary">{article.category?.name || 'Uncategorized'}</Badge>
              </td>
              <td>{article.views}</td>
              <td>
                <small>{new Date(article.publishedDate).toLocaleDateString()}</small>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(article)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(article.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {articles.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No articles yet. Create your first article!</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Article' : 'Add New Article'}</Modal.Title>
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
                placeholder="Enter article title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content *</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                placeholder="Write your article content..."
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
                placeholder="Author name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category *</Form.Label>
              <Form.Select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL *</Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                required
                placeholder="https://example.com/image.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
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
            <Button variant="primary" type="submit">
              {editMode ? 'Update Article' : 'Create Article'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default ArticleManager;
