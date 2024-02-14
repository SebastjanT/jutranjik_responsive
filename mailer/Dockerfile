# syntax=docker/dockerfile:1

# Build stage
FROM node:latest AS builder

WORKDIR /build/app

COPY ["mailer/package.json", "mailer/package-lock.json*", "mailer/tsconfig.json" , "./"]

COPY ["./mailer/src", "./src"]

RUN npm install && npm run build

# Production stage
FROM node:latest

WORKDIR /app

COPY ["mailer/package.json", "mailer/package-lock.json*", "./"]

RUN npm install --production

COPY --from=builder /build/app/dist ./dist

COPY ./mailer/src/maizzle/assets ./src/maizzle/assets

COPY ./mailer/src/maizzle/layouts ./src/maizzle/layouts

COPY ./mailer/src/maizzle/templates ./src/maizzle/templates

CMD npm start