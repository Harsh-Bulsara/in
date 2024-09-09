// routes/sales.js
const express = require('express');
const Sale = require('../models/sale'); 
const router = express.Router();

// Route to get all sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales data' });
  }
});

// POST a new sale
router.post('/', async (req, res) => {
    try {
      const newSale = new Sale(req.body);
      const savedSale = await newSale.save();
      res.status(201).json(savedSale);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create sale' });
    }
  });

module.exports = router;
