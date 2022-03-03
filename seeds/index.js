const mongoose = require('mongoose');
const Campground = require('../models/campground');
const { places, descriptors } = require('./seedHelpers');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelpcamp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  const camps = [];
  for (let i = 0; i < 50; i += 1) {
    const randomIndex = Math.floor(Math.random() * 1000);
    const { city, state } = cities[randomIndex];
    const camp = new Campground({
      location: `${city}, ${state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    camps.push(camp);
  }
  const results = await Promise.all(camps);
  await Campground.create(results);
};

seedDb().then(() => {
  mongoose.connection.close();
});
