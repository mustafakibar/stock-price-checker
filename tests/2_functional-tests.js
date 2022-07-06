const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const PATH_API = process.env.PATH_API;
const STOCK_NAMES = {
  GOOGLE: 'GOOG',
  AMAZON: 'AMZN',
};

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('Viewing one stock', (done) => {
    chai
      .request(server)
      .get(PATH_API)
      .query({ stock: STOCK_NAMES.GOOGLE })
      .end((err, res) => {
        if (err) return console.error(err);

        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, STOCK_NAMES.GOOGLE);
        assert.isNotNull(res.body.stockData.price);
        done();
      });
  });

  test('Viewing one stock and liking it', (done) => {
    chai
      .request(server)
      .get(PATH_API)
      .query({ stock: STOCK_NAMES.GOOGLE, like: true })
      .end((err, res) => {
        if (err) return console.error(err);

        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, STOCK_NAMES.GOOGLE);
        assert.equal(res.body.stockData.likes, 2);
        assert.isNotNull(res.body.stockData.price);
        done();
      });
  });

  test('Viewing the same stock and liking it again', (done) => {
    chai
      .request(server)
      .get(PATH_API)
      .query({ stock: STOCK_NAMES.GOOGLE, like: true })
      .end((err, res) => {
        if (err) return console.error(err);

        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, STOCK_NAMES.GOOGLE);
        assert.equal(res.body.stockData.likes, 2);
        assert.isNotNull(res.body.stockData.price);
        done();
      });
  });

  test('Viewing two stocks', (done) => {
    chai
      .request(server)
      .get(PATH_API)
      .query({ stock: [STOCK_NAMES.GOOGLE, STOCK_NAMES.AMAZON] })
      .end((err, res) => {
        if (err) return console.error(err);

        assert.equal(res.status, 200);

        const stockData = res.body.stockData;
        assert.isArray(stockData);

        const STOCK_GOOGLE = stockData[0];
        assert.equal(STOCK_GOOGLE.stock, STOCK_NAMES.GOOGLE);
        assert.equal(STOCK_GOOGLE.rel_likes, 0);
        assert.isNotNull(STOCK_GOOGLE.price);

        const STOCK_AMAZON = stockData[1];
        assert.equal(STOCK_AMAZON.stock, STOCK_NAMES.AMAZON);
        assert.equal(STOCK_AMAZON.rel_likes, 0);
        assert.isNotNull(STOCK_AMAZON.price);

        done();
      });
  });

  test('Viewing the same stock and liking it again', (done) => {
    chai
      .request(server)
      .get(PATH_API)
      .query({ stock: [STOCK_NAMES.GOOGLE, STOCK_NAMES.AMAZON], likes: true })
      .end((err, res) => {
        if (err) return console.error(err);

        assert.equal(res.status, 200);

        const stockData = res.body.stockData;
        assert.isArray(stockData);

        const STOCK_GOOGLE = stockData[0];
        assert.equal(STOCK_GOOGLE.stock, STOCK_NAMES.GOOGLE);
        assert.equal(STOCK_GOOGLE.rel_likes, 0);
        assert.isNotNull(STOCK_GOOGLE.price);

        const STOCK_AMAZON = stockData[1];
        assert.equal(STOCK_AMAZON.stock, STOCK_NAMES.AMAZON);
        assert.equal(STOCK_AMAZON.rel_likes, 0);
        assert.isNotNull(STOCK_AMAZON.price);

        done();
      });
  });
});
