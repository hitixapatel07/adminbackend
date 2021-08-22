const mongoose = require('./mongo');

const UserSchema = new mongoose.Schema({  
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  //name: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  userName: {type: String, required: true, unique: true},
  userRole: {type: String, required: true},
  address: {type: String, required: true}
});

module.exports = mongoose.model('User', UserSchema, 'users');


