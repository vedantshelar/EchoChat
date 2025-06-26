
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },

  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // For 1-to-1 chat
    default: null,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",  // For group chat
    default: null,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = messageSchema;