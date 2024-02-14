import { dateScalar } from './dateScalar.js';

export default {
  Date: dateScalar,

  Query: {
    generations: async (_: any, __: any, { dataSources }: any) => {
      //  Call to dataSource generationsAPI
      const generations = await dataSources.generationsAPI.getAllGenerations();
      return generations;
    },
  },

  Mutation: {
    requestGeneration: async (_: any, { generator, send }: any, { dataSources, insight }: any) => {
      //  Check if the user is allowed insight mode
      if (insight) return null;
      //  Call to dataSource generationsAPI
      const generation = await dataSources.generationsAPI.startGeneration(
        { generator, send },
      );
      return generation;
    },
  },
};
