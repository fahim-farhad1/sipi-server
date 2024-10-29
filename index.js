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
    const HomeBannersCollection = client.db("SIPI").collection("HomeBanner");
    const AboutUSCollection = client.db("SIPI").collection("AboutUS");
    const CampusCollection = client.db("SIPI").collection("Campus");
    const DepartmentCollection = client.db("SIPI").collection("Department");
    const ManagementCollection = client.db("SIPI").collection("Management");
    const TeachersCollection = client.db("SIPI").collection("Teachers");
    const GuestTestimonialsCollection = client
      .db("SIPI")
      .collection("Guest-Testimonials");
    const NoticesCollection = client.db("SIPI").collection("Notices");
    const TestimonialsCollection = client.db("SIPI").collection("Testimonials");
    const RoutineCollection = client.db("SIPI").collection("Routine");
    const TuitionFeeCollection = client.db("SIPI").collection("Tuition-Fee");

    // Fetch Request

    // Home Banner API
    // Get Home Banner
    app.get("/HomeBanners", async (req, res) => {
      const result = await HomeBannersCollection.find().toArray();
      res.send(result);
    });

    // Post Home Home Banner
    app.post("/HomeBanner", async (req, res) => {
      const request = req.body;
      const result = await HomeBannersCollection.insertOne(request);
      res.send(result);
    });

    // About US API
    // Get About US
    app.get("/AboutUS", async (req, res) => {
      const result = await AboutUSCollection.find().toArray();
      res.send(result);
    });

    // Post Home About US
    app.post("/AboutUS", async (req, res) => {
      const request = req.body;
      const result = await AboutUSCollection.insertOne(request);
      res.send(result);
    });

    // Campus API
    // Get Campus
    app.get("/Campus", async (req, res) => {
      const result = await CampusCollection.find().toArray();
      res.send(result);
    });

    // Post Campus
    app.post("/Campus", async (req, res) => {
      const request = req.body;
      const result = await CampusCollection.insertOne(request);
      res.send(result);
    });

    // Department API
    // Get Department
    app.get("/Department", async (req, res) => {
      const result = await DepartmentCollection.find().toArray();
      res.send(result);
    });

    // Post Department
    app.post("/Department", async (req, res) => {
      const request = req.body;
      const result = await DepartmentCollection.insertOne(request);
      res.send(result);
    });

    // Management API
    // Get Management
    app.get("/Management", async (req, res) => {
      const result = await ManagementCollection.find().toArray();
      res.send(result);
    });

    // Post Management
    app.post("/Management", async (req, res) => {
      const request = req.body;
      const result = await ManagementCollection.insertOne(request);
      res.send(result);
    });

    // Teachers API
    // Get Teachers
    app.get("/Teachers", async (req, res) => {
      const result = await TeachersCollection.find().toArray();
      res.send(result);
    });

    // Post Teachers
    app.post("/Teachers", async (req, res) => {
      const request = req.body;
      const result = await TeachersCollection.insertOne(request);
      res.send(result);
    });

    // Guest Testimonials API
    // Get Guest Testimonials
    app.get("/Guest-Testimonials", async (req, res) => {
      const result = await GuestTestimonialsCollection.find().toArray();
      res.send(result);
    });

    // Post Guest Testimonials
    app.post("/Guest-Testimonials", async (req, res) => {
      const request = req.body;
      const result = await GuestTestimonialsCollection.insertOne(request);
      res.send(result);
    });

    // Notices API
    // Get Notices
    app.get("/Notices", async (req, res) => {
      const result = await NoticesCollection.find().toArray();
      res.send(result);
    });

    // Post Notices
    app.post("/Notices", async (req, res) => {
      const request = req.body;
      const result = await NoticesCollection.insertOne(request);
      res.send(result);
    });

    // Testimonials API
    // Get Testimonials
    app.get("/Testimonials", async (req, res) => {
      const { department, position } = req.query; // Destructure query parameters

      // Build query object based on provided parameters
      const query = {};
      if (department) {
        query.department = department; // Filter by department if provided
      }
      if (position) {
        query.position = position; // Filter by position if provided
      }

      try {
        const result = await TestimonialsCollection.find(query).toArray(); // Query the collection
        res.send(result); // Send the filtered results
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // Post Testimonials
    app.post("/Testimonials", async (req, res) => {
      const request = req.body;
      const result = await TestimonialsCollection.insertOne(request);
      res.send(result);
    });

    // Routine API
    // Get Routine
    app.get("/Routine", async (req, res) => {
      const { session, semester, department } = req.query;

      // Create a filter object based on the provided query parameters
      const filter = {};

      if (session) {
        filter.session = session;
      }
      if (semester) {
        // Convert semester to a number
        filter.semester = parseInt(semester, 10); // Parse semester as an integer
      }
      if (department) {
        filter.department = department;
      }

      try {
        // Find routines based on the filter
        const result = await RoutineCollection.find(filter).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Error retrieving routines", error });
      }
    });

    // Post Routine
    app.post("/Routine", async (req, res) => {
      const request = req.body;
      const result = await RoutineCollection.insertOne(request);
      res.send(result);
    });

    // Tuition Fee API
    // Get Tuition Fee
    app.get("/Tuition-Fee", async (req, res) => {
      const { semester, department, session } = req.query;

      // Build a dynamic filter object based on the provided query parameters
      const filter = {};
      if (semester) {
        filter.semester = parseInt(semester, 10); // Ensure semester is stored as a number
      }
      if (department) {
        filter.department = department;
      }
      if (session) {
        filter.session = session;
      }

      try {
        const result = await TuitionFeeCollection.find(filter).toArray();
        res.send(result);
      } catch (error) {
        res
          .status(500)
          .send({ message: "Error retrieving tuition fees", error });
      }
    });

    // Post Tuition Fee
    app.post("/Tuition-Fee", async (req, res) => {
      const request = req.body;
      const result = await TuitionFeeCollection.insertOne(request);
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
