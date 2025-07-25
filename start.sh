#!/bin/bash

echo "🚀 Starting Thamaneya Content Storage & Discovery System..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build and start all services
echo "📦 Building and starting services..."
docker compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker compose ps

echo ""
echo "✅ System is starting up!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo "   API Documentation: http://localhost:3001/api"
echo ""
echo "📚 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo ""
echo "🎯 The system includes:"
echo "   • CMS Interface for content management"
echo "   • Discovery Interface for browsing shows"
echo "   • RESTful API with Swagger documentation"
echo "   • PostgreSQL database with sample data"
echo ""
echo "🔄 The system will automatically reload when you make changes to the code." 