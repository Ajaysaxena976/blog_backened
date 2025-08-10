const mongoose = require('mongoose');
const userModel = require('./userModel');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        require: [true, "title is require"]
    },
    description: {
        type: String,
        required: [true, 'description is require']
    },
    image:{
        type:String,
        required:[true, "image is required"]
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        require: [true, 'user id is required']
    }
    
    
},
{
    timestamps:true
}
)

const blogModel = mongoose.model ("Blog", blogSchema)

module.exports = blogModel;     