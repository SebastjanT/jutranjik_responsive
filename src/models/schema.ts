const { gql } = require('apollo-server');

module.exports = gql`

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
    filename: String
    generationTimeStart: Date
    generationTimeEnd: Date
    fileSize: Int
    lineCountBefore: Int
    lineCountAfter: Int
    hasText: Boolean
    usedGenerator: String
    actualData: Boolean
    recipientsNum: Int
    isPublic: Boolean
  }
`;
