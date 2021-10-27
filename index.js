const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()

const app = express();
const port = 5000;

//middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zbufa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try{
     await client.connect()
    
     const database = client.db('carMechanic')
     const servicesCollection =database.collection('services')

    //GEt Api
    app.get('/services', async(req, res) => {
        const cursor = servicesCollection.find({});
        const services = await cursor.toArray();
        res.send(services)
    })
   
    // get single service
    app.get('/services/:id', async(req, res) => {
        const id = req.params.id;
        console.log('getting specific service')
        const query = { _id : ObjectId(id) }
        const service = await servicesCollection.findOne(query);
        res.json(service)
    })

    // delete api 
    app.delete('/services/:id', async(req, res) => {
        const id =req.params.id;
        const query = { _id: ObjectId(id)}
        const result = await servicesCollection.deleteOne(query)
        res.json(result)
    })
     // Post Api 
     app.post('/services', async(req, res) => {

       const service = req.body;
        console.log('hit the post api', service);

         const result = await servicesCollection.insertOne(service)
         console.log(result)
        res.json(result)
     });
  }
  finally{
      //await client.close();
  }
}
run().catch(console.dir)



app.get('/', async(req, res) => {
    res.send('Running Geninus Server')
})

app.listen(port, () => {
    console.log('Running Genius Server on port', port)
})