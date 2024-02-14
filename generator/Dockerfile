# syntax=docker/dockerfile:1

# Build stage
FROM node:latest AS builder

WORKDIR /build/app

COPY ["generator/package.json", "generator/package-lock.json*", "generator/tsconfig.json" , "./"]

COPY ["./generator/src", "./src"]

RUN npm install && npm run build

# Production stage
FROM node:latest

WORKDIR /app

COPY ["generator/package.json", "generator/package-lock.json*", "./"]

RUN npm install --production

COPY --from=builder /build/app/dist ./dist

COPY ./generator/src/maizzle/assets ./src/maizzle/assets

COPY ./generator/src/maizzle/layouts ./src/maizzle/layouts

COPY ./generator/src/maizzle/templates ./src/maizzle/templates

EXPOSE 4000

CMD npm start