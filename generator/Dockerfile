# syntax=docker/dockerfile:1

# Build stage
FROM node:latest AS builder

WORKDIR /build/app

COPY ["package.json", "package-lock.json*", "tsconfig.json" , "./"]

COPY ["./src", "./src"]

RUN npm install && npm run build

# Production stage
FROM node:latest

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY --from=builder /build/app/dist ./dist

COPY ./src/maizzle/assets ./src/maizzle/assets

COPY ./src/maizzle/layouts ./src/maizzle/layouts

COPY ./src/maizzle/templates ./src/maizzle/templates

CMD npm start