const mjml2html = require('mjml');
const pug = require('pug');

type toFrom = {
  dan: string,
  mesec: string,
}

type newsArticle = {
  naslov: string,
  besedilo: string,
  tip: string,
  url: string,
  urlSlika?: string,
}

type newsEvent = {
  naslov: string,
  od: toFrom,
  do?: toFrom,
  ura: string,
  tip?: string,
  urlSlika?: string,
}

type newsDataMjml = {
  title: string,
  preview: string,
  date: string,
  glava: string,
  noga: string,
  noviceIntranet: newsArticle[],
  noviceSpletna: newsArticle[],
  neZamudite: newsEvent[],
  napovediDog: newsEvent[],
}

type GenerationMjml = {
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

type MailOptionsMjml = {
  from: string,
  to: string,
  subject: string,
  html: string,
}

module.exports = class mjmlGenerator {
  public store: any;

  public logger: any;

  public nodemailerTransport: any;

  public fs: any;

  constructor(store: any, logger: any, nodemailerTransport: any, fs: any) {
    this.store = store;
    this.logger = logger;
    this.nodemailerTransport = nodemailerTransport;
    this.fs = fs;
  }

  //  Sending function
  mjmlSend(maillist: string, subject: string, html: string) {
    //  Email options
    const mailOptions: MailOptionsMjml = {
      from: process.env.NODEMAILER_FROM ? process.env.NODEMAILER_FROM : '',
      to: maillist,
      subject,
      html,
    };

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

  //  Get the data from the API or hardcodeit
  getData(type: string): newsDataMjml {
    this.logger.info({
      message: 'Starting the data retrieval',
    });
    if (process.env.DATA_API !== 'development') {
      if (type === 'news') {
        //  Get the news data
        return {} as newsDataMjml;
      }
      if (type === 'maillist') {
        //  Get the maillist
        return {} as newsDataMjml;
      }
    } else {
      return {
        title: 'Jutranjik newsletter - mjml test data',
        preview: 'Jutranjik mjml responsive template.',
        date: '11. avgust 2021',
        glava: '<strong>Ta del naj bo del GLAVE</strong>, torej templejta, in naj se prikazuje le, če je v uporabi: Če se vanj nič ne vnese, se ne prikaže. Če se vanj kaj vnese, se prikazuje tako dolgo, dokler se tega v templejtu ne zbirše ven. Le za tekst in hiperpovezave - če je možno tudi za slike, pa tudi nič narobe.',
        noga: '<strong>Ta del naj bo del NOGE, torej templejta</strong>, in naj se prikazuje le, če je v uporabi: Če se vanj nič ne vnese, se ne prikaže. Če se vanj kaj vnese, se prikazuje tako dolgo, dokler se tega v templejtu ne zbirše ven. Le za tekst in hiperpovezave - če je možno tudi za slike, pa tudi nič narobe.',
        noviceIntranet: [
          {
            naslov: 'Naslov, ki je malo daljši in se prelomi v dve vrstici ali več',
            besedilo: 'Tole je uvodno besedilo, ki se generira v Jutranjik iz uvodnega odstavko, za ostalo pa je treba izbrati gumb Več.',
            tip: 'Splošne novice',
            url: 'https://fri.uni-lj.si',
          },
          {
            naslov: 'Naslov 2',
            besedilo: 'Tole je uvodno besedilo, ki se generira v Jutranjik iz uvodnega odstavko, za ostalo pa je treba izbrati gumb Več.',
            tip: 'Raziskovalne novice',
            url: 'https://fri.uni-lj.si',
          },
          {
            naslov: 'Naslov 3',
            besedilo: 'Tole je uvodno besedilo, ki se generira v Jutranjik iz uvodnega odstavko, za ostalo pa je treba izbrati gumb Več.',
            tip: 'Splošne novice',
            url: 'https://fri.uni-lj.si',
          },
        ],
        noviceSpletna: [
          {
            naslov: '279 novih diplomantov UL FRI',
            besedilo: 'Tole je uvodno besedilo, ki se generira v Jutranjik iz uvodnega odstavko, za ostalo pa je treba izbrati gumb Več.',
            tip: 'Novice',
            url: 'https://fri.uni-lj.si',
            urlSlika: 'https://friint.fri1.uni-lj.si/upload/IT%20infrastruktura/tricol/slika1.png',
          },
          {
            naslov: 'Razpis za študijske izmenjave in praktično usposabljanje',
            besedilo: 'Tole je uvodno besedilo, ki se generira v Jutranjik iz uvodnega odstavko, za ostalo pa je treba izbrati gumb Več.',
            tip: 'Obvestila referata',
            url: 'https://fri.uni-lj.si',
            urlSlika: 'https://friint.fri1.uni-lj.si/upload/IT%20infrastruktura/tricol/slika2.png',
          },
          {
            naslov: 'Nagrade Univerze v Ljubljani',
            besedilo: 'Tole je uvodno besedilo, ki se generira v Jutranjik iz uvodnega odstavko, za ostalo pa je treba izbrati gumb Več.',
            tip: 'V medijih',
            url: 'https://fri.uni-lj.si',
            urlSlika: 'https://friint.fri1.uni-lj.si/upload/IT%20infrastruktura/tricol/slika3.png',
          },
          {
            naslov: 'Virtualni sprehod po Sloveniji v igri Minecraft',
            besedilo: 'Tole je uvodno besedilo, ki se generira v Jutranjik iz uvodnega odstavko, za ostalo pa je treba izbrati gumb Več.',
            tip: 'Novice',
            url: 'https://fri.uni-lj.si',
            urlSlika: 'https://friint.fri1.uni-lj.si/upload/IT%20infrastruktura/tricol/slika4.png',
          },
        ],
        neZamudite: [
          {
            naslov: 'Sejem Informativa 2017',
            od: { dan: '27', mesec: 'jan' },
            do: { dan: '28', mesec: 'jan' },
            ura: '09:00',
          },
          {
            naslov: 'Infomativni dan',
            od: { dan: '10', mesec: 'feb' },
            do: { dan: '11', mesec: 'feb' },
            ura: '11:00',
          },
        ],
        napovediDog: [
          {
            naslov: 'JobFair 2017',
            od: { dan: '13', mesec: 'mar' },
            do: { dan: '16', mesec: 'mar' },
            ura: '00:00',
            tip: 'Obvestila referata',
            urlSlika: 'https://friint.fri1.uni-lj.si/upload/IT%20infrastruktura/tricol/slika1.png',
          },
          {
            naslov: 'WebCamp 2017',
            od: { dan: '22', mesec: 'apr' },
            ura: '00:00',
            tip: 'Konferenca',
            urlSlika: 'https://friint.fri1.uni-lj.si/upload/IT%20infrastruktura/tricol/slika3.png',
          },
        ],
      };
    }
    this.logger.error({
      message: 'An error occourred while retieving data',
    });
    return {} as newsDataMjml;
  }

  //  Save the html file from the mjml render process
  async saveFile(html: string, filename: string) {
    //  Depending on the environmental settings and generation success save the email
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
        message: 'There was an error in the mjml html generation process!',
      });
      return false;
    }
    return true;
  }

  async runMjml(send: boolean) {
    const generationMjml: GenerationMjml = {};
    generationMjml.usedGenerator = 'mjml';
    generationMjml.generationTimeStart = new Date();
    generationMjml.filename = `jutranjik${generationMjml.generationTimeStart.getTime()}`;
    try {
      //  Recieve the news data from the API
      const retrievedDataMjml = this.getData('news');
      generationMjml.title = retrievedDataMjml.title;
      //  Load the mjml pug template
      const pugCompiled = pug.compileFile('./src/mjml/templates/jutranjik_responsive.pug');
      //  Render the pug template with the retrieved data
      const mjml = pugCompiled(retrievedDataMjml);
      //  Perform the generation
      const { html } = mjml2html(`${mjml}`, { beautify: true, minify: true });
      //  Save the generated html file to the filesystem
      if (await this.saveFile(html, generationMjml.filename)) {
        //  After a successful save finish up the generation and if enabled send the email
        generationMjml.generationTimeEnd = new Date();
        //  Generate a nonoptimised version to get the optimisation metric
        const nonOptimisedResult = mjml2html(`${mjml}`);
        generationMjml.lineCountBefore = nonOptimisedResult.html.split(/\r\n|\r|\n/).length;
        generationMjml.lineCountAfter = html.split(/\r\n|\r|\n/).length;
        generationMjml.fileSize = this.fs.statSync(`./data/generations/${generationMjml.filename}.html`).size;
        if (send) {
          generationMjml.isPublic = send;
          //  Backup address that the email will be delivered to as a notification of a problem
          let maillist = process.env.NODEMAILER_TO ? process.env.NODEMAILER_TO : '';
          if (process.env.DATA_API !== 'development') {
            //  Get the maillist from the API
            console.log('API');
            maillist = '';
          }
          //  Get and save the number of recipients
          generationMjml.recipientsNum = maillist.split(',').length;
          this.mjmlSend(maillist, generationMjml.title ? generationMjml.title : '', html);
        }
        //  Store the generation to the database
        const storeOperation = await this.store.Generations.create(generationMjml);
        if (!storeOperation.dataValues) {
          return null;
        }
        return storeOperation.dataValues;
      }
    } catch (err) {
      this.logger.error({
        message: err,
      });
    }
    return null;
  }
};
