const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true // sets up an index
  }
});

UserSchema.plugin(passportLocalMongoose); // this adds on fields for username and password

const user = mongoose.model('User', UserSchema);

module.exports = user;