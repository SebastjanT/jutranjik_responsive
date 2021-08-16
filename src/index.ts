require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const schedule = require('node-schedule');
const fs = require('fs');

//  Create the winston logger
const logger = require('./log/logger');

//  Create and configure the nodemailer transport
const nodemailerTransport = require('./nodemailer/nodemailer');

const typeDefs = require('./models/schema');
const resolvers = require('./models/resolvers');
const { createStore } = require('./models/db');

const MaizzleGenerator = require('./maizzle/maizzleGenerator');
const MjmlGenerator = require('./mjml/mjmlGenerator');

const GenerationsAPI = require('./datasources/generations');

const periodicGeneration = require('./schedule/periodicGeneration');

//  Create the sequelize store
const store = createStore();

//  Create the maizzle generator
const maizzleGenerator = new MaizzleGenerator(store, logger, true, nodemailerTransport, fs);

//  Create the mjml generator
const mjmlGenerator = new MjmlGenerator(store, logger, nodemailerTransport, fs);

//  IPs that are cleared for insight mode
const allowedInsight: string[] = process.env.INSIGHT ? process.env.INSIGHT.split(',') : [];

// Define and create the ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }: any) => ({
    insight: allowedInsight.includes((req.headers['x-forwarded-for'] || req.connection.remoteAddress || '').split(',')[0].trim()),
  }),
  dataSources: () => ({
    generationsAPI: new GenerationsAPI({ store, maizzleGenerator, mjmlGenerator }),
  }),
});

// Run the server
server.listen({ port: process.env.PORT || 4000 }).then(({ url }: any) => {
  console.log(`Server ready at ${url}`);
});

// Set and start the scheduled task
schedule.scheduleJob(
  process.env.PG_CRON,
  (fireDate: Date) => periodicGeneration(fireDate, logger, maizzleGenerator, mjmlGenerator),
);
