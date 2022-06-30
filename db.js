const mongoose = require('mongoose');
const { Schema } = mongoose;

var db;
const connect = async () => {
  try {
    db = await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('DB connected');
  } catch (err) {
    console.log('Failed to connect to DB', err);
  }

  return db;
};

const Stock = mongoose.model(
  'stock',
  new Schema({
    name: { type: String, required: true },
    like: Boolean,
    ips: [String],
  })
);

module.exports = { connect, Stock, db };
