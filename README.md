# Content Storage & Discovery System

A comprehensive three-part system for storing and presenting show episodes (podcasts, documentaries) built with NestJS, PostgreSQL, and React.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │   NestJS Backend│    │   PostgreSQL    │
│                 │    │                 │    │   Database      │
│ • CMS Interface │◄──►│ • REST APIs     │◄──►│ • Normalized    │
│ • Discovery UI  │    │ • GraphQL       │    │   Schema        │
│ • Responsive    │    │ • Swagger Docs  │    │ • Optimized     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 System Components

### 1. Content Management System (CMS)
- Internal tool for content managers
- Create, edit, and manage shows
- Rich metadata management
- Future-ready for external data ingestion

### 2. Discovery System
- Public-facing API for content discovery
- Search, filter, and browse functionality
- Optimized for high load (10M users/hour)
- User-friendly JSON responses

### 3. Frontend Application
- React-based interface
- Serves both CMS and Discovery
- Responsive design (desktop + mobile)
- Clean and intuitive UI

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ and npm

### Installation

1. **Clone and Setup**
```bash
git clone <repository-url>
cd thamaneya
```

2. **Start the System**
```bash
# Start all services
docker-compose up -d

# Install frontend dependencies
cd frontend
npm install

# Start frontend development server
npm start
```

3. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api
- Database: localhost:5432

## 📁 Project Structure

```
thamaneya/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── modules/        # Feature modules
│   │   ├── common/         # Shared utilities
│   │   └── main.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript types
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Multi-service setup
└── README.md
```

## 🗄️ Database Schema

### Shows Table
```sql
CREATE TABLE shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  language VARCHAR(50),
  duration INTEGER, -- in seconds
  publish_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes for Performance
```sql
CREATE INDEX idx_shows_category ON shows(category);
CREATE INDEX idx_shows_language ON shows(language);
CREATE INDEX idx_shows_publish_date ON shows(publish_date);
CREATE INDEX idx_shows_search ON shows USING gin(to_tsvector('english', title || ' ' || description));
```

## 🔧 API Endpoints

### CMS Endpoints
- `POST /api/shows` - Create a new show
- `GET /api/shows` - List all shows (admin)
- `PUT /api/shows/:id` - Update a show
- `DELETE /api/shows/:id` - Delete a show

### Discovery Endpoints
- `GET /api/discovery/shows` - Search and filter shows
- `GET /api/discovery/shows/:id` - Get show details
- `GET /api/discovery/categories` - Get available categories
- `GET /api/discovery/languages` - Get available languages

## 🎨 Frontend Features

### CMS Interface
- Show management dashboard
- Create/edit forms with validation
- Bulk operations
- Search and filtering

### Discovery Interface
- Responsive grid layout
- Advanced search with filters
- Show details modal
- Category and language filters

## 🚀 Performance Optimizations

### Backend
- Database indexing for common queries
- Connection pooling
- Response caching
- Pagination for large datasets

### Frontend
- Lazy loading of components
- Image optimization
- Service worker for caching
- Virtual scrolling for large lists

## 🔮 Future Enhancements

1. **External Data Integration**
   - YouTube API integration
   - RSS feed parsing
   - Automated content ingestion

2. **Advanced Features**
   - User authentication and authorization
   - Content recommendations
   - Analytics and reporting
   - Multi-language support

3. **Scalability**
   - Microservices architecture
   - Redis caching layer
   - CDN for static assets
   - Load balancing

## 🛠️ Development

### Backend Development
```bash
cd backend
npm install
npm run start:dev
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Database Migrations
```bash
# Run migrations
npm run migration:run

# Generate new migration
npm run migration:generate -- src/migrations/AddNewFeature
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend tests
cd frontend
npm run test
```

## 📊 Monitoring

- Health check endpoints
- Request/response logging
- Error tracking
- Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For questions or issues, please create an issue in the repository. 