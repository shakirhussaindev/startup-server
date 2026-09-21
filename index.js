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



    app.post("/api/opportunities", async (req,res) =>{
      const opportunity = req.body
      const opportunityDate = {...opportunity, createdAt: new Date()}
      const result = await opportunitiesCollection.insertOne(opportunityDate)
      res.send(result)
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
