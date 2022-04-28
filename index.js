const express = require('express');
const cors=require('cors');
const { listen } = require('express/lib/application');
require('dotenv').config();
const app=express();
const port=process.env.Port || 5000;


//middleWare
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.send('running server')
});
app.listen(port,()=>{
    console.log('listion',port)
})