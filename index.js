const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Lost and found on the way");
});

app.listen(port, ()=> {
    console.log(`Lost and foud server is running on port ${port}`)
})