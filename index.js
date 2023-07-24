const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aokkp0c.mongodb.net/?retryWrites=true&w=majority`;

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

    const collegeCardCollection = client
      .db("collegeCollection")
      .collection("collegeData");

    const admissionCollection = client
      .db("collegeCollection")
      .collection("admission");

    // Colleges API

    app.get("/collegeData", async (req, res) => {
      const result = await collegeCardCollection.find().toArray();
      res.send(result);
    });

    // Admission API

    app.post("/admission", async (req, res) => {
      const body = req.body;
      body.createdAt = new Date();

      const result = await admissionCollection.insertOne(body);
      console.log(result);
      if (!body) {
        return res.status(404).send({ message: "body data not found" });
      }
      res.send(result);
    });

    // My College API
    app.get("/mycollege/:email", async (req, res) => {
      const result = await admissionCollection
        .find({ email: req.params.email })
        .toArray();
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
