const { Schema } = require("mongoose");

module.exports = {
    commentSchema: new Schema({
        userId: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        createdDate: {
            type: Date,
            required: false,
            default: new Date()
        },
        content: {
            type: String,
            required: true
        }
    })
}