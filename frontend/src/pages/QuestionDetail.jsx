import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Badge, Card, Button, Form, Spinner } from 'react-bootstrap';
import { questionsAPI } from '../services/api';

function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerContent, setAnswerContent] = useState('');
  const [answerAuthor, setAnswerAuthor] = useState('');

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    try {
      const response = await questionsAPI.getById(id);
      setQuestion(response.data);
    } catch (error) {
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    try {
      await questionsAPI.addAnswer(id, {
        content: answerContent,
        author: answerAuthor
      });
      setAnswerContent('');
      setAnswerAuthor('');
      setShowAnswerForm(false);
      fetchQuestion();
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!question) {
    return (
      <Container className="my-5 text-center">
        <h2>Question not found</h2>
        <Link to="/questions" className="btn btn-primary mt-3">Back to Questions</Link>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Link to="/questions" className="btn btn-outline-secondary mb-4">← Back to Questions</Link>
      
      <Card className="mb-4">
        <Card.Body>
          <Badge bg="success" className="mb-3">{question.category}</Badge>
          {question.answers?.some(a => a.isAccepted) && (
            <Badge bg="success" className="mb-3 ms-2">✓ Answered</Badge>
          )}
          
          <h1 className="mb-3">{question.title}</h1>
          
          <div className="d-flex gap-3 mb-4 text-muted">
            <span>👤 {question.author}</span>
            <span>📅 {new Date(question.askedDate).toLocaleDateString()}</span>
            <span>👁 {question.views} views</span>
          </div>

          {question.tags && question.tags.length > 0 && (
            <div className="mb-4">
              {question.tags.map((tag, idx) => (
                <span key={idx} className="tag">{tag}</span>
              ))}
            </div>
          )}

          <div className="article-content">
            {question.content.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>{question.answers?.length || 0} Answers</h3>
        <Button 
          variant="primary"
          onClick={() => setShowAnswerForm(!showAnswerForm)}
        >
          {showAnswerForm ? 'Cancel' : 'Write an Answer'}
        </Button>
      </div>

      {showAnswerForm && (
        <Card className="mb-4">
          <Card.Body>
            <h5>Your Answer</h5>
            <Form onSubmit={handleSubmitAnswer}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={answerAuthor}
                  onChange={(e) => setAnswerAuthor(e.target.value)}
                  required
                  placeholder="Your name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Answer</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  required
                  placeholder="Write your answer here..."
                />
              </Form.Group>
              <Button type="submit" variant="primary">Submit Answer</Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      <div>
        {question.answers && question.answers.length > 0 ? (
          question.answers
            .sort((a, b) => {
              if (a.isAccepted) return -1;
              if (b.isAccepted) return 1;
              return b.votes - a.votes;
            })
            .map(answer => (
              <div 
                key={answer.id} 
                className={`answer-card ${answer.isAccepted ? 'accepted' : ''}`}
              >
                {answer.isAccepted && (
                  <Badge bg="success" className="mb-2">✓ Accepted Answer</Badge>
                )}
                <div className="d-flex gap-3">
                  <div className="vote-section">
                    <button className="vote-btn">▲</button>
                    <strong>{answer.votes}</strong>
                    <button className="vote-btn">▼</button>
                  </div>
                  <div className="flex-grow-1">
                    <div className="article-content">
                      {answer.content.split('\n').map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <small className="text-muted">
                        Answered by {answer.author} on {new Date(answer.answeredDate).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No answers yet. Be the first to answer!</p>
          </div>
        )}
      </div>
    </Container>
  );
}

export default QuestionDetail;
