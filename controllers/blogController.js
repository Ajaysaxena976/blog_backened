 const {mongoose } = require('mongoose')
const blogModel = require('../models/blogModels')
const userModel = require('../models/userModel')
const { request } = require('express')


//get all blogs
exports.getAllBlogController = async(req, res)=>{

    try{
        const {search} = req.query;
        console.log(search)
        const blogs = await blogModel.find({
       title: { // replace `title` with the field you want to search
    $regex: search,
    $options: "i" // 'i' makes the search case-insensitive
  }
        })
        if(!blogs){
            return res.status(200)
            .send({
                success: false,
                message: 'no blogs found'
            })
        }
        return res.status(200)
        .send({
            success: true,
            message: 'All Blogs lists',
            blogs,
            BlogCount: blogs.length

        }) 
    }
    catch(error){
      console.log(error)
      return res.status(500)
      .send({
        success:false,
        message: 'eror while getting blogs',
        error
      })
    }
}

//create Blog 
exports.createBlogController = async(req, res)=>{
    try{
        const {title, description, image, user} = req.body
        console.log(req.body)
        //validation
        if(!title || !description || !image || !user){
            return res.status(400)
            .send({
                success: false,
                message: "require all fields",
            })
        }
        const existingUser = await userModel.findById(user)
        if(!existingUser){
            return res.status(404)
            .send({
                message: "existing user not found",
                success: false
            })
        }
        const newBlog = new blogModel({
            title, description, image, user
        })
        console.log("this is existinguser:", existingUser)
        const session = await mongoose.startSession();
        session.startTransaction();
        await newBlog.save(newBlog);
        existingUser.blogs.push(newBlog)
        await existingUser.save({session});
        await session.commitTransaction();
        await newBlog.save() 
        return res.status(201)
        .send({
            success: true,
            message: "Blog created",
            newBlog
        })
    }
    catch(error){
        console.log(error)
        return res.status(400)
        .send({
            success: false,
            message: "some error occured while creating",
            error
        })
    }
}

//update blog 
exports.updateBlogByIdController = async(req, res)=>{
    try{
        const {title, description, image} = req.body
        const id = req.params.id
        console.log("this is req.body", id)
       console.log(title, description, image)
        const blog = await blogModel.findByIdAndUpdate(id, {
            title, description, image
        }, {new: true})
        console.log("THIS IS  updated blog:", blog)
        return res.status(200)
        .send({
            success: true,
            message: "blog updated successfully",
            blog
        })
    }
    catch(error){
        console.log("this catch error",error)
        return res.status(400)
        .send({
            success: false,
            message: "some error occured while updating",
            error
        })
    }
}

//single blog
exports.getBlogByIdController = async(req, res)=>{
    try{
        const id = req.params.id
        console.log(id)
        const blog = await blogModel.findById(id);
        console.log("found this blog",blog)
         if(!blog){
            return res.status(500)
            .send({
                message: "blog not found",
                success: false,
            })
         }
         return res.status(200)
         .send({
            success: true,
            message: "blog found successfully",
            blog
         })
    }
    catch(error){
        console(error)
        return res.status(500)
        .send({
            message: "Some error occured while getting blog",
            success: false,
            error
        })
    }
}

//Delete blog
exports.deleteBlogController = async(req, res)=>{
    try{
        console.log("hi this is blog contorlller")
        const id = req.params.id
        console.log("this id to be delete",id);
        if(!id){
             console.log("this id to be delete inside if block",id);
            return res.status(500)
            .send({
                message: "id to be delete not found",
                success: "false",    
            })
        }

        const deletedBlog = await blogModel.findByIdAndDelete(id,{new:true})
        const userId = deletedBlog.user;
        const user = await userModel.findById(userId)
        const filterBlogs = user.blogs.filter((blog)=>{
            return blog==deletedBlog._id
            
        })
        user.blogs= filterBlogs;
        await user.save()
        console.log("deleted")
        console.log("this is deleted blog", deletedBlog)
        return res.status(200)
        .send({
            message: "blog deleted successfully",
            success: true,
            deletedBlog
        })
    }
    catch(error){
        return res.status(500)
        .send({
            message: "some error occured while deleting blog",
            success: false,
            error
        })
    }

}

exports.userBlogController = async(req, res) => {
    try{
      const userblogs= await userModel.findOne(
        {
            _id: req.params.id
        }
      ).populate("blogs")
      const blogs = await blogModel.find({
        user: req.params.id
      })
    
        
    
        return res.status(200)
        .send({
            success: true,
            message: 'user blog found successfully',
            blogs: userblogs.blogs,
            // blogs
        })
    }
    catch(error){
        return res.status(501)
        console.log(error)
        .send({
            message: "some error occured",
            success: false,
            error
        })
    }
}