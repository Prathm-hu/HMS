const express = require('express')
const connectToDb = require('./config/db');
const userRouter = require('./controllers/user.controller');
const app = express()
require('dotenv').config()

app.use(express.json());
app.use('/user',userRouter)

app.listen(process.env.PORT,()=>{
    connectToDb();
    console.log(`Server is running on port ${process.env.PORT}`)
})