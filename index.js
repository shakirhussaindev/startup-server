const express = require("express");
const app = express();
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(express.json())
app.use(cors())

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function run() {
  try {
    await client.connect();

    // Database and Database Collections
    const db = client.db(process.env.STARTUP_DB);
    const opportunitiesCollection = db.collection('opportunities')
    const startupCollection = db.collection("startup")
    const userCollection = db.collection('user')
    const applicationCollection = db.collection('applications')


    app.get('/api/users', async(req,res)=>{
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    // Opportunities related api
    app.post("/api/opportunities", async (req,res) =>{
      const opportunity = req.body
      const newOpportunity = {...opportunity, createdAt: new Date()}
      const result = await opportunitiesCollection.insertOne(newOpportunity)
      res.send(result)
    });

    app.get("/api/startup/opportunities", async (req, res) => {
      const query = {};
      if (req.query.startupId) {
        query.startupId = req.query.startupId;
      }
      const cursor = opportunitiesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    
    app.get("/api/opportunities", async (req, res) =>{
      
      const cursor = opportunitiesCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    });

    app.get('/api/opportunities/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await opportunitiesCollection.findOne(query)
      res.send(result)
    })

    // Application related apis
    app.post('/api/applications', async(req,res)=>{
      const application = req.body
      const applyingTime = {...application, createdAt: new Date()}
      const result = await applicationCollection.insertOne(applyingTime)
      res.send(result)
    })

    // Startup related api
    app.get('/api/startup', async(req,res) =>{
      const cursor = startupCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.post("/api/startup", async(req,res)=>{
      const startup = req.body
      const newStartup = { ...startup, createdAt: new Date() };
      const result = await startupCollection.insertOne(newStartup)
      res.send(result)
    })

    app.get("/api/my/startup", async (req, res) => {
      const query = {};
      if (req.query.founderId) {
        query.founderId = req.query.founderId;
      }
      const result = await startupCollection.findOne(query);
      res.send(result || {});
    });


    // Verify MongoDB connection
    await client.db("admin").command({ ping: 1 });

    console.log("Ping your deployment. MongoDB connected successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

run().catch(console.dir);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
