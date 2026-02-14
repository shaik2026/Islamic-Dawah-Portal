# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       FRONTEND (React)                       │
│                     http://localhost:3000                    │
├─────────────────────────────────────────────────────────────┤
│  Components Layer                                            │
│  ├── Navigation                                              │
│  ├── Footer                                                  │
│  └── Pages                                                   │
│      ├── Home                                                │
│      ├── Articles / ArticleDetail                            │
│      ├── Videos / VideoDetail                                │
│      └── Questions / QuestionDetail                          │
├─────────────────────────────────────────────────────────────┤
│  Services Layer                                              │
│  └── API Client (Axios)                                      │
│      ├── articlesAPI                                         │
│      ├── videosAPI                                           │
│      └── questionsAPI                                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP/REST (CORS Enabled)
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    BACKEND (.NET Web API)                    │
│                    http://localhost:5000                     │
├─────────────────────────────────────────────────────────────┤
│  Controllers Layer                                           │
│  ├── ArticlesController                                      │
│  ├── VideosController                                        │
│  └── QuestionsController                                     │
├─────────────────────────────────────────────────────────────┤
│  Services Layer (Business Logic)                             │
│  ├── IArticleService → ArticleService                        │
│  ├── IVideoService → VideoService                            │
│  └── IQnAService → QnAService                                │
├─────────────────────────────────────────────────────────────┤
│  Data Access Layer                                           │
│  ├── MediaPortalContext (EF Core DbContext)                  │
│  └── SeedData (Initial Data)                                 │
├─────────────────────────────────────────────────────────────┤
│  Models                                                      │
│  ├── Article                                                 │
│  ├── Video                                                   │
│  ├── Question                                                │
│  ├── Answer                                                  │
│  └── Comment                                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Entity Framework Core
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              In-Memory Database (Demo)                       │
│         (Replace with SQL Server in Production)              │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Reading Articles Example

```
User clicks article
    ↓
ArticleDetail Component
    ↓
api.articlesAPI.getById(id)
    ↓
HTTP GET /api/articles/{id}
    ↓
ArticlesController.GetArticle(id)
    ↓
ArticleService.GetArticleByIdAsync(id)
    ↓
MediaPortalContext.Articles.FindAsync(id)
    ↓
In-Memory Database
    ↓
Returns Article object
    ↓
Increments view count
    ↓
Returns to frontend
    ↓
Displays article with updated view count
```

### Creating Q&A Answer Example

```
User writes answer & clicks submit
    ↓
QuestionDetail Component
    ↓
api.questionsAPI.addAnswer(questionId, answerData)
    ↓
HTTP POST /api/questions/{id}/answers
    ↓
QuestionsController.AddAnswer(id, answer)
    ↓
QnAService.AddAnswerAsync(questionId, answer)
    ↓
Creates new Answer entity
Sets timestamps and defaults
    ↓
MediaPortalContext.Answers.Add(answer)
MediaPortalContext.SaveChangesAsync()
    ↓
Returns new answer
    ↓
Frontend refreshes question data
    ↓
Displays new answer in the list
```

## Key Design Patterns

### 1. Repository Pattern
- Services abstract database access
- Controllers don't directly access DbContext
- Easier to test and maintain

### 2. Dependency Injection
- Services registered in Program.cs
- Injected into controllers
- Promotes loose coupling

### 3. RESTful API Design
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Resource-based URLs
- Proper status codes

### 4. Component-Based UI
- Reusable React components
- Single Responsibility Principle
- Separation of concerns

## Technology Stack Details

### Backend Stack
```
ASP.NET Core 8.0
├── Web API Framework
├── Entity Framework Core (ORM)
│   └── In-Memory Database Provider
├── Dependency Injection (Built-in)
└── Swagger/OpenAPI (Documentation)
```

### Frontend Stack
```
React 18
├── React Router (Navigation)
├── React Bootstrap (UI Components)
│   └── Bootstrap 5 (CSS Framework)
├── Axios (HTTP Client)
└── Vite (Build Tool & Dev Server)
```

## Security Considerations

Currently implemented:
- CORS configuration
- Input validation in models
- Async/await for scalability

To add for production:
- Authentication (JWT tokens)
- Authorization (Role-based access)
- Input sanitization
- Rate limiting
- HTTPS only
- SQL injection protection (parameterized queries)
- XSS protection
- CSRF tokens

## Scalability Considerations

Current limitations:
- In-Memory database (data lost on restart)
- No caching
- Single server instance
- No load balancing

Production improvements:
- Real database (SQL Server, PostgreSQL)
- Redis caching layer
- CDN for static assets
- Horizontal scaling with load balancer
- Message queue for async operations
- Microservices architecture (optional)

## Performance Optimization

Backend:
- Async/await throughout
- EF Core query optimization (AsNoTracking)
- Lazy loading disabled by default
- Pagination for large datasets (to add)

Frontend:
- Code splitting with React Router
- Lazy loading components (to add)
- Image optimization (to add)
- Bundle optimization with Vite
- Memoization for expensive renders (to add)
