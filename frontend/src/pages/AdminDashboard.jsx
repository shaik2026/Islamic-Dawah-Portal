import { useState } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import ArticleManager from '../components/admin/ArticleManager';
import VideoManager from '../components/admin/VideoManager';
import QuestionManager from '../components/admin/QuestionManager';

function AdminDashboard() {
  const [key, setKey] = useState('articles');

  return (
    <Container className="my-5">
      <div className="mb-4">
        <h1 className="section-title">Admin Dashboard</h1>
        <p className="text-muted">Manage your content - Create, Edit, and Delete</p>
      </div>

      <Tabs
        id="admin-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-4"
      >
        <Tab eventKey="articles" title="📰 Manage Articles">
          <ArticleManager />
        </Tab>
        <Tab eventKey="videos" title="🎥 Manage Videos">
          <VideoManager />
        </Tab>
        <Tab eventKey="questions" title="❓ Manage Questions">
          <QuestionManager />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default AdminDashboard;
