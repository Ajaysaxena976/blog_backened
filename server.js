const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const colors = require('colors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')

//env configuration
dotenv.config()

//router import
const userRoutes = require('./routes/userRoutes')
const blogRoutes = require('./routes/blogRoutes')
//mongoDb connection
connectDB()
const app = express()

//middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


//routes
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/blog', blogRoutes)

app.get('/',(req,res)=>{
    return res.send("hello")
})
//listen
app.listen(process.env.PORT , ()=>{
    console.log(`Server is running on ${process.env.PORT}`.bgCyan.white)
})