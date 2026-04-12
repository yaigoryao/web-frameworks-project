# Сборка только remote mfe-cars. Context: корень монорепозитория.
FROM node:18-alpine AS builder

WORKDIR /repo

COPY . .

RUN npm ci --include=dev

ENV NODE_ENV=production
ENV WEB_PUBLIC_PATH=/

ARG AUTH_API_BASE_URL=http://localhost:3001
ARG DATA_API_BASE_URL=http://localhost:3002
ENV AUTH_API_BASE_URL=$AUTH_API_BASE_URL
ENV DATA_API_BASE_URL=$DATA_API_BASE_URL

RUN npm run build --workspace=mfeCars

FROM nginx:1.25-alpine

COPY --from=builder /repo/apps/mfe-cars/dist /usr/share/nginx/html
COPY apps/mfe-cars/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/remoteEntry.js || exit 1
