const express = require('express');
const cors=require('cors');
const { listen } = require('express/lib/application');
require('dotenv').config();
const app=express();
const port=process.env.Port || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');


//middleWare
app.use(cors())
app.use(express.json())
/// mongodb Collection



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rykcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  async function run(){
     try{
        await client.connect();
        const collection = client.db("dress").collection("dresscollection");
        // get api
        app.get('/product',async(req,res)=>{
            const query={};
            const cursor= collection.find(query)
            const product=await cursor.toArray();
            res.send(product);

        });
        // post api
        app.post('/product',async(req,res)=>{
        const data=req.body;
        console.log(data);
        const result=await collection.insertOne(data)
        res.send(result);
            
        })
      

     }finally{ }

}
run().catch(console.dir);
  
  // perform actions on the collection object
//   client.close();






app.get('/',(req,res)=>{
    res.send('running server')
});
app.listen(port,()=>{
    console.log('listion',port)
})