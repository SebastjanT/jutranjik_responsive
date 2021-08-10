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
  constructor({ store }: any) {
    super();
    this.store = store;
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
    //  Currently only creates dummy data
    const generation = await this.store.Generations.create({
      title: 'test',
      filename: 'test.html',
      generationTimeStart: new Date(),
      generationTimeEnd: new Date(),
      fileSize: 0,
      lineCountBefore: 0,
      lineCountAfter: 0,
      hasText: false,
      usedGenerator: generator,
      actualData: false,
      recipientsNum: 0,
      isPublic: false,
    });

    if (!generation.dataValues) {
      return null;
    }

    return generation.dataValues;
  }
};
