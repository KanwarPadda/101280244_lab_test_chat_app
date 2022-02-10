let mongoose = require("mongoose");

const Room = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
},{ timestamps: true });

module.exports = Room;
