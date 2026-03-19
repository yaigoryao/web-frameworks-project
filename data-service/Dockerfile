# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY data-service/package.json data-service/
COPY shared/package.json shared/
COPY tsconfig.base.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY data-service data-service/
COPY shared shared/

# Build the application
WORKDIR /app/data-service
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY data-service/package.json data-service/

# Install production dependencies only
RUN npm install --production

# Copy built application
COPY --from=builder /app/data-service/dist ./dist

# Copy shared module
COPY --from=builder /app/shared ./shared

EXPOSE 3002

CMD ["node", "dist/main.js"]
