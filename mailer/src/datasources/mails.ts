type Mail = {
    _id: string,
    recipients: string,
    sentTime: Date,
    generationId: string,
}

export class MailsAPI {
  public store;

  public insight;

  constructor({ Mails, insight }: any) {
    this.store = Mails;
    this.insight = insight;
  }

  //  Function that fetches all generations from the database
  async getAllMails(insight: boolean) {
    //  If the user doesn't have insight mode access limit the data retrieved
    const projection = insight ? {} : {
      'recipients': 0,
    };
    const mails: Mail[] = await this.store.find({}, projection);
    return Array.isArray(mails) ? mails.map((mail) => mail) : [];
  }

  //  Function that starts the generation process manually
  async sendMail({ mailer, send }: any = {}) {
    if (mailer === 'MSGraph') {
      const mail = this.store.create({recipients: "null", sentTime: new Date, generationId: "1"});
      return mail;
    }
    return null;
  }
};
