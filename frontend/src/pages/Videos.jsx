import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { videosAPI, categoriesAPI } from '../services/api';

function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [filterCategories, setFilterCategories] = useState(['All']);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll('Video');
      const cats = response.data;
      setCategories(cats);
      setFilterCategories(['All', ...cats.map(c => c.name)]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [selectedCategory]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = selectedCategory === 'All'
        ? await videosAPI.getAll()
        : await videosAPI.getByCategory(selectedCategory);
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration) => {
    const totalMinutes = Math.floor(duration / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
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
      <h1 className="section-title">Videos</h1>

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
        {videos.map(video => (
          <Col md={6} lg={4} key={video.id} className="mb-4">
            <Card>
              <div className="video-thumbnail">
                <div className={`article-thumbnail gradient-${(video.id % 4) + 1}`}>
                  <h3>{video.title}</h3>
                </div>
              </div>
              <Card.Body>
                <Badge bg="danger" className="mb-2">{video.category?.name || 'Uncategorized'}</Badge>
                <Card.Title>
                  <Link to={`/videos/${video.id}`} className="text-decoration-none text-dark">
                    {video.title}
                  </Link>
                </Card.Title>
                <Card.Text>{video.description.substring(0, 120)}...</Card.Text>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <small className="text-muted">By {video.author}</small>
                  <small className="text-muted">
                    ⏱ {formatDuration(video.duration)}
                  </small>
                </div>
                <div className="mt-2">
                  <span className="stat-badge">👁 {video.views} views</span>
                </div>
                {video.tags && video.tags.length > 0 && (
                  <div className="mt-3">
                    {video.tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {videos.length === 0 && (
        <div className="text-center py-5">
          <h4>No videos found in this category</h4>
        </div>
      )}
    </Container>
  );
}

export default Videos;
