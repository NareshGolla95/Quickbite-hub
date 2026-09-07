const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const Order = require('../models/Order');

// Add feedback
router.post('/', async (req, res) => {
  try {
    const { user, order, restaurantRating, deliveryRating, foodQuestions, feedbackText } = req.body;
    const feedback = new Feedback({
      user, order, restaurantRating, deliveryRating, foodQuestions, feedbackText
    });
    await feedback.save();
    
    // Mark order as feedback submitted
    if (order) {
      await Order.findByIdAndUpdate(order, { feedbackSubmitted: true });
    }

    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all feedback (Admin)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate('user', 'name email').populate('order');
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete feedback (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json({ message: 'Feedback deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
