FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY user-service/package.json user-service/
COPY shared/package.json shared/
COPY tsconfig.base.json ./

RUN npm install

COPY user-service user-service/
COPY shared shared/

WORKDIR /app/user-service
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY user-service/package.json user-service/

RUN npm install --production

COPY --from=builder /app/user-service/dist ./dist

COPY --from=builder /app/shared ./shared

EXPOSE 3001

CMD ["node", "dist/main.js"]
