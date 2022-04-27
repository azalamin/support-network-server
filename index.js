const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

// use middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.coipt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const activityCollection = client
      .db("supportNetwork")
      .collection("activities");
    const supporterCollection = client
      .db("supportNetwork")
      .collection("supporter");
    const eventCollection = client.db("supportNetwork").collection("event");

    // get all activities data
    app.get("/activity", async (req, res) => {
      const query = {};
      const cursor = activityCollection.find(query);
      const activities = await cursor.toArray();
      res.send(activities);
    });

    // Post supporter data
    app.post("/supporter", async (req, res) => {
      const data = req.body;
      const result = await supporterCollection.insertOne(data);
      res.send(result);
    });

    // get all supporter data
    app.get("/supporter", async (req, res) => {
      const query = {};
      const cursor = supporterCollection.find(query);
      const supporters = await cursor.toArray();
      res.send(supporters);
    });

    // Delete supporter data
    app.delete("/supporter", async (req, res) => {
      const id = req.query.eventId;
      const query = { _id: ObjectId(id) };
      const result = await supporterCollection.deleteOne(query);
      res.send(result);
    });

    // Post Event
    app.post("/event", async (req, res) => {
      const data = req.body;
      const result = await eventCollection.insertOne(data);
      res.send(result);
    });

    // Read Event Data
    app.get("/event", async (req, res) => {
      const query = {};
      const cursor = eventCollection.find(query);
      const events = await cursor.toArray();
      res.send(events);
    });

    app.delete("/event", async (req, res) => {
      const id = req.query.eventId;
      const query = { _id: ObjectId(id) };
      const result = await eventCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Support Network Server is running");
});

app.listen(port, () => {
  console.log("Listening to the port", port);
});
