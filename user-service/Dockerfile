# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY user-service/package.json user-service/
COPY shared/package.json shared/
COPY tsconfig.base.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY user-service user-service/
COPY shared shared/

# Build the application
WORKDIR /app/user-service
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY user-service/package.json user-service/

# Install production dependencies only
RUN npm install --production

# Copy built application
COPY --from=builder /app/user-service/dist ./dist

# Copy shared module
COPY --from=builder /app/shared ./shared

EXPOSE 3001

CMD ["node", "dist/main.js"]
