// models/sale.js
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
      name: String,
      price: Number,
      quantity: Number,
      total: Number,
    }
  ]
});

module.exports = mongoose.model('Sale', saleSchema);
