const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Get all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new item (Admin)
router.post('/', async (req, res) => {
  try {
    const { name, price, image, stock } = req.body;
    const item = new Item({ name, price, image, stock });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin stats: total items sold, remaining stock
router.get('/stats', async (req, res) => {
  try {
    const items = await Item.find();
    const totalSold = items.reduce((acc, item) => acc + item.soldCount, 0);
    const totalStock = items.reduce((acc, item) => acc + item.stock, 0);
    res.json({ totalSold, totalStock, totalItems: items.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an item (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
