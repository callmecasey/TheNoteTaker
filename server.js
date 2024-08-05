const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// API Routes
app.get("/api/notes", (req, res) => {
  console.log("GET request to /api/notes");
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the db.json file:", err);
      res.status(500).json({ error: "Failed to read notes" });
      return;
    }
    res.json(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  console.log("POST request to /api/notes", req.body);
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the db.json file:", err);
      res.status(500).send("Error reading note data.");
      return;
    }
    const notes = JSON.parse(data);
    const newNote = { ...req.body, id: Date.now().toString() };
    notes.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error("Error writing to db.json file:", err);
        res.status(500).send("Error saving note.");
        return;
      }
      res.json(newNote);
    });
  });
});

// HTML Routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// Make sure this is last to avoid catching API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
