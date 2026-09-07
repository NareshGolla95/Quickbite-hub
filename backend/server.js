require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const MONGO_URI = process.env.MONGO_URI;

console.log('Mongo URI exists:', !!MONGO_URI);

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/items', require('./routes/items'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/feedbacks', require('./routes/feedbacks'));

app.get('/', (req, res) => {
  res.send('Quick Bite Hub API is running...');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:');
    console.error(err);
  });
