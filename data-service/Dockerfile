FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig.base.json ./
COPY data-service/package.json data-service/
COPY shared/package.json shared/

RUN npm install

COPY shared/src shared/src
COPY data-service/src data-service/src

COPY data-service/tsconfig.json data-service/
COPY shared/tsconfig.json shared/

WORKDIR /app
RUN npm run build:shared
RUN npm run --workspace=data-service build

FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY data-service/package.json data-service/

RUN npm install --production --workspace=data-service

COPY --from=builder /app/data-service/dist data-service/dist

COPY --from=builder /app/shared/dist shared/dist
COPY --from=builder /app/shared/package.json shared/

EXPOSE 3002

CMD ["node", "data-service/dist/main.js"]
