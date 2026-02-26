const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    role: {
        type: String,
        default: 'user'
    },
    password: {
      type: String,
      required: true,
      select: false,
    }
  }
);

module.exports = mongoose.model("UserSimple", userSchema);
