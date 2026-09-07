const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Item = require('../models/Item');
const User = require('../models/User');

// Create order (User)
router.post('/', async (req, res) => {
  try {
    const { userId, items, location, userPhone } = req.body;
    const itemTotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const gst = itemTotal * 0.05;
    const deliveryCharge = 40;

    const totalAmount = itemTotal + gst + deliveryCharge;

    // Generate confirmation code
    const confirmationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const order = new Order({
      user: userId,
      items,
      totalAmount,
      gst,
      deliveryCharge,
      location,
      userPhone,
      confirmationCode
    });

    await order.save();

    // Update stock and soldCount
    for (const i of items) {
      await Item.findByIdAndUpdate(i.item, {
        $inc: { stock: -i.quantity, soldCount: i.quantity }
      });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user orders
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('items.item').populate('deliveryPerson', '-password');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all orders (For delivery panel: waiting orders)
router.get('/waiting', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Waiting' }).populate('user', '-password').populate('items.item');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get orders by delivery person
router.get('/delivery/:deliveryId', async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPerson: req.params.deliveryId }).populate('user', '-password').populate('items.item');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Accept order (Delivery)
router.put('/:id/accept', async (req, res) => {
  try {
    const { deliveryPersonId } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, {
      status: 'Accepted',
      deliveryPerson: deliveryPersonId
    }, { new: true }).populate('user', '-password').populate('deliveryPerson', '-password');
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reached (Delivery)
router.put('/:id/reached', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, {
      status: 'Reached'
    }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Complete order
router.put('/:id/complete', async (req, res) => {
  try {
    const { code } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.confirmationCode !== code) {
      return res.status(400).json({ message: 'Invalid confirmation code' });
    }

    order.status = 'Completed';
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
