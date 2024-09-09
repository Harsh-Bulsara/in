const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  items: [
    {
      itemName: String,
      quantity: Number,
      price: Number,
      total: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  tax: { type: Number },
  discount: { type: Number },
  paymentMethod: { type: String, enum: ['cash', 'credit card', 'bank transfer'], required: true },
  customerDetails: {
    name: String,
    address: String,
    contactNumber: String
  },
  status: { type: String, enum: ['paid', 'unpaid'], default: 'unpaid' }
});

module.exports = mongoose.model('Billing', billingSchema);
