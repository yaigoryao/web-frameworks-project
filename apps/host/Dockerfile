# Сборка host + microfrontends (context = корень монорепозитория)
FROM node:18-alpine AS builder

WORKDIR /repo

COPY . .

RUN npm ci --include=dev

ENV NODE_ENV=production
ENV AUTH_API_BASE_URL=/api/auth
ENV DATA_API_BASE_URL=/api/data

RUN WEB_PUBLIC_PATH=/mfe-orders/ npm run build --workspace=mfeOrders
RUN WEB_PUBLIC_PATH=/mfe-cars/ npm run build --workspace=mfeCars
RUN npm run build --workspace=host

FROM nginx:1.25-alpine

COPY --from=builder /repo/apps/host/dist /usr/share/nginx/html
COPY --from=builder /repo/apps/mfe-orders/dist /usr/share/nginx/html/mfe-orders
COPY --from=builder /repo/apps/mfe-cars/dist /usr/share/nginx/html/mfe-cars
COPY apps/host/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
