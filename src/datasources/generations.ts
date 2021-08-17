const { DataSource } = require('apollo-datasource');

type Generation = {
    id: string,
    title: string,
    filename: string,
    generationTimeStart: Date,
    generationTimeEnd: Date,
    fileSize: number,
    lineCountBefore: number,
    lineCountAfter: number,
    hasText: boolean,
    usedGenerator: string,
    actualData: boolean,
    recipientsNum: number,
    isPublic: boolean,
}

module.exports = class GenerationsAPI extends DataSource {
  constructor({ store, maizzleGenerator, mjmlGenerator }: any) {
    super();
    this.store = store;
    this.maizzleGenerator = maizzleGenerator;
    this.mjmlGenerator = mjmlGenerator;
  }

  initialize(config: any) {
    this.context = config.context;
  }

  //  Function that fetches all generations from the database
  async getAllGenerations(insight: boolean) {
    //  If the user doesn't have insight mode access limit the data retrieved
    const options = insight ? {} : {
      where: {
        isPublic: true,
      },
      attributes: {
        exclude: [
          'generationTimeEnd',
          'fileSize',
          'lineCountBefore',
          'lineCountAfter',
          'hasText',
          'usedGenerator',
          'actualData',
          'recipientsNum',
        ],
      },
    };
    const generations: Generation[] = await this.store.Generations.findAll(options);
    return Array.isArray(generations) ? generations.map((generation) => generation) : [];
  }

  //  Function that starts the generation process manually
  async startGeneration({ generator, send }: any = {}) {
    if (generator === 'Maizzle') {
      return this.maizzleGenerator.runMaizzle(send);
    }
    if (generator === 'mjml') {
      return this.mjmlGenerator.runMjml(send);
    }
    return null;
  }
};
