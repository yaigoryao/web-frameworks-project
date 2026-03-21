FROM node:18-alpine AS builder

WORKDIR /app

# Copy root configs and package files
COPY package.json package-lock.json ./
COPY tsconfig.base.json ./
COPY user-service/package.json user-service/
COPY shared/package.json shared/

# Install dependencies for all workspaces
RUN npm install

# Copy source code for all workspaces
COPY shared/src shared/src
COPY user-service/src user-service/src

# Copy tsconfig files
COPY user-service/tsconfig.json user-service/
COPY shared/tsconfig.json shared/

# Build shared first, then user-service (respects workspace dependencies)
WORKDIR /app
RUN npm run build:shared
RUN npm run --workspace=user-service build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy root configs
COPY package.json package-lock.json ./
COPY user-service/package.json user-service/

# Install production dependencies only
RUN npm install --production --workspace=user-service

# Copy built artifacts
COPY --from=builder /app/user-service/dist user-service/dist

# Copy shared library (built and source)
COPY --from=builder /app/shared/dist shared/dist
COPY --from=builder /app/shared/package.json shared/

EXPOSE 3001

CMD ["node", "user-service/dist/main.js"]
