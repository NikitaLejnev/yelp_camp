const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

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
    const price = Math.floor(Math.random() * 20) + 10;
    const { city, state } = cities[randomIndex];
    const camp = new Campground({
      author: '622db2633d39c0ad50576a03',
      location: `${city}, ${state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In viverra tellus mauris. In bibendum, justo et dignissim eleifend, risus orci ullamcorper justo, in lobortis massa nisi nec purus. Sed id dui porta, cursus justo sed, tristique nisl. Etiam id sem odio. Etiam eu suscipit ante, nec congue lacus. Vestibulum ac arcu sagittis, vehicula ex ut, laoreet risus. Nullam ultricies dolor eget lorem eleifend mattis. Fusce mattis erat interdum erat egestas, ultrices porttitor ex vestibulum.',
      price,
      geometry: {
        type: 'Point',
        coordinates: [-113.1331, 47.0202],
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dap7pbt5c/image/upload/v1647325980/YelpCamp/o1xi5qvva3px50mqikbs.jpg',
          filename: 'YelpCamp/o1xi5qvva3px50mqikbs',
        },
        {
          url: 'https://res.cloudinary.com/dap7pbt5c/image/upload/v1647325981/YelpCamp/ju0y3cn71vde2pz30fn6.png',
          filename: 'YelpCamp/ju0y3cn71vde2pz30fn6',
        },
      ],
    });
    camps.push(camp);
  }
  const results = await Promise.all(camps);
  await Campground.create(results);
};

seedDb().then(() => {
  mongoose.connection.close();
});
