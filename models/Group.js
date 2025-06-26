const mongoose = require("mongoose");
const groupSchema = require("../schemas/groupSchema");

const Group = mongoose.model("Group",groupSchema);

module.exports = Group;