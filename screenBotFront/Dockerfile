# Этап сборки
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Финальный этап — только build/
FROM node:18-slim

WORKDIR /app

# Копируем только билд из предыдущей стадии
COPY --from=build /app/build ./build

EXPOSE 3000