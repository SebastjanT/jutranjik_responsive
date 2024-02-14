const schema = `#graphql

  scalar Date

  type Query {
    generations: [Generation!]
  }

  type Mutation{
    requestGeneration(generator: String!, send: Boolean!): Generation
  }

  type Generation {
    id: ID!
    title: String
    generationHTML: String
    generationText: String
    generationTimeStart: Date
    generationTimeEnd: Date
    fileSize: Int
    lineCountBefore: Int
    lineCountAfter: Int
    hasText: Boolean
    usedGenerator: String
    actualData: Boolean
    isPublic: Boolean
  }
`;

export default schema;