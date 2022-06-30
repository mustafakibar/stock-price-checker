'use strict';
const fetch = require('cross-fetch');
const Stock = require('../db').Stock;

module.exports = function (app) {
  app.route('/api/stock-prices').get((req, res) => {});
};
