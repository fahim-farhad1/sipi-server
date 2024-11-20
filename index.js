const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middle Ware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://sipi-website-da327.firebaseapp.com",
      "https://sipi-website-da327.web.app",
    ],
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
    // await client.connect();

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
    const BlogsCollection = client.db("SIPI").collection("Blogs");
    const ApplicantCollection = client.db("SIPI").collection("Applicant");

    // Fetch Request

    // Home Banner API
    // Get Home Banner
    app.get("/HomeBanners", async (req, res) => {
      const result = await HomeBannersCollection.find().toArray();
      res.send(result);
    });

    // Post Home Home Banner
    app.post("/HomeBanners", async (req, res) => {
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

    // Update Campus by ID
    app.put("/Campus/:id", async (req, res) => {
      const id = req.params.id; // Get the job ID from the request parameters
      const updatedData = req.body; // Data to update, sent from the client

      // Construct the query to find the job by its ID
      const query = { _id: new ObjectId(id) };

      // Construct the update object with the updated job data
      const update = {
        $set: updatedData, // Use $set to update the fields in the job document
      };

      try {
        // Perform the update in the database
        const result = await CampusCollection.updateOne(query, update);

        // Check if the update was successful
        if (result.modifiedCount > 0) {
          res.status(200).send({ message: "Job updated successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Job not found or no changes made." });
        }
      } catch (error) {
        console.error("Error updating the job:", error);
        res.status(500).send({
          message: "An error occurred while updating the job.",
          error,
        });
      }
    });

    // Delete an Campus by ID
    app.delete("/Campus/:id", async (req, res) => {
      const id = req.params.id; // Get the event ID from the request parameters
      const query = { _id: new ObjectId(id) }; // Construct the query to find the event by ID

      try {
        // Delete the event document from the collection
        const result = await CampusCollection.deleteOne(query);

        // Check if the event was deleted
        if (result.deletedCount > 0) {
          res.status(200).send({ message: "Event deleted successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Event not found or already deleted." });
        }
      } catch (error) {
        console.error("Error deleting the event:", error);
        res.status(500).send({ message: "Error deleting the event", error });
      }
    });

    // Department API
    app.get("/Department", async (req, res) => {
      const { departmentName } = req.query; // Extract departmentName from query parameters

      try {
        if (departmentName) {
          // Query the department by departmentName if provided
          const department = await DepartmentCollection.findOne({
            departmentName: departmentName,
          });

          if (department) {
            res.status(200).send(department); // If the department is found, return it
          } else {
            res.status(404).send({ message: "Department not found" }); // If the department does not exist
          }
        } else {
          // If no departmentName is provided, return all departments
          const departments = await DepartmentCollection.find().toArray();
          res.status(200).send(departments);
        }
      } catch (error) {
        res
          .status(500)
          .send({ message: "Error processing request", error: error.message });
      }
    });
    // New API to fetch all department names
    app.get("/DepartmentNames", async (req, res) => {
      try {
        // Query to get all departments but only select the departmentName field
        const departments = await DepartmentCollection.find(
          {},
          { projection: { departmentName: 1, _id: 0 } }
        ).toArray();

        // Extract department names into an array
        const departmentNames = departments.map(
          (department) => department.departmentName
        );

        res.status(200).send(departmentNames); // Send the array of department names as the response
      } catch (error) {
        res
          .status(500)
          .send({ message: "Error processing request", error: error.message });
      }
    });

    // Post Department
    app.post("/Department", async (req, res) => {
      const request = req.body;
      const result = await DepartmentCollection.insertOne(request);
      res.send(result);
    });

    // Update Department by ID
    app.put("/Department/:id", async (req, res) => {
      const id = req.params.id; // Get the job ID from the request parameters
      const updatedData = req.body; // Data to update, sent from the client

      // Construct the query to find the job by its ID
      const query = { _id: new ObjectId(id) };

      // Construct the update object with the updated job data
      const update = {
        $set: updatedData, // Use $set to update the fields in the job document
      };

      try {
        // Perform the update in the database
        const result = await DepartmentCollection.updateOne(query, update);

        // Check if the update was successful
        if (result.modifiedCount > 0) {
          res.status(200).send({ message: "Job updated successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Job not found or no changes made." });
        }
      } catch (error) {
        console.error("Error updating the job:", error);
        res.status(500).send({
          message: "An error occurred while updating the job.",
          error,
        });
      }
    });

    // Delete an Department by ID
    app.delete("/Department/:id", async (req, res) => {
      const id = req.params.id; // Get the event ID from the request parameters
      const query = { _id: new ObjectId(id) }; // Construct the query to find the event by ID

      try {
        // Delete the event document from the collection
        const result = await DepartmentCollection.deleteOne(query);

        // Check if the event was deleted
        if (result.deletedCount > 0) {
          res.status(200).send({ message: "Event deleted successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Event not found or already deleted." });
        }
      } catch (error) {
        console.error("Error deleting the event:", error);
        res.status(500).send({ message: "Error deleting the event", error });
      }
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

    // Update Management by ID
    app.put("/Management/:id", async (req, res) => {
      const id = req.params.id; // Get the job ID from the request parameters
      const updatedData = req.body; // Data to update, sent from the client

      // Construct the query to find the job by its ID
      const query = { _id: new ObjectId(id) };

      // Construct the update object with the updated job data
      const update = {
        $set: updatedData, // Use $set to update the fields in the job document
      };

      try {
        // Perform the update in the database
        const result = await ManagementCollection.updateOne(query, update);

        // Check if the update was successful
        if (result.modifiedCount > 0) {
          res.status(200).send({ message: "Job updated successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Job not found or no changes made." });
        }
      } catch (error) {
        console.error("Error updating the job:", error);
        res.status(500).send({
          message: "An error occurred while updating the job.",
          error,
        });
      }
    });

    // Delete an Management by ID
    app.delete("/Management/:id", async (req, res) => {
      const id = req.params.id; // Get the event ID from the request parameters
      const query = { _id: new ObjectId(id) }; // Construct the query to find the event by ID

      try {
        // Delete the event document from the collection
        const result = await ManagementCollection.deleteOne(query);

        // Check if the event was deleted
        if (result.deletedCount > 0) {
          res.status(200).send({ message: "Event deleted successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Event not found or already deleted." });
        }
      } catch (error) {
        console.error("Error deleting the event:", error);
        res.status(500).send({ message: "Error deleting the event", error });
      }
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

    // Update Teachers by ID
    app.put("/Teachers/:id", async (req, res) => {
      const id = req.params.id; // Get the job ID from the request parameters
      const updatedData = req.body; // Data to update, sent from the client

      // Construct the query to find the job by its ID
      const query = { _id: new ObjectId(id) };

      // Construct the update object with the updated job data
      const update = {
        $set: updatedData, // Use $set to update the fields in the job document
      };

      try {
        // Perform the update in the database
        const result = await TeachersCollection.updateOne(query, update);

        // Check if the update was successful
        if (result.modifiedCount > 0) {
          res.status(200).send({ message: "Job updated successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Job not found or no changes made." });
        }
      } catch (error) {
        console.error("Error updating the job:", error);
        res.status(500).send({
          message: "An error occurred while updating the job.",
          error,
        });
      }
    });

    // Delete an Teachers by ID
    app.delete("/Teachers/:id", async (req, res) => {
      const id = req.params.id; // Get the event ID from the request parameters
      const query = { _id: new ObjectId(id) }; // Construct the query to find the event by ID

      try {
        // Delete the event document from the collection
        const result = await TeachersCollection.deleteOne(query);

        // Check if the event was deleted
        if (result.deletedCount > 0) {
          res.status(200).send({ message: "Event deleted successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Event not found or already deleted." });
        }
      } catch (error) {
        console.error("Error deleting the event:", error);
        res.status(500).send({ message: "Error deleting the event", error });
      }
    });

    // Guest Testimonials API
    // Get Guest Testimonials
    app.get("/GuestTestimonials", async (req, res) => {
      const result = await GuestTestimonialsCollection.find().toArray();
      res.send(result);
    });

    // Post Guest Testimonials
    app.post("/GuestTestimonials", async (req, res) => {
      const request = req.body;
      const result = await GuestTestimonialsCollection.insertOne(request);
      res.send(result);
    });

    // Update GuestTestimonials by ID
    app.put("/GuestTestimonials/:id", async (req, res) => {
      const id = req.params.id; // Get the job ID from the request parameters
      const updatedData = req.body; // Data to update, sent from the client

      // Construct the query to find the job by its ID
      const query = { _id: new ObjectId(id) };

      // Construct the update object with the updated job data
      const update = {
        $set: updatedData, // Use $set to update the fields in the job document
      };

      try {
        // Perform the update in the database
        const result = await GuestTestimonialsCollection.updateOne(
          query,
          update
        );

        // Check if the update was successful
        if (result.modifiedCount > 0) {
          res.status(200).send({ message: "Job updated successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Job not found or no changes made." });
        }
      } catch (error) {
        console.error("Error updating the job:", error);
        res.status(500).send({
          message: "An error occurred while updating the job.",
          error,
        });
      }
    });

    // Delete an GuestTestimonials by ID
    app.delete("/GuestTestimonials/:id", async (req, res) => {
      const id = req.params.id; // Get the event ID from the request parameters
      const query = { _id: new ObjectId(id) }; // Construct the query to find the event by ID

      try {
        // Delete the event document from the collection
        const result = await GuestTestimonialsCollection.deleteOne(query);

        // Check if the event was deleted
        if (result.deletedCount > 0) {
          res.status(200).send({ message: "Event deleted successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Event not found or already deleted." });
        }
      } catch (error) {
        console.error("Error deleting the event:", error);
        res.status(500).send({ message: "Error deleting the event", error });
      }
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

    // Update Notices by ID
    app.put("/Notices/:id", async (req, res) => {
      const id = req.params.id; // Get the job ID from the request parameters
      const updatedData = req.body; // Data to update, sent from the client

      // Construct the query to find the job by its ID
      const query = { _id: new ObjectId(id) };

      // Construct the update object with the updated job data
      const update = {
        $set: updatedData, // Use $set to update the fields in the job document
      };

      try {
        // Perform the update in the database
        const result = await NoticesCollection.updateOne(query, update);

        // Check if the update was successful
        if (result.modifiedCount > 0) {
          res.status(200).send({ message: "Job updated successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Job not found or no changes made." });
        }
      } catch (error) {
        console.error("Error updating the job:", error);
        res.status(500).send({
          message: "An error occurred while updating the job.",
          error,
        });
      }
    });

    // Delete an Notices by ID
    app.delete("/Notices/:id", async (req, res) => {
      const id = req.params.id; // Get the event ID from the request parameters
      const query = { _id: new ObjectId(id) }; // Construct the query to find the event by ID

      try {
        // Delete the event document from the collection
        const result = await NoticesCollection.deleteOne(query);

        // Check if the event was deleted
        if (result.deletedCount > 0) {
          res.status(200).send({ message: "Event deleted successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Event not found or already deleted." });
        }
      } catch (error) {
        console.error("Error deleting the event:", error);
        res.status(500).send({ message: "Error deleting the event", error });
      }
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

    // Update Notices by ID
    app.put("/Testimonials/:id", async (req, res) => {
      const id = req.params.id; // Get the job ID from the request parameters
      const updatedData = req.body; // Data to update, sent from the client

      // Construct the query to find the job by its ID
      const query = { _id: new ObjectId(id) };

      // Construct the update object with the updated job data
      const update = {
        $set: updatedData, // Use $set to update the fields in the job document
      };

      try {
        // Perform the update in the database
        const result = await TestimonialsCollection.updateOne(query, update);

        // Check if the update was successful
        if (result.modifiedCount > 0) {
          res.status(200).send({ message: "Job updated successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Job not found or no changes made." });
        }
      } catch (error) {
        console.error("Error updating the job:", error);
        res.status(500).send({
          message: "An error occurred while updating the job.",
          error,
        });
      }
    });

    // Delete an Testimonials by ID
    app.delete("/Testimonials/:id", async (req, res) => {
      const id = req.params.id; // Get the event ID from the request parameters
      const query = { _id: new ObjectId(id) }; // Construct the query to find the event by ID

      try {
        // Delete the event document from the collection
        const result = await TestimonialsCollection.deleteOne(query);

        // Check if the event was deleted
        if (result.deletedCount > 0) {
          res.status(200).send({ message: "Event deleted successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Event not found or already deleted." });
        }
      } catch (error) {
        console.error("Error deleting the event:", error);
        res.status(500).send({ message: "Error deleting the event", error });
      }
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

    // Update Routine by ID
    app.put("/Routine/:id", async (req, res) => {
      const id = req.params.id; // Get the job ID from the request parameters
      const updatedData = req.body; // Data to update, sent from the client

      // Construct the query to find the job by its ID
      const query = { _id: new ObjectId(id) };

      // Construct the update object with the updated job data
      const update = {
        $set: updatedData, // Use $set to update the fields in the job document
      };

      try {
        // Perform the update in the database
        const result = await RoutineCollection.updateOne(query, update);

        // Check if the update was successful
        if (result.modifiedCount > 0) {
          res.status(200).send({ message: "Job updated successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Job not found or no changes made." });
        }
      } catch (error) {
        console.error("Error updating the job:", error);
        res.status(500).send({
          message: "An error occurred while updating the job.",
          error,
        });
      }
    });

    // Delete an Routine by ID
    app.delete("/Routine/:id", async (req, res) => {
      const id = req.params.id; // Get the event ID from the request parameters
      const query = { _id: new ObjectId(id) }; // Construct the query to find the event by ID

      try {
        // Delete the event document from the collection
        const result = await RoutineCollection.deleteOne(query);

        // Check if the event was deleted
        if (result.deletedCount > 0) {
          res.status(200).send({ message: "Event deleted successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Event not found or already deleted." });
        }
      } catch (error) {
        console.error("Error deleting the event:", error);
        res.status(500).send({ message: "Error deleting the event", error });
      }
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

    // Update Tuition-Fee by ID
    app.put("/Tuition-Fee/:id", async (req, res) => {
      const id = req.params.id; // Get the job ID from the request parameters
      const updatedData = req.body; // Data to update, sent from the client

      // Construct the query to find the job by its ID
      const query = { _id: new ObjectId(id) };

      // Construct the update object with the updated job data
      const update = {
        $set: updatedData, // Use $set to update the fields in the job document
      };

      try {
        // Perform the update in the database
        const result = await TuitionFeeCollection.updateOne(query, update);

        // Check if the update was successful
        if (result.modifiedCount > 0) {
          res.status(200).send({ message: "Job updated successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Job not found or no changes made." });
        }
      } catch (error) {
        console.error("Error updating the job:", error);
        res.status(500).send({
          message: "An error occurred while updating the job.",
          error,
        });
      }
    });

    // Delete an Tuition-Fee by ID
    app.delete("/Tuition-Fee/:id", async (req, res) => {
      const id = req.params.id; // Get the event ID from the request parameters
      const query = { _id: new ObjectId(id) }; // Construct the query to find the event by ID

      try {
        // Delete the event document from the collection
        const result = await TuitionFeeCollection.deleteOne(query);

        // Check if the event was deleted
        if (result.deletedCount > 0) {
          res.status(200).send({ message: "Event deleted successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Event not found or already deleted." });
        }
      } catch (error) {
        console.error("Error deleting the event:", error);
        res.status(500).send({ message: "Error deleting the event", error });
      }
    });

    // Blogs API
    // Get Blogs
    app.get("/Blogs", async (req, res) => {
      const result = await BlogsCollection.find().toArray();
      res.send(result);
    });

    // Get a blog by ID
    app.get("/Blogs/:id", async (req, res) => {
      const id = req.params.id; // Get the id from the request parameters
      try {
        const objectId = new ObjectId(id); // Convert the id string to a MongoDB ObjectId
        const result = await BlogsCollection.findOne({ _id: objectId }); // Query the collection
        if (result) {
          res.send(result); // Send the blog data as a response
        } else {
          res.status(404).send({ message: "Blog not found" }); // Blog not found
        }
      } catch (error) {
        res.status(500).send({ message: "Error retrieving blog", error }); // Handle invalid id or other errors
      }
    });

    // Post Blogs
    app.post("/Blogs", async (req, res) => {
      const request = req.body;
      const result = await BlogsCollection.insertOne(request);
      res.send(result);
    });

    // Update Blogs by ID
    app.put("/Blogs/:id", async (req, res) => {
      const id = req.params.id; // Get the job ID from the request parameters
      const updatedData = req.body; // Data to update, sent from the client

      // Construct the query to find the job by its ID
      const query = { _id: new ObjectId(id) };

      // Construct the update object with the updated job data
      const update = {
        $set: updatedData, // Use $set to update the fields in the job document
      };

      try {
        // Perform the update in the database
        const result = await BlogsCollection.updateOne(query, update);

        // Check if the update was successful
        if (result.modifiedCount > 0) {
          res.status(200).send({ message: "Job updated successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Job not found or no changes made." });
        }
      } catch (error) {
        console.error("Error updating the job:", error);
        res.status(500).send({
          message: "An error occurred while updating the job.",
          error,
        });
      }
    });

    // Delete an Blogs by ID
    app.delete("/Blogs/:id", async (req, res) => {
      const id = req.params.id; // Get the event ID from the request parameters
      const query = { _id: new ObjectId(id) }; // Construct the query to find the event by ID

      try {
        // Delete the event document from the collection
        const result = await BlogsCollection.deleteOne(query);

        // Check if the event was deleted
        if (result.deletedCount > 0) {
          res.status(200).send({ message: "Event deleted successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Event not found or already deleted." });
        }
      } catch (error) {
        console.error("Error deleting the event:", error);
        res.status(500).send({ message: "Error deleting the event", error });
      }
    });

    // Applicant API
    // Get Applicant
    app.get("/Applicant", async (req, res) => {
      const result = await ApplicantCollection.find().toArray();
      res.send(result);
    });

    // Post Applicant
    app.post("/Applicant", async (req, res) => {
      const request = req.body;
      const result = await ApplicantCollection.insertOne(request);
      res.send(result);
    });

    // Delete an Applicant by ID
    app.delete("/Applicant/:id", async (req, res) => {
      const id = req.params.id; // Get the event ID from the request parameters
      const query = { _id: new ObjectId(id) }; // Construct the query to find the event by ID

      try {
        // Delete the event document from the collection
        const result = await ApplicantCollection.deleteOne(query);

        // Check if the event was deleted
        if (result.deletedCount > 0) {
          res.status(200).send({ message: "Event deleted successfully!" });
        } else {
          res
            .status(404)
            .send({ message: "Event not found or already deleted." });
        }
      } catch (error) {
        console.error("Error deleting the event:", error);
        res.status(500).send({ message: "Error deleting the event", error });
      }
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
