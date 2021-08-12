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
  constructor({ store, maizzleGenerator }: any) {
    super();
    this.store = store;
    this.maizzleGenerator = maizzleGenerator;
  }

  initialize(config: any) {
    this.context = config.context;
  }

  //  Function that fetches all generations from the database
  async getAllGenerations() {
    const generations: Generation[] = await this.store.Generations.findAll();
    return Array.isArray(generations) ? generations.map((generation) => generation) : [];
  }

  //  Function that starts the generation process manually
  async startGeneration({ generator }: any = {}) {
    if (generator === 'Maizzle') {
      return this.maizzleGenerator.runMaizzle(false);
    }
    if (generator === 'mjml') {
      return null;
    }
    return null;
  }
};
