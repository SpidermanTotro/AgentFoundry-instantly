# Advanced Offline AI Copilot Pro - Docker Image
# Multi-stage build for optimized image size

# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source files
COPY . .

# Build frontend
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

LABEL maintainer="Copilot Pro Team"
LABEL description="Advanced Offline AI Copilot Pro - Professional Grade AI Coding Assistant"
LABEL version="1.0.0"

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    sqlite \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S copilot && \
    adduser -S -u 1001 -G copilot copilot

# Copy package files
COPY --chown=copilot:copilot package*.json ./

# Install production dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application files
COPY --chown=copilot:copilot --from=frontend-builder /app/dist ./dist
COPY --chown=copilot:copilot server ./server
COPY --chown=copilot:copilot public ./public
COPY --chown=copilot:copilot index.html ./

# Create data directory for SQLite database
RUN mkdir -p /app/data && \
    chown -R copilot:copilot /app/data

# Set environment variables
ENV NODE_ENV=production \
    PORT=3001 \
    HOST=0.0.0.0

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1); });"

# Switch to non-root user
USER copilot

# Start application
CMD ["node", "server/index.js"]
