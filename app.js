const express = require("express");
require("dotenv").config();
const app = express();

const connectDB = require("./db/conn");
const cookieParser = require("cookie-parser");

require("./db/conn");

const Products = require("./models/productsSchema");
const DefaultData = require("./defaultdata");
const cors = require("cors");
const router = require("./routes/router");
const errorMiddleware = require("./middleware/error_middleware");

const allowedOrigins = [
  "https://bespoke-brioche-fac046.netlify.app/",
  `${process.env.CORS_ORIGIN}`,
  "http://localhost:3000",

  // Add more origins as needed
];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("req is from ", origin);
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error(`Not allowed by CORS ${origin}`)); // Block the request
    }
  },
  methods: "GET, POST, DELETE, PATCH, HEAD",
  credentials: true,
};
// app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(""));
app.use(cors(corsOptions));
app.use(router);

// error middleware
app.use(errorMiddleware);
const PORT = process.env.PORT || 8005;
app.listen(PORT, () => {
  connectDB();
  console.log(`server is running on port ${PORT}`);
});
DefaultData();
