const schema = `#graphql

  scalar Date

  type Query {
    mails: [Mail!]
  }

  type Mutation{
    sendMail(mailer: String!, send: Boolean!): Mail
  }

  type Mail {
    id: ID!
    recipients: String
    sentTime: Date
    gererationId: String
  }
`;

export default schema;