const express = require('express');
const router = express.Router();
const Billing = require('./models/Billing');

// Generate a bill
router.post('/billing', async (req, res) => {
  const newBill = new Billing(req.body);
  try {
    const savedBill = await newBill.save();
    res.status(201).json(savedBill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch all bills
router.get('/billing', async (req, res) => {
  try {
    const bills = await Billing.find();
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
