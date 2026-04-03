FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY tsconfig.base.json ./
COPY user-service/package.json user-service/
COPY shared/package.json shared/

RUN npm install

COPY shared/src shared/src
COPY user-service/src user-service/src

COPY user-service/tsconfig.json user-service/
COPY shared/tsconfig.json shared/

WORKDIR /app
RUN npm run build:shared
RUN npm run --workspace=user-service build

FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY user-service/package.json user-service/

RUN npm install --production --workspace=user-service

COPY --from=builder /app/user-service/dist user-service/dist

COPY --from=builder /app/shared/dist shared/dist
COPY --from=builder /app/shared/package.json shared/

EXPOSE 3001

CMD ["node", "user-service/dist/main.js"]
