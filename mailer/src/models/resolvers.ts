import { dateScalar } from './dateScalar.js';

export default {
  Date: dateScalar,

  Query: {
    mails: async (_: any, __: any, { dataSources }: any) => {
      //  Call to dataSource generationsAPI
      const mails = await dataSources.mailsAPI.getAllMails();
      return mails;
    },
  },

  Mutation: {
    sendMail: async (_: any, { mailer, send }: any, { dataSources, insight }: any) => {
      //  Check if the user is allowed insight mode
      if (insight) return null;
      //  Call to dataSource generationsAPI
      const mail = await dataSources.generationsAPI.sendMail(
        { mailer, send },
      );
      return mail;
    },
  },
};
