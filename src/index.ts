require('dotenv').config();

const { ApolloServer } = require('apollo-server');

//  Create the winston logger
require('./log/logger');

const typeDefs = require('./models/schema');
const resolvers = require('./models/resolvers');
const { createStore } = require('./models/db');

const GenerationsAPI = require('./datasources/generations');

//  Create the sequelize store
const store = createStore();

// Define and create the ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    generationsAPI: new GenerationsAPI({ store }),
  }),
});

// Run the server
server.listen({ port: process.env.PORT || 4000 }).then(({ url }: any) => {
  console.log(`Server ready at ${url}`);
});
