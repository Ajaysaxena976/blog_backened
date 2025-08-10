const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
//create user register user
exports.registerController = async(req, res) =>{
    try{
        console.log( "this is req.body data",req.body)
        const {username, email, password} = req.body
        //validation
        if(!username || !email || !password){
            return res.status(400)
            .send({
                success: false,
                message: "Please fill all fields"
            })
        }

        //existing user checking 
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.status(401)
            .send({
                message: "user already exist",
                success: false
            })
        }
        //user ko store kra rahe hai db me 
         const hashPassword = await bcrypt.hash(password, 10)

        const user = new userModel({username, email, password: hashPassword});
       
        await user.save()
        return res.status(201)
        .send({
            success: true,
            message: 'New User Created',
            user,
        });
    }
    catch(error){
        console.log(error)
        return res.status(500)
        .send({
            message:'error in register callback',
            success: false,
            error
        })
    }
};


//get all users
exports.getAllUsers = async(req, res) =>{
    try{
       const users = await userModel.find({})
       return res.status(200)
       .send({
        message: "all user data",
        users,
        success: true,
        userCount: users.length,
       })
    }
    catch(error){
        console.log(error)
        return res.status(401)
        .send({
            success: false,
            message:"some error occured while getting user",
            error
        })
    }
};



//login
exports.loginController = async(req, res) =>{
    try{
        const {email, password} = req.body
        
        //validation
        if(!email || !password){
            return res.status(401)
            .send({
                success: false,
                messsage: 'Please proovide email or password'
            })
        }
        const user = await userModel.findOne({email})
        console.log("hi this is user",user);
        if(!user){
            return res.status(400)
            .send({
                success: false,
                message: 'email is not registerd'
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(401)
            .send({
                success: false,
                message: "invalid username or password"
            })
        }
        return res.status(200)
        .send({
            success: true,
            message:"login successfully",
            user
        })
    }   
    catch(error){
        return res.status(500)
        .send({
            success: false,
            message: "Error in Login Callback",
            error
        })
    }
};
