require('dotenv').config();
const express=require('express');
const http=require('http')
const cors=require('cors');
const bodyParser=require('body-parser');

require('./configs/database')();

const app=express();

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON data
app.use(bodyParser.json());

// Middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require('./middlewares/auth.middleware'))

app.use(`/${process.env.BASE_URL}`,require('./routers'));

const server=http.createServer(app);

server.listen(process.env.HTTP_PORT,()=>{
    console.log(`Backend Started on PORT:${process.env.HTTP_PORT}`);
})

