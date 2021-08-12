const fs = require('fs');
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

module.exports = class maizzleGenerator {
  public store: any;

  public logger: any;

  public plaintext: boolean;

  public nodemailer: any;

  constructor(store: any, logger: any, plaintext: boolean, nodemailer: any) {
    this.store = store;
    this.logger = logger;
    this.plaintext = plaintext;
    this.nodemailer = nodemailer;
  }

  //  Callback after the maizzle render process
  async afterMaizzleRender(html: string, filename: string) {
    //  Depending on the environmental settings and maizzle success send email or save it to a file
    let text = null;
    if (this.plaintext) {
      const data = await Maizzle.plaintext(html);
      text = data.plaintext;
    }
    //  Check if generations directory exists
    if (!fs.existsSync('./data/generations')) {
      try {
        fs.mkdirSync('./data/generations', { recursive: true });
      } catch (err) {
        this.logger.error({
          message: err,
        });
        return false;
      }
    }
    if (html) {
      try {
        fs.writeFileSync(`./data/generations/${filename}.html`, html);
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
        fs.writeFileSync(`./data/generations/${filename}.txt`, text);
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
      // Read the template and start the mazzle jutranjik generation process
      const data = fs.readFileSync('./src/maizzle/templates/jutranjik_responsive.html');
      const template = data.toString();
      try {
        const { html } = await Maizzle.render(
          template,
          {
            tailwind: {
              config: tailwindConf,
              css: fs.readFileSync('./src/maizzle/assets/css/main.css'),
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
              config.title = 'jutranjik_responsive';
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
        // Save the generated html and plaintext files to the filesystem
        if (await this.afterMaizzleRender(html, generationMaizzle.filename)) {
          generationMaizzle.generationTimeEnd = new Date();
          generationMaizzle.lineCountAfter = html.split(/\r\n|\r|\n/).length;
          generationMaizzle.fileSize = fs.statSync(`./data/generations/${generationMaizzle.filename}.html`).size;
          if (send) {
            generationMaizzle.isPublic = send;
            console.log('Send the email!');
          }
          // Store the generation to the database
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
