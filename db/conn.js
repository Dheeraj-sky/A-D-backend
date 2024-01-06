const mongoose = require("mongoose");
const colors = require("colors");

const DB = process.env.DATABASE;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`error: ${error.message}`);
    // console.log(error);
    process.exit();
  }
};
module.exports = connectDB;
