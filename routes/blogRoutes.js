const express = require('express')
const { getAllBlogController, createBlogController, updateBlogByIdController, getBlogByIdController, deleteBlogController, userBlogController } = require('../controllers/blogController')

//router object
const router = express.Router()

//routes
//Get  all blogs
router.get('/all-blogs', getAllBlogController)

//Post create blog
router.post('/create-blog/:id', createBlogController)

//put update blog
router.put('/update-blog/:id', updateBlogByIdController)

//get single blog details
router.get('/get-blog/:id', getBlogByIdController)

//Delete blog
router.delete('/delete-blog/:id', deleteBlogController)


//user blog
router.get('/user-blog/:id', userBlogController)
module.exports = router