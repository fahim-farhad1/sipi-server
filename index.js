const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middle Ware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@sipi-website.lish8.mongodb.net/?retryWrites=true&w=majority&appName=SIPI-Website`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Collections
    const BannersCollection = client.db("SIPI").collection("Banners");

    // Fetch Request

    // Banner API
    // Get Banner
    app.get("/Banners", async (req, res) => {
      const result = await BannersCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Set up the basic route
app.get("/", (req, res) => {
  res.send("Diploma project is Running");
});

// Listen on the specified port
app.listen(port, () => {
  console.log(`Diploma project is Running on Port: ${port}`);
});

// User: psazzadul1205
// Password: l1kKVfoIeUmVk1c0
