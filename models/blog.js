const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 30,
    },
    body: {
        type: String,
        maxlength: 60,
        required: true,
    },
    blogImage:
    {
        type:String,
        required:true,
    },
    tags: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    author:{
        type:String
    }

});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
