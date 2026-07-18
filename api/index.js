require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') });
const app = require('../server/dist/app').default;

module.exports = app;
