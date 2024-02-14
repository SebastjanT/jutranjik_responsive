module.exports = async function periodicGeneration(
  fireDate: Date,
  logger: any,
  maizzleGenerator: any,
  mjmlGenerator: any,
) {
  logger.info({
    message: 'Email generation started!',
    startTime: fireDate,
    generator: process.env.GENERATOR,
    send: process.env.SEND,
  });

  let result: any;

  if (process.env.GENERATOR === 'Maizzle') {
    result = await maizzleGenerator.runMaizzle(process.env.SEND === 'true');
  } else if (process.env.GENERATOR === 'mjml') {
    result = await mjmlGenerator.runMjml(process.env.SEND === 'true');
  }

  if (result) {
    logger.info({
      message: 'Email generation finished successfully!',
      endTime: new Date(),
      generator: process.env.GENERATOR,
    });
    return;
  }

  logger.error({
    message: 'Email generation failed!',
    endTime: new Date(),
    generator: process.env.GENERATOR,
  });
};
