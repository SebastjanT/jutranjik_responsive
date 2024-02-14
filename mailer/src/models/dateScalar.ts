import { GraphQLScalarType, Kind } from 'graphql';

//  Custom ApolloServer graphql scalar for the data type Date
export const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type (e.g. 1623320451111)',
  serialize(value: any) {
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value: any) {
    if (typeof value === 'number') {
      return new Date(value); // Convert incoming integer to Date
    }
    return null;
  },
  parseLiteral(ast: any) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10));
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});