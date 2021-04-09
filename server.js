// Dependencies
const express = require("express");
const fs = require("fs-extra");
const path = require("path");

const database = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Routes

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./db/db.json"));
});

app.get("/api/notes/:id", (req, res) => {
  res.send(getSpecificData(req.params.id));
});

app.post("/api/notes", (req, res) => {
  const data = getData();
  const writtenData = req.body;
  data.push(writtenData);
  saveData(data);
});

app.delete("/api/notes/:id", (req, res) => {
  const deletedData = req.body;
  database.splice(deletedData, 1);
  saveData(database);
})

app.get("/assets/js/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/assets/js/index.js"));
})

app.get("/assets/css/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/assets/css/styles.css"));
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

function getData() {
  const data = fs.readFileSync("./db/db.json");
  return JSON.parse(data) ;
}

function getSpecificData(id) {
  const data = database[id];
  return data;
}

function saveData(data) {
  let count = 0;
  const idData = data.map(item => {
    item["id"] = `${count}`;
    count++;
    return item;
  })
  const stringify = JSON.stringify(idData);
  fs.writeFile("./db/db.json", stringify);
}

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));