const mongoose = require('mongoose');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelpcamp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database connected');
});

const seedDb = async () => {
  await Campground.deleteMany({});
  const c = new Campground({ title: 'Drowsy Hills' });
  await c.save();
};

seedDb();
