const mongoose = require('mongoose');

const connectToDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Connected to MongoDB')
        } catch (error) {
            console.log('Error connecting to MongoDB')
            }
}

module.exports = connectToDb;