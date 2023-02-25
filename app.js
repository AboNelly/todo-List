// global Variables
const express = require("express");
const port = 4000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
let ejs = require("ejs");
const _ = require("lodash");
// app.use
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.set("strictQuery", false);

mongoose.connect(
  "mongodb+srv://sobarbouy:Fun4ever@cluster0.unucywk.mongodb.net/todolistDB"
);

const itemsSchema = {
  name: String,
};
const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your todo List.",
});
const item2 = new Item({
  name: "Hit the + button to add a new item.",
});
const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("list", listSchema);

// root page
app.get("/", (req, res) => {
  Item.find({}, (err, results) => {
    if (results.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to DB");
        }
      });
      res.redirect("/");
    } else {
      res.render("List", { listTitle: "Today", newListItems: results });
    }
    // console.log(results);
  });
  // let day = date();
});

app.post("/", (req, res) => {
  const itemName = req.body.newInput;
  const listName = req.body.list;

  const item = new Item({ name: itemName });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, result) => {
      result.items.push(item);
      result.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", (req, res) => {
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;
  console.log(listName);

  if (listName === "Today") {
    console.log(checkedItemID);
    Item.findByIdAndDelete(checkedItemID, (err) => {
      err ? console.log("Error Occurred") : console.log("deleted Successfully");
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemID } } },
      (err, result) => {
        res.redirect("/" + listName);
      }
    );
  }
});

// work page
app.get("/:route", (req, res) => {
  const route = _.capitalize(req.params.route);

  List.findOne({ name: route }, (err, result) => {
    if (!err) {
      if (!result) {
        const list = new List({
          name: route,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + route);
      } else {
        res.render("List", {
          listTitle: result.name,
          newListItems: result.items,
        });
      }
    } else {
      console.log("error");
    }
  });
});

app.get("/about", function (req, res) {
  res.render("about");
});

//app.listen to make sure server is working
app.listen(port, () => {
  console.log("listening on port " + port);
});

console.log("fale7");
