const express = require("express");
const bodyParser = require("body-parser");
const {MongoClient} = require("mongodb");
const ejs = require('ejs');
const {connectToDb, getDb} = require(__dirname + "/db.js");
const punny = require(__dirname + "/punFuns.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
let listId = "";

connectToDb((err) => {
  if (!err) {

      app.listen(3000, () => {
          console.log("server is up and running");
      });

      db = getDb();
  }
});


async function firstObject() {
  
  try {

    const cursor = db.collection("todolist")
    .find({_id:1})

    const firstObjectArray = await cursor.toArray();
    return firstObjectArray[0];

  } catch(err) {
    console.log({err: "error in connection to db"});
  }
}


app.get("/", (req, res) => {

  homeRoute();

  async function homeRoute() {
    const listObject = await firstObject();
    listIds = Object.getOwnPropertyNames(listObject);
    res.render("index", {listTitle: "home", listIds: listIds});
  }

});


app.get("/:listId", (req, res) => {

  listId = req.params.listId;
  
 if (listId === "/") {
   res.redirect("/");
  }
  
  renderList(listId);
  async function renderList (listId) {
    
    checkList = (listId) => {
      return listId;
    }
    const listObject = await firstObject();
    console.log(listObject.hasOwnProperty([listId]));
    
    if(listObject.hasOwnProperty([listId])) {
      console.log("hello"+listId)
      
      let listItems = listObject[listId];
      res.render("list", {listId: listId, listItems: listItems});
      console.log(listItems);
      res.status(200);

    } else {
      res.redirect("/")
    }
  }  
});


app.post("/createlist", (req, res) => {

  const listId = punny.lowDash(req.body.newListTitle);
  
  creatList(listId);
  async function creatList (listId) {
    const listObject = await firstObject();
    
    if(listObject.hasOwnProperty([listId])) {
      res.redirect(listId);
    } else {
      db.collection("todolist")
      .updateOne({_id: 1}, {$push: {[listId]:"sample list item"}});
      console.log(listObject)
      res.redirect(listId);
    }
  }
});

app.post("/deletelist", (req, res) => {

  listId = req.body.delListBtn

  deleteList(listId)

  async function deleteList(listId) {
    console.log(listId)
    db.collection("todolist")
    .updateOne({_id:1}, { $unset: {[listId]: 1 } }, { multi: true })
    res.redirect("/")

  }

})

app.post("/", (req, res) => {

  const item = req.body.newItem;

  listId = req.body.itemSubBtn;
  console.log(listId)
  console.log(item)

  if (req.body.list == listId) {

    postList(listId, item)
    .catch((err) => {
      res.status(500).json({err: "could not insert to the document"});
    });

    async function postList(listId, item) {
      db.collection("todolist")
      .updateOne({_id: 1}, {$push: {[listId]:item}});
      res.redirect(listId);
    }

 } else {

    postList(listId,item)
    .catch((err) => {
      res.status(500).json({err: "could not insert to the document"});
    });

    async function postList(listId,item) {
      db.collection("todolist")
      .updateOne({_id: 1}, {$push: {[listId]:item}});
      res.redirect(listId);
    }
  }

});

app.post("/deleteItem", (req, res) => {

  let checkMark = req.body.checkMark;
  listId = req.body.delItemBtn;
  console.log(checkMark)
  console.log(listId)
  
  delList(listId, checkMark)
  .catch((err) => {
    res.status(500).json({err: "could not fetch the documents"})});
    
    async function delList(listId, checkMark) {
      
      const cursor = db.collection("todolist")
      .find({_id: 1},{listId:1, _id:0})
      
      results = await cursor.toArray();
      delItem = results[0][listId][checkMark];
      console.log(listId)

      console.log(delItem);

      db.collection("todolist")
      .updateOne({_id: 1}, {$pull: {[listId]:delItem}});

    res.redirect(listId);

  }
})


app.get("/about", function(req, res){
  res.render("about");
});