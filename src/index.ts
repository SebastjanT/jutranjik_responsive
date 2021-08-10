require('dotenv').config();

//  Create the winston logger
require('./log/logger.ts');

const { createStore } = require('./models/db.ts');

//  Create the sequelize store
createStore();
