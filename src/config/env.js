require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 4000,
  mongoURI: process.env.MONGODB,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET,
};
