#!/bin/bash

# 🚀 One-Command Backend Management Script
# Usage: ./run.sh [command]

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Simple functions
info() { echo -e "${BLUE}[INFO]${NC} $1"; }
success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check Docker
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        error "Docker is not running. Please start Docker Desktop first."
        exit 1
    fi
}

# Check .env file
check_env() {
    if [ ! -f ".env" ]; then
        warning ".env file not found. Creating from .env.docker..."
        if [ -f ".env.docker" ]; then
            cp .env.docker .env
            success ".env file created from .env.docker"
        else
            error ".env.docker file not found. Please create .env file manually."
            exit 1
        fi
    fi
}

# Commands
case "${1:-help}" in
    dev)
        info "Starting development server with nodemon..."
        check_env
        npm run dev
        ;;
    start)
        info "Starting production server..."
        check_env
        npm start
        ;;
    docker)
        info "Starting Docker services..."
        check_docker
        check_env
        docker-compose up -d
        success "Docker services started successfully!"
        info "Services available at:"
        echo "  - App: http://localhost:5001"
        echo "  - MongoDB: localhost:27017"
        echo "  - Mongo Express: http://localhost:8081"
        ;;
    logs)
        info "Showing Docker logs..."
        check_docker
        if [ ! -f "docker-compose.yml" ]; then
            error "docker-compose.yml not found in current directory"
            exit 1
        fi
        info "Available containers:"
        docker-compose ps
        echo ""
        info "Showing recent logs (last 50 lines):"
        docker-compose logs --tail=50
        ;;
    follow)
        info "Following Docker logs in real-time (Ctrl+C to stop)..."
        check_docker
        if [ ! -f "docker-compose.yml" ]; then
            error "docker-compose.yml not found in current directory"
            exit 1
        fi
        docker-compose logs -f
        ;;
    clean)
        info "Cleaning Docker environment..."
        check_docker
        docker-compose down -v --remove-orphans
        success "Docker environment cleaned!"
        ;;
    install)
        info "Installing dependencies..."
        npm install
        success "Dependencies installed successfully!"
        ;;
    lint)
        info "Running ESLint..."
        npm run lint
        ;;
    format)
        info "Formatting code with Prettier..."
        npm run format
        ;;
    build)
        info "Building Docker image..."
        check_docker
        docker build -t honodb-backend .
        success "Docker image built successfully!"
        ;;
    run)
        info "Running Docker container..."
        check_docker
        check_env
        docker run -p 5000:5000 --env-file .env honodb-backend
        ;;
    stop)
        info "Stopping Docker services..."
        check_docker
        docker-compose down
        success "Docker services stopped!"
        ;;
    restart)
        info "Restarting Docker services..."
        check_docker
        docker-compose down
        sleep 2
        docker-compose up -d
        success "Docker services restarted!"
        ;;
    help|--help|-h)
        echo -e "${BLUE}🚀 Backend Management Script${NC}"
        echo ""
        echo "Usage: ./run.sh [command]"
        echo ""
        echo "Available commands:"
        echo "  ${GREEN}dev${NC}        - Start development server with nodemon"
        echo "  ${GREEN}start${NC}      - Start production server"
        echo "  ${GREEN}docker${NC}     - Start all Docker services (app + MongoDB + Mongo Express)"
        echo "  ${GREEN}logs${NC}       - Show Docker logs (last 50 lines)"
        echo "  ${GREEN}follow${NC}     - Follow Docker logs in real-time"
        echo "  ${GREEN}clean${NC}      - Clean Docker environment (remove volumes)"
        echo "  ${GREEN}install${NC}    - Install npm dependencies"
        echo "  ${GREEN}lint${NC}       - Run ESLint"
        echo "  ${GREEN}format${NC}     - Format code with Prettier"
        echo "  ${GREEN}build${NC}      - Build Docker image"
        echo "  ${GREEN}run${NC}        - Run Docker container"
        echo "  ${GREEN}stop${NC}       - Stop Docker services"
        echo "  ${GREEN}restart${NC}    - Restart Docker services"
        echo "  ${GREEN}help${NC}       - Show this help message"
        echo ""
        echo "Examples:"
        echo "  ./run.sh dev          # Start development server"
        echo "  ./run.sh docker       # Start with Docker"
        echo "  ./run.sh logs         # View logs"
        echo "  ./run.sh follow       # Follow logs in real-time"
        echo "  ./run.sh clean        # Clean up"
        ;;
    *)
        error "Unknown command: $1"
        echo ""
        ./run.sh help
        exit 1
        ;;
esac