// ===== IMPORT MODULES =====
const express = require("express"); //import express
const path = require("path"); //import path modules, needed for functions having to do with file paths
const dotenv = require("dotenv");
const { MongoClient, ObjectId } = require("mongodb"); //import mongo client, get the mongoclient class objects so we can create one
dotenv.config(); //load the environment variables from the .env file

const app = express(); //create express application
const port = process.env.PORT || "8888"; //set up port number

// ===== CREATE NEW MONGO CLIENT =====
const dbUrl = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPWD}@${process.env.DBHOST}/testdb/?retryWrites=true&w=majority&appName=http5222`;
let db;

// ===== SETTINGS FOR EXPRESS APP =====
app.set("views", path.join(__dirname, "views")); //view settings (unrelated to the actual folder)
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

// ===== SET UP SCHEMA AND MODEL =====
const collectionName = "vinyls";

// ===== SET UP PAGE ROUTE =====
//render home page
app.get("/", async (request, response) => {
  response.render("index", { title: "Vinyl Reverie | Home" }); //to pass in variables Eg. json object
});

//render about page
app.get("/about", async (request, response) => {
  response.render("about", { title: "About" }); //to pass in variables Eg. json object
});

//render shop page
app.get("/shop", async (request, response) => {
  let records = await getVinyls();
  console.log(records);
  response.render("shop", { title: "Shop", vinyls: records }); //to pass in variables Eg. json object
});

//add page for quick add record
app.get("/add", async (request, response) => {
  //add a new record
  await addRecord("People", "Code Kunst", 55, "people.jpg");
  response.redirect("/shop");
});

app.get("/", async (request, response) => {
  //at the root of project
  // response.status(200).send("Test");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
}); //to run server

// ===== MONGO DB FUNCTIONS =====
async function connection() {
  const client = new MongoClient(dbUrl); //create the MongoClient
  db = client.db("testdb");
  return db;
}

//function to get vinyl data collection -> To be passed to SHOP Page
async function getVinyls() {
  db = await connection();
  let results = db.collection("vinyls").find({});
  return await results.toArray();
}

//function to add a record to the vinyls collection
async function addRecord(recordName, recordArtist, recordPrice, recordImage) {
  db = await connection();
  let status = await db.collection("vinyls").insertOne({
    name: recordName,
    artist: recordArtist,
    price: recordPrice,
    image: recordImage,
  });
}
