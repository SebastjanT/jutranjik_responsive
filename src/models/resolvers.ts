const dateScalar = require('./dateScalar');

module.exports = {
  Date: dateScalar,

  Query: {
    generations: async (_: any, __: any, context: any) => {
      //  Call to dataSource generationsAPI
      const generations = await context.dataSources.generationsAPI.getAllGenerations();
      return generations;
    },
  },

  Mutation: {
    requestGeneration: async (_: any, { generator, send }: any, context: any) => {
      //  Call to dataSource generationsAPI
      const generation = await context.dataSources.generationsAPI.startGeneration(
        { generator, send },
      );
      return generation;
    },
  },
};
