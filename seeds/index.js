const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/help-camp')
  .then(() => console.log('Mongo Connection Open'))
  .catch(err => {
    console.log('Oh no Mongo Connection Error');
    console.log(err);
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for(let i = 0; i < 125; i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '66d1daa2d15ba782197bc669',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci ipsum veniam quas qui officiis sed. Odit facilis voluptates delectus minus velit autem reiciendis repellendus quos perferendis omnis, laborum esse quis!',
      price: price, // can just use price as the shorthand version
      geometry: { // ADDED FROM STACK OVERFLOW
        type: 'Point',
        coordinates: [
            cities[random1000].longitude,
            cities[random1000].latitude,
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/future-source/image/upload/v1725287332/HelpCamp/e2yksy9n8cywcuzrkp3n.jpg',
      filename: 'HelpCamp/e2yksy9n8cywcuzrkp3n'
        },
        {
          url: 'https://res.cloudinary.com/future-source/image/upload/v1725287333/HelpCamp/zwuc8zvmly6knihh8icg.jpg',
      filename: 'HelpCamp/zwuc8zvmly6knihh8icg'
        }
      ]
    })
    await camp.save();
  }
};

seedDB().then(() => {
  db.close();// mongoose.connection.close() // if changing the syntax
  console.log('Mongo connection closed');
})