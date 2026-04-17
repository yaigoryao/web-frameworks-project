# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy root configs and package files
COPY package.json package-lock.json ./
COPY tsconfig.base.json ./
COPY data-service/package.json data-service/
COPY shared/package.json shared/

# Install dependencies for all workspaces
RUN npm install

# Copy source code for all workspaces
COPY shared/src shared/src
COPY data-service/src data-service/src

# Copy tsconfig files
COPY data-service/tsconfig.json data-service/
COPY shared/tsconfig.json shared/

# Build shared first, then data-service (respects workspace dependencies)
WORKDIR /app
RUN npm run build:shared
RUN npm run --workspace=data-service build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy root configs
COPY package.json package-lock.json ./
COPY data-service/package.json data-service/
COPY data-service/debug-install-probe.js data-service/

# Install production dependencies only
RUN node data-service/debug-install-probe.js
RUN npm install --production --workspace=data-service

# Copy built artifacts
COPY --from=builder /app/data-service/dist data-service/dist

# Copy shared library (built and source)
COPY --from=builder /app/shared/dist shared/dist
COPY --from=builder /app/shared/package.json shared/

EXPOSE 3002

CMD ["node", "data-service/dist/main.js"]
