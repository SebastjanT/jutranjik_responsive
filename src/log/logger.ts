const { createLogger, format, transports } = require('winston');

const loggerConf = createLogger({
  level: 'info',
  format: format.json(),
  defaultMeta: { service: 'jutranjik_responsive' },
  transports: [
    new transports.File({ filename: './data/logs/jutranjik_responsive-error.log', level: 'error' }),
    new transports.File({ filename: './data/logs/jutranjik_responsive-combined.log' }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: './data/logs/jutranjik_responsive-exceptions.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  loggerConf.add(new transports.Console({
    handleExceptions: true,
    format: format.combine(
      format.colorize(),
      format.simple(),
    ),
  }));
}

module.exports = loggerConf;
