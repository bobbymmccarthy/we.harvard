const { MongoClient, ServerApiVersion } = require("mongodb");

const Db = process.env.ATLAS_URI;

console.log(Db)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(Db, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,
      deprecationErrors: true,
    }
  });

// const client = new MongoClient(Db, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
 
var _db;
 
module.exports = {
  connectToServer: function (callback) {
    console.log("Hello.");
    client.connect();
    client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    // client.connect(function (err, db) {
    //   // Verify we got a good "db" object
    //   if (db)
    //   {
    //     console.log("before db");
    //     client.db("admin").command({ ping: 1 });
    //     // _db = db.db("employees");
    //     console.log("Successfully connected to MongoDB."); 
    //   }
    //   else { console.log("fml.");}
    //   return callback(err);
    //      });
  },
 
  getDb: function (dbName) {
    return client.db(dbName);
  }
};