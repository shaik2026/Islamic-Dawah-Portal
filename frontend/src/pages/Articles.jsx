import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { articlesAPI } from '../services/api';

function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['All', 'Islamic Foundations', 'Aqeedah', 'Fiqh', 'Seerah', 'Quran & Tafsir'];

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = selectedCategory === 'all'
        ? await articlesAPI.getAll()
        : await articlesAPI.getByCategory(selectedCategory);
      setArticles(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
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
        {categories.map(category => (
          <button
            key={category}
            className={`category-pill ${selectedCategory === category.toLowerCase() ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.toLowerCase())}
          >
            {category}
          </button>
        ))}
      </div>

      <Row>
        {articles.map(article => (
          <Col md={6} lg={4} key={article.id} className="mb-4">
            <Card>
              <Card.Img variant="top" src={article.imageUrl} />
              <Card.Body>
                <Badge bg="primary" className="mb-2">{article.category}</Badge>
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
    </Container>
  );
}

export default Articles;
