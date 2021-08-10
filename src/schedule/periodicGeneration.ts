module.exports = async function periodicGeneration(fireDate: Date, logger: any) {
  //  Placehorder log output
  logger.info({
    message: 'This is where the generation will happen',
    startTime: fireDate,
  });
};
