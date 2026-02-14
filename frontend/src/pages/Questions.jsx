import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { questionsAPI, categoriesAPI } from '../services/api';

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [filterCategories, setFilterCategories] = useState(['All']);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll('Question');
      const cats = response.data;
      setCategories(cats);
      setFilterCategories(['All', ...cats.map(c => c.name)]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = selectedCategory === 'All'
        ? await questionsAPI.getAll()
        : await questionsAPI.getByCategory(selectedCategory);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
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
      <h1 className="section-title">Questions & Answers</h1>

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
        {questions.map(question => (
          <Col md={12} key={question.id} className="mb-4">
            <Card>
              <Card.Body>
                <div className="d-flex gap-3">
                  <div className="vote-section">
                    <div className="text-center">
                      <strong>{question.answers?.length || 0}</strong>
                      <div className="text-muted small">answers</div>
                    </div>
                  </div>

                  <div className="flex-grow-1">
                    <Badge bg="success" className="mb-2">{question.category?.name || 'Uncategorized'}</Badge>
                    {question.answers?.some(a => a.isAccepted) && (
                      <Badge bg="success" className="mb-2 ms-2">✓ Answered</Badge>
                    )}

                    <Card.Title>
                      <Link to={`/questions/${question.id}`} className="text-decoration-none text-dark">
                        {question.title}
                      </Link>
                    </Card.Title>

                    <Card.Text>{question.content.substring(0, 200)}...</Card.Text>

                    {question.tags && question.tags.length > 0 && (
                      <div className="mb-3">
                        {question.tags.map((tag, idx) => (
                          <span key={idx} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Asked by {question.author} on {new Date(question.askedDate).toLocaleDateString()}
                      </small>
                      <small className="text-muted">
                        👁 {question.views} views
                      </small>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {questions.length === 0 && (
        <div className="text-center py-5">
          <h4>No questions found in this category</h4>
        </div>
      )}
    </Container>
  );
}

export default Questions;
