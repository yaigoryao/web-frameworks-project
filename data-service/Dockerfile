# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY data-service/package.json data-service/
COPY shared/package.json shared/
COPY tsconfig.base.json ./

RUN npm install

COPY data-service data-service/
COPY shared shared/

WORKDIR /app/data-service
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY data-service/package.json data-service/

RUN npm install --production

COPY --from=builder /app/data-service/dist ./dist

COPY --from=builder /app/shared ./shared

EXPOSE 3002

CMD ["node", "dist/main.js"]
