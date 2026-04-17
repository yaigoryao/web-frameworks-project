# Сборка host + microfrontends (context = корень монорепозитория)
FROM node:18-alpine AS builder

WORKDIR /repo

COPY . .

RUN npm ci --include=dev

ENV NODE_ENV=production
ENV AUTH_API_BASE_URL=/api/auth
ENV DATA_API_BASE_URL=/api/data
ARG MFE_ORDERS_ORIGIN=/mfe-orders
ARG MFE_CARS_ORIGIN=/mfe-cars
ENV MFE_ORDERS_ORIGIN=$MFE_ORDERS_ORIGIN
ENV MFE_CARS_ORIGIN=$MFE_CARS_ORIGIN

RUN npm run build --workspace=host

FROM nginx:1.25-alpine

COPY --from=builder /repo/apps/host/dist /usr/share/nginx/html
COPY apps/host/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
