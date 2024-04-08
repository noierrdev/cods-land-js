const mongoose=require('mongoose')
const {MongoGridFS} = require('mongo-gridfs');
const Grid = require('gridfs-stream');

module.exports=()=>{
    // Connect to MongoDB
    const MONGODB_URI=`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@64.23.176.68:27017/codsland`;
    mongoose.connect(MONGODB_URI, {});
    
    const db = mongoose.connection;
    require('../models');
    /////////////////////
    require("../apps/grander/models")
    // Handle MongoDB connection events
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
        global.gridfs = new MongoGridFS(mongoose.connections[0],"upload");
        // global.gridfs=Grid(mongoose.connection.db,mongoose.mongo);
        // global.gridfs.collection('uploads');
        console.log('Connected to MongoDB');
    });
}
