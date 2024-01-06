const express = require("express");
require("dotenv").config();
const app = express();
const connectDB = require("./db/conn");
const cookieParser = require("cookie-parser");

connectDB();
require("./db/conn");

const Products = require("./models/productsSchema");
const DefaultData = require("./defaultdata");
const cors = require("cors");
const router = require("./routes/router");

app.use(express.json());
app.use(cookieParser(""));
app.use(cors());
app.use(router);
const port = 8005;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
DefaultData();
