type Generation = {
    _id: string,
    title: string,
    generationHTML: string,
    generationText: string,
    generationTimeStart: Date,
    generationTimeEnd: Date,
    fileSize: number,
    lineCountBefore: number,
    lineCountAfter: number,
    hasText: boolean,
    usedGenerator: string,
    actualData: boolean,
    isPublic: boolean,
}

export class GenerationsAPI {
  public store;

  public maizzleGenerator;

  public insight;

  constructor({ Generations, maizzleGenerator, insight }: any) {
    this.store = Generations;
    this.maizzleGenerator = maizzleGenerator;
    this.insight = insight;
  }

  //  Function that fetches all generations from the database
  async getAllGenerations(insight: boolean) {
    //  If the user doesn't have insight mode access limit the data retrieved
    const filter = insight ? {} : {
      isPublic: true,
    };
    const projection = insight ? {} : {
      'generationTimeEnd': 0,
      'fileSize': 0,
      'lineCountBefore': 0,
      'lineCountAfter': 0,
      'hasText': 0,
      'usedGenerator': 0,
      'actualData': 0,
      'recipientsNum': 0,
    };
    const generations: Generation[] = await this.store.find(filter, projection);
    return Array.isArray(generations) ? generations.map((generation) => generation) : [];
  }

  //  Function that starts the generation process manually
  async startGeneration({ generator, send }: any = {}) {
    if (generator === 'Maizzle') {
      return this.maizzleGenerator.runMaizzle(send);
    }
    return null;
  }
};
