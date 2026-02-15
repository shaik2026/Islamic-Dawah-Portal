import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { articlesAPI, videosAPI, questionsAPI } from '../services/api';

function Home() {
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [articlesRes, videosRes, questionsRes] = await Promise.all([
        articlesAPI.getAll(),
        videosAPI.getAll(),
        questionsAPI.getAll()
      ]);

      setArticles(articlesRes.data.slice(0, 3));
      setVideos(videosRes.data.slice(0, 3));
      setQuestions(questionsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching data:', error);
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
    <>
      <div className="hero-section">
        <Container>
          <h1 className="text-center">☪️ Islamic Dawah Portal</h1>
          <p className="text-center">
            Learn, Share, and Spread the Beautiful Message of Islam
          </p>
          <p className="text-center small" style={{ opacity: 0.9 }}>
            "Invite to the way of your Lord with wisdom and good instruction" - Quran 16:125
          </p>
        </Container>
      </div>

      <Container>
        {/* Latest Articles */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title">Latest Articles</h2>
            <Link to="/articles" className="btn btn-outline-primary">View All</Link>
          </div>
          <Row>
            {articles.map(article => (
              <Col md={4} key={article.id} className="mb-4">
                <Card>
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
                    <Card.Text>
                      {article.content.substring(0, 100)}...
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">By {article.author}</small>
                      <small className="text-muted">👁 {article.views}</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Latest Videos */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title">Latest Videos</h2>
            <Link to="/videos" className="btn btn-outline-primary">View All</Link>
          </div>
          <Row>
            {videos.map(video => (
              <Col md={4} key={video.id} className="mb-4">
                <Card>
                  <div className={`article-thumbnail gradient-${(video.id % 4) + 1}`}>
                    <h3>{video.title}</h3>
                  </div>
                  <Card.Body>
                    <Badge bg="danger" className="mb-2">{video.category?.name || 'Uncategorized'}</Badge>
                    <Card.Title>
                      <Link to={`/videos/${video.id}`} className="text-decoration-none text-dark">
                        {video.title}
                      </Link>
                    </Card.Title>
                    <Card.Text>{video.description.substring(0, 100)}...</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">By {video.author}</small>
                      <small className="text-muted">👁 {video.views}</small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Latest Questions */}
        <section className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="section-title">Latest Questions</h2>
            <Link to="/questions" className="btn btn-outline-primary">View All</Link>
          </div>
          <Row>
            {questions.map(question => (
              <Col md={4} key={question.id} className="mb-4">
                <Card>
                  <Card.Body>
                    <Badge bg="success" className="mb-2">{question.category?.name || 'Uncategorized'}</Badge>
                    <Card.Title>
                      <Link to={`/questions/${question.id}`} className="text-decoration-none text-dark">
                        {question.title}
                      </Link>
                    </Card.Title>
                    <Card.Text>{question.content.substring(0, 100)}...</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">By {question.author}</small>
                      <div>
                        <span className="stat-badge">💬 {question.answers?.length || 0}</span>
                        <span className="stat-badge">👁 {question.views}</span>
                      </div>
                    </div>
                    {question.tags && question.tags.length > 0 && (
                      <div className="mt-2">
                        {question.tags.map((tag, idx) => (
                          <span key={idx} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Container>
    </>
  );
}

export default Home;
