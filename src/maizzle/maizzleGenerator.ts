const Maizzle = require('@maizzle/framework');
const tailwindConf = require('./config/tailwind.config');
const maizzleConf = require('./config/maizzle.config');

type GenerationMaizzle = {
    title?: string,
    filename?: string,
    generationTimeStart?: Date,
    generationTimeEnd?: Date,
    fileSize?: number,
    lineCountBefore?: number,
    lineCountAfter?: number,
    hasText?: boolean,
    usedGenerator?: string,
    actualData?: boolean,
    recipientsNum?: number,
    isPublic?: boolean,
}

type MailOptionsMaizzle = {
  from: string,
  to: string,
  subject: string,
  html: string,
  text?: string,
}

module.exports = class maizzleGenerator {
  public store: any;

  public logger: any;

  public plaintext: boolean;

  public nodemailerTransport: any;

  public fs: any;

  constructor(store: any, logger: any, plaintext: boolean, nodemailerTransport: any, fs: any) {
    this.store = store;
    this.logger = logger;
    this.plaintext = plaintext;
    this.nodemailerTransport = nodemailerTransport;
    this.fs = fs;
  }

  //  Sending function
  maizzleSend(maillist: string, subject: string, html: string, text: string) {
    //  Email options
    const mailOptions: MailOptionsMaizzle = {
      from: process.env.NODEMAILER_FROM ? process.env.NODEMAILER_FROM : '',
      to: maillist,
      subject,
      html,
    };
    if (this.plaintext) {
      mailOptions.text = text;
    }

    this.nodemailerTransport.sendMail(mailOptions, (err: any, info: any) => {
      if (err) {
        this.logger.error({
          message: err,
        });
      } else {
        this.logger.info({
          message: `Email sent: ${info.response}`,
        });
      }
    });
  }

  //  Save the html and text files the maizzle render process
  async afterMaizzleRender(html: string, text: string, filename: string) {
    //  Depending on the environmental settings and maizzle success save the email
    //  Check if generations directory exists
    if (!this.fs.existsSync('./data/generations')) {
      try {
        this.fs.mkdirSync('./data/generations', { recursive: true });
      } catch (err) {
        this.logger.error({
          message: err,
        });
        return false;
      }
    }
    if (html) {
      try {
        this.fs.writeFileSync(`./data/generations/${filename}.html`, html);
      } catch (err) {
        this.logger.error({
          message: err,
        });
        return false;
      }
    } else {
      this.logger.error({
        message: 'There was an error in the Maizzle html generation process!',
      });
      return false;
    }
    if (this.plaintext && text) {
      try {
        this.fs.writeFileSync(`./data/generations/${filename}.txt`, text);
      } catch (err) {
        this.logger.error({
          message: err,
        });
        return false;
      }
    } else {
      this.logger.error({
        message: 'There was an error in the Maizzle text generation process!',
      });
      return false;
    }
    return true;
  }

  async runMaizzle(send: boolean) {
    const generationMaizzle: GenerationMaizzle = {};
    generationMaizzle.usedGenerator = 'Maizzle';
    generationMaizzle.hasText = this.plaintext;
    generationMaizzle.generationTimeStart = new Date();
    generationMaizzle.filename = `jutranjik${generationMaizzle.generationTimeStart.getTime()}`;
    try {
      //  Read the template and start the mazzle jutranjik generation process
      const data = this.fs.readFileSync('./src/maizzle/templates/jutranjik_responsive.html');
      const template = data.toString();
      try {
        const { html } = await Maizzle.render(
          template,
          {
            tailwind: {
              config: tailwindConf,
              css: this.fs.readFileSync('./src/maizzle/assets/css/main.css'),
            },
            maizzle: maizzleConf,
            // eslint-disable-next-line no-shadow
            beforeRender(html: any, config: any) {
              if (process.env.DATA_API !== 'development') {
                //  This is where the actual API will be queried and the data recieved
                //  Otherwise use test data
                console.log('API');
              }
              // eslint-disable-next-line no-param-reassign
              generationMaizzle.title = config.title;
              return html;
            },
            // eslint-disable-next-line no-shadow, no-unused-vars
            afterRender(html: any, config: any) {
              generationMaizzle.lineCountBefore = html.split(/\r\n|\r|\n/).length;
              return html;
            },
          },
        );
        //  Generate the plaintext version
        let text = null;
        if (this.plaintext) {
          const { plaintext } = await Maizzle.plaintext(html);
          text = plaintext;
        }
        //  Save the generated html and plaintext files to the filesystem
        if (await this.afterMaizzleRender(html, text, generationMaizzle.filename)) {
          //  After a successful save finish up the generation and if enabled send the email
          generationMaizzle.generationTimeEnd = new Date();
          generationMaizzle.lineCountAfter = html.split(/\r\n|\r|\n/).length;
          generationMaizzle.fileSize = this.fs.statSync(`./data/generations/${generationMaizzle.filename}.html`).size;
          if (send) {
            generationMaizzle.isPublic = send;
            //  Backup address that the email will be delivered to as a notification of a problem
            let maillist = process.env.NODEMAILER_TO ? process.env.NODEMAILER_TO : '';
            if (process.env.DATA_API !== 'development') {
              //  Get the maillist from the API
              console.log('API');
              maillist = '';
            }
            //  Get and save the number of recipients
            generationMaizzle.recipientsNum = maillist.split(',').length;
            this.maizzleSend(maillist, generationMaizzle.title ? generationMaizzle.title : '', html, text);
          }
          //  Store the generation to the database
          const storeOperation = await this.store.Generations.create(generationMaizzle);
          if (!storeOperation.dataValues) {
            return null;
          }
          return storeOperation.dataValues;
        }
      } catch (error) {
        this.logger.error({
          message: error,
        });
      }
    } catch (err) {
      this.logger.error({
        message: err,
      });
    }
    return null;
  }
};
