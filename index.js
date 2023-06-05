const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection  start 

console.log()

const uri = `mongodb+srv://${process.env.DB_ToyUser}:${process.env.DB_ToyPass}@cluster0.64cauca.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const imageGallery = client.db("toyMarket").collection("images");
    const toyData = client.db("toyMarket").collection("toyData");


    app.get('/images', async(req, res) =>{
        const cursor = imageGallery.find();
        const result = await cursor.toArray();
        res.send(result);
      })

      app.get('/toys', async(req, res) =>{
        const cursor = toyData.find();
        const result = await cursor.toArray();
        res.send(result);
      })

      app.get('/toys/:id', async(req, res) =>{
        const id = req.params.id;
        const query ={_id: new ObjectId(id)}
        const result = await toyData.findOne(query);
        res.send(result);
      })


      app.post('/toys', async(req, res) =>{
        const toy = req.body;
        const result = await toyData.insertOne(toy);
        console.log(toy);
        res.send(result);
      })
  
  




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




// MongoDB Connection end


app.get('/',(req,res)=>{
    res.send('Toy-Market-Server');
})
app.listen(port,()=>{
    console.log('Ha Ha Server Is Running');
})
