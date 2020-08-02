const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 25
    },
    name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    lastname: {
        type: String,
        required: false,
        trim: true,
        lowercase: true
    },
    birthdate: {
        type: Date,
        required: false
    },
    profileImg: {
        type: String,
        default: '/img/profileDefault.jpg'
    }
});

module.exports = model('Users', userSchema);