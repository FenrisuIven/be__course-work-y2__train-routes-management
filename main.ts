const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.status(201).json({ msg: "Hello World!" });
})

app.listen(3000, () => console.log("Server is listening on: http:\\\\localhost:3000"));