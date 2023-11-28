const mongoose=require('mongoose')

module.exports=()=>{
    // Connect to MongoDB
    mongoose.connect('mongodb://localhost:27017/codsland', {});
    
    const db = mongoose.connection;
    require('../models')
    // Handle MongoDB connection events
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
        console.log('Connected to MongoDB');
    });
}
