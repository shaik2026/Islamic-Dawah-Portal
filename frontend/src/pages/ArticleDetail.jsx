import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Badge, Spinner } from 'react-bootstrap';
import { articlesAPI } from '../services/api';

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await articlesAPI.getById(id);
      setArticle(response.data);
    } catch (error) {
      console.error('Error fetching article:', error);
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

  if (!article) {
    return (
      <Container className="my-5 text-center">
        <h2>Article not found</h2>
        <Link to="/articles" className="btn btn-primary mt-3">Back to Articles</Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Link to="/articles" className="btn btn-outline-secondary mb-4">← Back to Articles</Link>
      
      <article>
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="img-fluid rounded mb-4"
          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
        />
        
        <Badge bg="primary" className="mb-3">{article.category}</Badge>
        
        <h1 className="mb-3">{article.title}</h1>
        
        <div className="d-flex gap-3 mb-4 text-muted">
          <span>👤 {article.author}</span>
          <span>📅 {new Date(article.publishedDate).toLocaleDateString()}</span>
          <span>👁 {article.views} views</span>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mb-4">
            {article.tags.map((tag, idx) => (
              <span key={idx} className="tag">{tag}</span>
            ))}
          </div>
        )}

        <div className="article-content">
          {article.content.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </article>
    </Container>
  );
}

export default ArticleDetail;
