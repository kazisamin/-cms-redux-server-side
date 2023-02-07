require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ztiwwse.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("techVise");
    const postCollection = db.collection("post");

    app.get("/posts", async (req, res) => {
      const cursor = postCollection.find({});
      const post = await cursor.toArray();

      res.send({ status: true, data: post });
    });



    app.post("/post", async (req, res) => {
      const post = req.body;

      const result = await postCollection.insertOne(post);

      res.send(result);
    });

    app.delete("/post/:id", async (req, res) => {
      const id = req.params.id;

      const result = await postCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });

    app.get('/posts/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await postCollection.findOne(query);
      res.send(user);
    });

    app.get('/read/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await postCollection.findOne(query);
      res.send(user);
    });

    app.put("/post/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) }
      const post = req.body;
      const option = { upsert: true }
      const updatedpost = {
        $set: {
          tag: post.tag,
        }
      }
      const result = await postCollection.updateOne(filter, updatedpost, option);
      res.send(result);
    });

  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
