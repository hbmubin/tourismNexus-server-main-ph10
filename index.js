const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.Port || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jweumb2.mongodb.net/?retryWrites=true&w=majority`;

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

    const spotCollection = client.db("spotDB").collection("spot");

    // load  spots
    app.get("/spot", async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // details spot
    app.get("/spot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.findOne(query);
      res.send(result);
    });

    // add spot
    app.post("/spot", async (req, res) => {
      const newSpot = req.body;
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    });

    // update spot
    app.put("/spot/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedSpot = req.body;
      const spot = {
        $set: {
          spotName: updatedSpot.spotName,
          photo: updatedSpot.photo,
          description: updatedSpot.description,
          country: updatedSpot.country,
          location: updatedSpot.location,
          cost: updatedSpot.cost,
          season: updatedSpot.season,
          travel: updatedSpot.travel,
          visitors: updatedSpot.visitors,
        },
      };
      const result = await spotCollection.updateOne(filter, spot, options);
      res.send(result);
    });

    //    delete spot
    app.delete("/spot/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Nexus is Running");
});

app.listen(port, () => {
  console.log(`Nexus is running on : ${port}`);
});
