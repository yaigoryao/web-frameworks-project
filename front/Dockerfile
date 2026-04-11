# Сборка статики Vite
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.ts tsconfig.json tsconfig.node.json ./
COPY public ./public
COPY src ./src

ARG VITE_AUTH_API_BASE=/api/auth
ARG VITE_DATA_API_BASE=/api/data
ENV VITE_AUTH_API_BASE=$VITE_AUTH_API_BASE
ENV VITE_DATA_API_BASE=$VITE_DATA_API_BASE

RUN npm run build

# Раздача через nginx + прокси к user-service и data-service
FROM nginx:1.25-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
