require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const schedule = require('node-schedule');

//  Create the winston logger
const logger = require('./log/logger');

const typeDefs = require('./models/schema');
const resolvers = require('./models/resolvers');
const { createStore } = require('./models/db');

const MaizzleGenerator = require('./maizzle/maizzleGenerator');

const GenerationsAPI = require('./datasources/generations');

const periodicGeneration = require('./schedule/periodicGeneration');

//  Create the sequelize store
const store = createStore();

//  Create the maizzle generator
const maizzleGenerator = new MaizzleGenerator(store, logger, true, null);

// Define and create the ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    generationsAPI: new GenerationsAPI({ store, maizzleGenerator }),
  }),
});

// Run the server
server.listen({ port: process.env.PORT || 4000 }).then(({ url }: any) => {
  console.log(`Server ready at ${url}`);
});

// Set and start the scheduled task
schedule.scheduleJob(
  process.env.PG_CRON,
  (fireDate: Date) => periodicGeneration(fireDate, logger, maizzleGenerator),
);
