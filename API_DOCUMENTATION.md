# API Documentation - Thamaneya Content Storage & Discovery System

## Overview

This document describes the RESTful API endpoints for the Thamaneya Content Storage & Discovery System. The API is built with NestJS and provides two main interfaces:

1. **CMS (Content Management System)** - Internal endpoints for content managers
2. **Discovery** - Public endpoints for content discovery

## Base URL

- Development: `http://localhost:3001/api`
- Production: `https://yourdomain.com/api`

## Authentication

Currently, the API uses a simple token-based authentication system. In production, implement proper JWT authentication.

## Response Format

All API responses follow this standard format:

```json
{
  "data": {},
  "message": "Success message",
  "success": true
}
```

## Error Responses

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

---

## CMS Endpoints

### 1. Create Show

**POST** `/cms/shows`

Create a new show in the system.

**Request Body:**
```json
{
  "title": "The History of Ancient Egypt",
  "description": "A comprehensive documentary series exploring the rich history of Ancient Egypt.",
  "category": "Documentary",
  "language": "English",
  "duration": 3600,
  "publishDate": "2024-01-15T10:00:00Z"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "The History of Ancient Egypt",
  "description": "A comprehensive documentary series exploring the rich history of Ancient Egypt.",
  "category": "Documentary",
  "language": "English",
  "duration": 3600,
  "publishDate": "2024-01-15T10:00:00Z",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### 2. Get All Shows (CMS)

**GET** `/cms/shows`

Retrieve all shows with pagination and filtering.

**Query Parameters:**
- `search` (optional): Search term for title and description
- `category` (optional): Filter by category
- `language` (optional): Filter by language
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): ASC or DESC (default: DESC)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Show Title",
      "description": "Show description",
      "category": "Documentary",
      "language": "English",
      "duration": 3600,
      "publishDate": "2024-01-15T10:00:00Z",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

### 3. Get Show by ID

**GET** `/cms/shows/{id}`

Retrieve a specific show by ID.

**Response:**
```json
{
  "id": "uuid",
  "title": "Show Title",
  "description": "Show description",
  "category": "Documentary",
  "language": "English",
  "duration": 3600,
  "publishDate": "2024-01-15T10:00:00Z",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### 4. Update Show

**PATCH** `/cms/shows/{id}`

Update an existing show.

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response:** Updated show object

### 5. Delete Show

**DELETE** `/cms/shows/{id}`

Delete a show from the system.

**Response:** 200 OK

### 6. Get Categories

**GET** `/cms/shows/categories/list`

Get all available categories.

**Response:**
```json
[
  "Documentary",
  "Educational",
  "Cultural",
  "Entertainment"
]
```

### 7. Get Languages

**GET** `/cms/shows/languages/list`

Get all available languages.

**Response:**
```json
[
  "English",
  "Arabic",
  "French",
  "Spanish"
]
```

---

## Discovery Endpoints

### 1. Search Shows

**GET** `/discovery/shows`

Search and discover shows with filtering and pagination.

**Query Parameters:**
- `search` (optional): Search term for title and description
- `category` (optional): Filter by category
- `language` (optional): Filter by language
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `sortBy` (optional): Sort field (default: createdAt)
- `sortOrder` (optional): ASC or DESC (default: DESC)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Show Title",
      "description": "Show description",
      "category": "Documentary",
      "language": "English",
      "duration": 3600,
      "publishDate": "2024-01-15T10:00:00Z",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

### 2. Get Show Details

**GET** `/discovery/shows/{id}`

Get detailed information about a specific show.

**Response:** Show object

### 3. Get Categories

**GET** `/discovery/categories`

Get all available categories for filtering.

**Response:**
```json
[
  "Documentary",
  "Educational",
  "Cultural",
  "Entertainment"
]
```

### 4. Get Languages

**GET** `/discovery/languages`

Get all available languages for filtering.

**Response:**
```json
[
  "English",
  "Arabic",
  "French",
  "Spanish"
]
```

### 5. Full-Text Search

**GET** `/discovery/search/fulltext`

Perform full-text search using PostgreSQL's full-text search capabilities.

**Query Parameters:**
- `q` (required): Search query

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Show Title",
    "description": "Show description",
    "category": "Documentary",
    "language": "English",
    "duration": 3600,
    "publishDate": "2024-01-15T10:00:00Z",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
]
```

---

## Data Models

### Show Entity

```typescript
interface Show {
  id: string;                    // UUID
  title: string;                 // Required, max 255 chars
  description?: string;          // Optional, text
  category?: string;             // Optional, max 100 chars
  language?: string;             // Optional, max 50 chars
  duration?: number;             // Optional, in seconds
  publishDate?: string;          // Optional, ISO date string
  createdAt: string;             // Auto-generated
  updatedAt: string;             // Auto-generated
}
```

### Create Show DTO

```typescript
interface CreateShowDto {
  title: string;                 // Required
  description?: string;          // Optional
  category?: string;             // Optional
  language?: string;             // Optional
  duration?: number;             // Optional
  publishDate?: string;          // Optional
}
```

### Query Parameters

```typescript
interface QueryShowDto {
  search?: string;               // Search term
  category?: string;             // Filter by category
  language?: string;             // Filter by language
  page?: number;                 // Page number (default: 1)
  limit?: number;                // Items per page (default: 10)
  sortBy?: string;               // Sort field
  sortOrder?: 'ASC' | 'DESC';   // Sort order
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

---

## Rate Limiting

- **CMS Endpoints**: 100 requests per minute per IP
- **Discovery Endpoints**: 1000 requests per minute per IP

---

## CORS Configuration

The API supports CORS for the following origins:
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

---

## Swagger Documentation

Interactive API documentation is available at:
- Development: `http://localhost:3001/api`
- Production: `https://yourdomain.com/api`

---

## Examples

### Search for Arabic documentaries

```bash
curl -X GET "http://localhost:3001/api/discovery/shows?category=Documentary&language=Arabic&page=1&limit=10"
```

### Create a new show

```bash
curl -X POST "http://localhost:3001/api/cms/shows" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Islamic Architecture",
    "description": "A journey through the world's most beautiful Islamic architectural masterpieces.",
    "category": "Documentary",
    "language": "Arabic",
    "duration": 4500,
    "publishDate": "2024-02-01T16:00:00Z"
  }'
```

### Full-text search

```bash
curl -X GET "http://localhost:3001/api/discovery/search/fulltext?q=ancient egypt"
```

---

## Future Enhancements

1. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control
   - API key management

2. **Advanced Features**
   - Content recommendations
   - User favorites and playlists
   - Content ratings and reviews
   - Analytics and reporting

3. **Performance Optimizations**
   - Redis caching layer
   - CDN integration
   - Database query optimization
   - Response compression

4. **External Integrations**
   - YouTube API integration
   - RSS feed parsing
   - Social media sharing
   - Email notifications 