# syntax=docker/dockerfile:1

# Build stage
FROM node:latest AS builder

WORKDIR /build/app

COPY ["package.json", "package-lock.json*", "tsconfig.json" , "./"]

COPY ["./src", "./src"]

RUN npm install && npm run build

# Production stage
FROM node:latest

RUN export DEBIAN_FRONTEND=noninteractive && apt-get update && apt-get install -y --no-install-recommends postfix

WORKDIR /app

COPY ["package.json", "package-lock.json*", "start.sh", "./"]

RUN npm install --production

COPY --from=builder /build/app/dist ./dist

COPY ./src/maizzle/assets ./src/maizzle/assets

COPY ./src/maizzle/layouts ./src/maizzle/layouts

COPY ./src/maizzle/templates ./src/maizzle/templates

COPY ./src/mjml/templates ./src/mjml/templates

RUN chmod u+x ./start.sh

CMD ./start.sh