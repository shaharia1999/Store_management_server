const express = require('express');
const cors=require('cors');
const { listen } = require('express/lib/application');
const bodyParser = require('body-parser')
require('dotenv').config();
const app=express();
const port=process.env.PORT || 5000;
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

//middleWare
app.use(cors())
app.use(bodyParser.json())
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

       

        
       // get by id
        app.get('/product/:id',async(req,res)=>{
          const id=req.params.id;
          // const query={_id:ObjectId(id)}
          // console.log("query",query);
          const result=await collection.findOne({_id: id});
        
          console.log(result)
          if(result){  
            res.send(result)
          }else{
            res.send("nothing")
          }
      })
    

        // post api
        app.post('/product',async(req,res)=>{
        const data=req.body;
        console.log(data);
        const result=await collection.insertOne(data)
        res.send(result);
       
            
        });
     /// put api
        app.put('/product/reduce/:id',async(req,res)=>{
          const id=req.params.id;
          const data=req.body;
          console.log(data);
          const filter =  {_id: id} ;
          console.log("filter",filter);
          const options = { upsert: false };
          const updateDoc = {
             $inc: { quantity: -1 } }
            const result = await collection.updateOne(filter, updateDoc, options);
            res.send(result);
      })
   
  

      app.put('/product/increase/:id',async(req,res)=>{
        const id=req.params.id;
        const data=req.body;
        console.log("data",data);
        const filter =  {_id: id} ;
        console.log("filter",filter);
        const options = { upsert: false };
        const updateDoc = {
          $inc: { quantity: Number(data.amount || 0)}
                   }
        try{
            const result = await collection.updateOne(filter, updateDoc, options);
            res.send(result);
        }catch(e){
            res.send("failed to update");
        }
          
    })
     
    
      // delete api
      app.delete('/product/:id',async(req,res)=>{
          const id=req.params.id;
          const filter={_id:ObjectId(id)};
          const result = await collection.deleteOne(filter);
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