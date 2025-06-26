const mongoose = require("mongoose");
const messageSchema = require("../schemas/messageSchema");

const Message = mongoose.model("Message",messageSchema);

module.exports = Message;