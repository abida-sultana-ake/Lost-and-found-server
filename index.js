const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri =
  "mongodb+srv://lost_and_found:arMmR2mhsCAllq5S@cluster0.ux6cwua.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("lost_and_found");
    const lostCollection = db.collection("lost");
    const foundCollection = db.collection("found");

    // -------------------- LOST ITEMS --------------------

    // GET all lost items
    app.get("/lost", async (req, res) => {
      try {
        const items = await lostCollection.find().toArray();
        res.json(items);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch lost items" });
      }
    });

    // GET single lost item
    app.get("/lost/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const item = await lostCollection.findOne({ _id: new ObjectId(id) });
        if (!item)
          return res.status(404).json({ message: "Lost item not found" });
        res.json(item);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch lost item" });
      }
    });

    // POST new lost item
    app.post("/lost", async (req, res) => {
      try {
        const newItem = req.body;
        if (!newItem.name || !newItem.description)
          return res
            .status(400)
            .json({ message: "Name and description required" });

        const result = await lostCollection.insertOne(newItem);
        res.status(201).json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create lost item" });
      }
    });

    // PUT update lost item
    app.put("/lost/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updateData = req.body;
        const result = await lostCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );
        if (result.matchedCount === 0)
          return res.status(404).json({ message: "Lost item not found" });
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update lost item" });
      }
    });

    // DELETE lost item
    app.delete("/lost/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await lostCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0)
          return res.status(404).json({ message: "Lost item not found" });
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete lost item" });
      }
    });

    // -------------------- FOUND ITEMS --------------------

    // GET all found items
    app.get("/found", async (req, res) => {
      try {
        const items = await foundCollection.find().toArray();
        res.json(items);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch found items" });
      }
    });

    // GET single found item
    app.get("/found/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const item = await foundCollection.findOne({ _id: new ObjectId(id) });
        if (!item)
          return res.status(404).json({ message: "Found item not found" });
        res.json(item);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch found item" });
      }
    });

    // POST new found item
    app.post("/found", async (req, res) => {
      try {
        const newItem = req.body;
        if (!newItem.name || !newItem.description)
          return res
            .status(400)
            .json({ message: "Name and description required" });

        const result = await foundCollection.insertOne(newItem);
        res.status(201).json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create found item" });
      }
    });

    // PUT update found item
    app.put("/found/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updateData = req.body;
        const result = await foundCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );
        if (result.matchedCount === 0)
          return res.status(404).json({ message: "Found item not found" });
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update found item" });
      }
    });

    // DELETE found item
    app.delete("/found/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await foundCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0)
          return res.status(404).json({ message: "Found item not found" });
        res.json(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete found item" });
      }
    });

    // Test route
    app.get("/", (req, res) => {
      res.send("Lost and Found API is running...");
    });

    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

run().catch(console.dir);
