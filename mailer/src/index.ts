import dotenv from 'dotenv';
dotenv.config();

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import express from 'express';
import http from 'http';
import cors, { CorsRequest } from 'cors';
//import schedule from 'node-schedule';
import fs from 'fs';

//  Create the winston logger
import { logger } from './log/logger.js';

import typeDefs from './models/schema.js';
import resolvers from './models/resolvers.js';

// Import the mongoose model and connect to MongoDB
import { Mails, checkDB } from './models/dbMongo.js';


import { MailsAPI } from './datasources/mails.js';

//const periodicGeneration = require('./schedule/periodicGeneration.js');

//  IPs that are cleared for insight mode
const allowedInsight: string[] = process.env.INSIGHT ? process.env.INSIGHT.split(',') : [];

// Define the datasources interface
interface ContextValue {
  dataSources: {
    mailsAPI: MailsAPI;
  };
}

// Define and create the Express server
const app = express();

// Define and create the ApolloServer using the httpserver and Express middleware
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Wait for the server to start
await server.start();

// Set up the health probes
app.get(
  '/health/live',
  (_, res) => res.send("Live!"),
);

  app.get(
  '/health/ready',
  (_, res) => {
    // Check if DB is ready
    if (checkDB() == 1) {
      res.send("Ready!");
    } else {
      res.status(500).send("Not ready!");
    }
  },
);

// Set up Express middleware and cors (curretly accept all)
app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const insight = allowedInsight.includes((<string>req.headers['X-Forwarded-For'] || req.socket.remoteAddress || '').split(',')[0].trim());
      return {
        dataSources: {
          mailsAPI: new MailsAPI({ Mails, insight }),
        },
        insight
      }
    },
  }),
);

// Server startup
await new Promise<void>((resolve) => httpServer.listen({ port: parseInt(process.env.PORT || '4000') }, resolve));
console.log(`Server ready at port ${process.env.PORT || '4000'}`);

// Set and start the scheduled task
/*schedule.scheduleJob(
  process.env.PG_CRON,
  (fireDate: Date) => periodicGeneration(fireDate, logger, maizzleGenerator, mjmlGenerator),
);*/
