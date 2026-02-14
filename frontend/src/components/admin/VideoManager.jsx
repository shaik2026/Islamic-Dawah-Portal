import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { videosAPI } from '../../services/api';

function VideoManager() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: '',
    author: '',
    duration: 0,
    tags: ''
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await videosAPI.getAll();
      setVideos(response.data);
    } catch (error) {
      showAlert('Error fetching videos', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, variant = 'success') => {
    setAlert({ message, variant });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleShowModal = (video = null) => {
    if (video) {
      setEditMode(true);
      setCurrentVideo(video);
      // Convert TimeSpan format to minutes
      const durationInMinutes = Math.floor(video.duration / 60);
      setFormData({
        id: video.id,
        title: video.title,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl,
        category: video.category,
        author: video.author,
        duration: durationInMinutes,
        tags: video.tags.join(', ')
      });
    } else {
      setEditMode(false);
      setCurrentVideo(null);
      setFormData({
        id: 0,
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        category: '',
        author: '',
        duration: 0,
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
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      category: '',
      author: '',
      duration: 0,
      tags: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const videoData = {
      ...formData,
      duration: formData.duration * 60, // Convert minutes to seconds
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    try {
      if (editMode) {
        await videosAPI.update(formData.id, videoData);
        showAlert('Video updated successfully!');
      } else {
        await videosAPI.create(videoData);
        showAlert('Video created successfully!');
      }
      handleCloseModal();
      fetchVideos();
    } catch (error) {
      showAlert('Error saving video', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await videosAPI.delete(id);
        showAlert('Video deleted successfully!');
        fetchVideos();
      } catch (error) {
        showAlert('Error deleting video', 'danger');
      }
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
        <h3>Videos ({videos.length})</h3>
        <Button variant="danger" onClick={() => handleShowModal()}>
          + Add New Video
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ width: '50px' }}>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th style={{ width: '120px' }}>Category</th>
            <th style={{ width: '100px' }}>Duration</th>
            <th style={{ width: '100px' }}>Views</th>
            <th style={{ width: '180px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map(video => (
            <tr key={video.id}>
              <td>{video.id}</td>
              <td>
                <strong>{video.title}</strong>
                <br />
                <small className="text-muted">
                  {video.description.substring(0, 50)}...
                </small>
              </td>
              <td>{video.author}</td>
              <td>
                <Badge bg="danger">{video.category}</Badge>
              </td>
              <td>{formatDuration(video.duration)}</td>
              <td>{video.views}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleShowModal(video)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(video.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {videos.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No videos yet. Add your first video!</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Video' : 'Add New Video'}</Modal.Title>
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
                placeholder="Enter video title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Describe your video..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Video URL (YouTube Embed) *</Form.Label>
              <Form.Control
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                required
                placeholder="https://www.youtube.com/embed/VIDEO_ID"
              />
              <Form.Text className="text-muted">
                Use YouTube embed URL format: https://www.youtube.com/embed/VIDEO_ID
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Thumbnail URL *</Form.Label>
              <Form.Control
                type="url"
                name="thumbnailUrl"
                value={formData.thumbnailUrl}
                onChange={handleInputChange}
                required
                placeholder="https://example.com/thumbnail.jpg"
              />
              {formData.thumbnailUrl && (
                <div className="mt-2">
                  <img 
                    src={formData.thumbnailUrl} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author *</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                required
                placeholder="Author/Channel name"
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
                <option value="Islamic Education">Islamic Education</option>
                <option value="Seerah">Seerah</option>
                <option value="Quran Recitation">Quran Recitation</option>
                <option value="Prayer">Prayer & Worship</option>
                <option value="Lectures">Lectures</option>
                <option value="Reminders">Reminders</option>
                <option value="Converts">For New Muslims</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Duration (minutes) *</Form.Label>
              <Form.Control
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                min="1"
                placeholder="Duration in minutes"
              />
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
            <Button variant="danger" type="submit">
              {editMode ? 'Update Video' : 'Create Video'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default VideoManager;
