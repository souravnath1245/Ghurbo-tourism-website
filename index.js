const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
require("dotenv").config();

app.use(cors());
app.use(express.json());
// LoggerLevel
// userName : tourism-project
// password : pGZs0Ropb2Fp8q01

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nnyci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);

async function run() {
  try {
    await client.connect();

    const database = client.db("Gurbo");
    const databaseCollection = database.collection("Destination");
    const databaseClient = database.collection("Various-Client");

    // Get Api :
    app.get("/destination/users", async (req, res) => {
      const users = databaseClient.find({});
      const result = await users.toArray();
      res.send(result);
    });

    app.get("/destination", async (req, res) => {
      const cursor = databaseCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/destination/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await databaseCollection.findOne(query);
      console.log("Load User with ", id);
      res.send(result);
    });
    //Post Api :
    app.post("/destination", async (req, res) => {
      const newUser = req.body;
      const result = await databaseCollection.insertOne(newUser);
      console.log("Hitting the post ", result);
      res.json(result);
    });

    app.post("/destination/users", async (req, res) => {
      const client = req.body;
      const result = await databaseClient.insertOne(client);
      console.log("Hitting The Client Post ", result);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Wellcome to my server");
});

app.listen(port, () => {
  console.log("server is running ", port);
});
