const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Comment = require('./Comment');


const postSchema = new Schema({
    userId: {
        type: mongoose.ObjectId,
        required: true
    },
    private: {
        type: Boolean,
        required: false,
        default: false
    },
    fullPath: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 30
    },
    imageUrl: {
        type: String,
        required: true,
        minlength: 5
    },
    createdDate: {
        type: Date,
        required: false,
        default: new Date(),
    },
    likes: {
        type: Number,
        required: false,
        default: 0,
    },
    comments: {
        type: [Comment.commentSchema],
        required: false
    },
    description: {
        type: String,
        required: true,
    }
});

module.exports = model('Posts', postSchema);