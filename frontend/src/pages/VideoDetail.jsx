import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Badge, Spinner } from 'react-bootstrap';
import { videosAPI } from '../services/api';

function VideoDetail() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const response = await videosAPI.getById(id);
      setVideo(response.data);
    } catch (error) {
      console.error('Error fetching video:', error);
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

  if (!video) {
    return (
      <Container className="my-5 text-center">
        <h2>Video not found</h2>
        <Link to="/videos" className="btn btn-primary mt-3">Back to Videos</Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Link to="/videos" className="btn btn-outline-secondary mb-4">← Back to Videos</Link>
      
      <div className="video-embed mb-4">
        <iframe
          src={video.videoUrl}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      <Badge bg="danger" className="mb-3">{video.category}</Badge>
      
      <h1 className="mb-3">{video.title}</h1>
      
      <div className="d-flex gap-3 mb-4 text-muted">
        <span>👤 {video.author}</span>
        <span>📅 {new Date(video.publishedDate).toLocaleDateString()}</span>
        <span>⏱ {formatDuration(video.duration)}</span>
        <span>👁 {video.views} views</span>
      </div>

      {video.tags && video.tags.length > 0 && (
        <div className="mb-4">
          {video.tags.map((tag, idx) => (
            <span key={idx} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="article-content">
        <h3>Description</h3>
        {video.description.split('\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>
    </Container>
  );
}

export default VideoDetail;
