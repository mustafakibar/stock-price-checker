'use strict';
const fetch = require('cross-fetch');
const Stock = require('../db').Stock;

const PATH_API = process.env.PATH_API;

/**
Example stockdata
stockdata:  {
  avgTotalVolume: 1472799,
  calculationPrice: 'tops',
  change: -30.52,
  changePercent: -0.01359,
  close: null,
  closeSource: 'official',
  closeTime: null,
  companyName: 'Alphabet Inc - Class C',
  currency: 'USD',
  delayedPrice: null,
  delayedPriceTime: null,
  extendedChange: null,
  extendedChangePercent: null,
  extendedPrice: null,
  extendedPriceTime: null,
  high: null,
  highSource: null,
  highTime: null,
  iexAskPrice: 2388.51,
  iexAskSize: 114,
  iexBidPrice: 2014.34,
  iexBidSize: 128,
  iexClose: 2214.61,
  iexCloseTime: 1656608480844,
  iexLastUpdated: 1656608480844,
  iexMarketPercent: 0.0442371020856202,
  iexOpen: 2210.1,
  iexOpenTime: 1656595801099,
  iexRealtimePrice: 2214.61,
  iexRealtimeSize: 1,
  iexVolume: 41912,
  lastTradeTime: 1656608480844,
  latestPrice: 2214.61,
  latestSource: 'IEX real time price',
  latestTime: '1:01:20 PM',
  latestUpdate: 1656608480844,
  latestVolume: null,
  low: null,
  lowSource: 'IEX real time price',
  lowTime: 1656598081425,
  marketCap: 1495240466027,
  oddLotDelayedPrice: null,
  oddLotDelayedPriceTime: null,
  open: null,
  openTime: null,
  openSource: 'official',
  peRatio: null,
  previousClose: 2245.13,
  previousVolume: 931393,
  primaryExchange: 'NASDAQ',
  symbol: 'GOOG',
  volume: null,
  week52High: 3042,
  week52Low: 2044.16,
  ytdChange: -0.23769223977826848,
  isUSMarketOpen: true
}
*/

const isObj = (obj) => obj != null && obj.constructor.name === 'Object';

const createStockLink = (stock) =>
  `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`;

const fetchStocks = async (stock) => {
  if (!stock) {
    return Promise.reject('No stock provided');
  }

  if (Array.isArray(stock)) {
    return Promise.all(
      stock.map((s) => fetch(createStockLink(s)).then((res) => res.json()))
    ).then(([data1, data2]) => {
      if (isObj(data1) && isObj(data2)) {
        return [data1, data2];
      } else {
        return Promise.reject(`Invalid stock data, stock: ${stock}`);
      }
    });
  } else {
    return fetch(createStockLink(stock))
      .then((res) => res.json())
      .then((data) => {
        if (isObj(data)) {
          return data;
        } else {
          return Promise.reject(`Invalid stock data, stock: ${stock}`);
        }
      });
  }
};

module.exports = (app) => {
  app.route(PATH_API).get(async (req, res) => {
    console.log(`query: ${JSON.stringify(req.query)}`);

    const { stock, like } = req.query;
    const ipAddr =
      req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;

    try {
      const stockdata = await fetchStocks(stock);

      const result = await Promise.all(
        (Array.isArray(stockdata) ? stockdata : [stockdata]).map(
          async (data) => {
            let document;

            if (like) {
              document = await Stock.findOneAndUpdate(
                { name: data.symbol },
                { $addToSet: { likes: ipAddr } },
                { new: true, upsert: true, returnDocument: 'after' }
              );
            } else {
              document = await Stock.findOne({ stock: data.symbol });
            }

            return {
              stock: data.symbol,
              price: data.latestPrice,
              likes: (document && document.likes.length) || 0,
            };
          }
        )
      );

      if (result.length === 2) {
        let [data1, data2] = result;

        data1.rel_likes = data1.likes - data2.likes;
        data2.rel_likes = data2.likes - data1.likes;
        delete data1.likes;
        delete data2.likes;

        return res.json({ stockData: [...result] });
      } else {
        return res.json({ stockData: { ...result[0] } });
      }
    } catch (err) {
      res.json({ stockData: err, likes: null });
    }
  });
};
