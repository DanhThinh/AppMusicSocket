const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
    },
    password: {
        type: String,
        required: true,
        min: 3,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        required: true,
    },
});

module.exports = mongoose.model("User", UserSchema);