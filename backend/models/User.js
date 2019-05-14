const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  address: { type: Array, required: false }
});

module.exports = mongoose.model("User", userSchema);
