const Sequelize = require('sequelize');

module.exports.createStore = () => {
  //  Creating a Sequelize instance
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data/db/store.sqlite',
    loggin: false,
  });

  //  Creating a Sequelize model
  const { Model } = Sequelize;

  //  Creating the Generations class
  class Generations extends Model {}
  Generations.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    generationTimeStart: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    generationTimeEnd: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    fileSize: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    lineCountBefore: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    lineCountAfter: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    hasText: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    usedGenerator: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    actualData: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    recipientsNum: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isPublic: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    modelName: 'generations',
  });

  Generations.sync({ force: false });

  return { Generations };
};
