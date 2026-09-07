const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  gst: { type: Number },
  deliveryCharge: { type: Number, default: 40 },
  paymentMethod: { type: String, enum: ['COD'], default: 'COD' },
  location: { type: String, required: true },
  userPhone: { type: String, required: true },
  status: { type: String, enum: ['Waiting', 'Accepted', 'Reached', 'Completed'], default: 'Waiting' },
  deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  confirmationCode: { type: String },
  feedbackSubmitted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
