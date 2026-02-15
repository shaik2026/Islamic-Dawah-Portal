import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { articlesAPI, categoriesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user } = useAuth();

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editArticle, setEditArticle] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteArticle, setDeleteArticle] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [filterCategories, setFilterCategories] = useState(['All']);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll('Article');
      const cats = response.data;
      setCategories(cats);
      setFilterCategories(['All', ...cats.map(c => c.name)]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = selectedCategory === 'All'
        ? await articlesAPI.getAll()
        : await articlesAPI.getByCategory(selectedCategory);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  // Edit handlers
  const handleEditClick = (e, article) => {
    e.preventDefault();
    e.stopPropagation();
    setEditArticle({ ...article });
    setShowEditModal(true);
  };

  const handleEditChange = (field, value) => {
    setEditArticle(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    if (!editArticle) return;
    setEditLoading(true);
    try {
      await articlesAPI.update(editArticle.id, editArticle);
      setShowEditModal(false);
      setEditArticle(null);
      fetchArticles();
    } catch (error) {
      console.error('Error updating article:', error);
      alert('Failed to update article. Please try again.');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete handlers
  const handleDeleteClick = (e, article) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteArticle(article);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteArticle) return;
    setDeleteLoading(true);
    try {
      await articlesAPI.delete(deleteArticle.id);
      setShowDeleteModal(false);
      setDeleteArticle(null);
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="my-5">
      <h1 className="section-title">Articles</h1>

      <div className="category-pills">
        {filterCategories.map(category => (
          <button
            key={category}
            className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <Row>
        {articles.map(article => (
          <Col md={6} lg={4} key={article.id} className="mb-4">
            <Card className="article-card-wrapper">
              {/* Action icons - Only show if logged in AND Admin */}
              {user && user.role === 'Admin' && (
                <div className="article-action-icons">
                  <button
                    className="article-action-btn edit-btn"
                    onClick={(e) => handleEditClick(e, article)}
                    title="Edit article"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button
                    className="article-action-btn delete-btn"
                    onClick={(e) => handleDeleteClick(e, article)}
                    title="Delete article"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </div>
              )}

              <div className={`article-thumbnail gradient-${(article.id % 4) + 1}`}>
                <h3>{article.title}</h3>
              </div>
              <Card.Body>
                <Badge bg="primary" className="mb-2">{article.category?.name || 'Uncategorized'}</Badge>
                <Card.Title>
                  <Link to={`/articles/${article.id}`} className="text-decoration-none text-dark">
                    {article.title}
                  </Link>
                </Card.Title>
                <Card.Text>{article.content.substring(0, 150)}...</Card.Text>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted">By {article.author}</small>
                  <small className="text-muted">
                    {new Date(article.publishedDate).toLocaleDateString()}
                  </small>
                </div>
                <div className="mt-2">
                  <span className="stat-badge">👁 {article.views} views</span>
                </div>
                {article.tags && article.tags.length > 0 && (
                  <div className="mt-3">
                    {article.tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {articles.length === 0 && (
        <div className="text-center py-5">
          <h4>No articles found in this category</h4>
        </div>
      )}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton className="edit-modal-header">
          <Modal.Title>✏️ Edit Article</Modal.Title>
        </Modal.Header>
        <Modal.Body className="edit-modal-body">
          {editArticle && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editArticle.title}
                  onChange={(e) => handleEditChange('title', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  value={editArticle.author}
                  onChange={(e) => handleEditChange('author', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={editArticle.categoryId || ''}
                  onChange={(e) => handleEditChange('categoryId', e.target.value)}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control
                  type="text"
                  value={editArticle.imageUrl}
                  onChange={(e) => handleEditChange('imageUrl', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={editArticle.content}
                  onChange={(e) => handleEditChange('content', e.target.value)}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleEditSave} disabled={editLoading}>
            {editLoading ? <Spinner animation="border" size="sm" /> : '💾 Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="delete-modal-header">
          <Modal.Title>🗑️ Delete Article</Modal.Title>
        </Modal.Header>
        <Modal.Body className="delete-modal-body">
          <p>Are you sure you want to delete this article?</p>
          {deleteArticle && (
            <div className="delete-article-preview">
              <strong>{deleteArticle.title}</strong>
              <br />
              <small className="text-muted">By {deleteArticle.author}</small>
            </div>
          )}
          <p className="text-danger mt-3 mb-0">
            <small>⚠️ This action cannot be undone.</small>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm} disabled={deleteLoading}>
            {deleteLoading ? <Spinner animation="border" size="sm" /> : '🗑️ Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Articles;
