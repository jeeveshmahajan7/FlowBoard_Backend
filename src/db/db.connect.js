const mongoose = require("mongoose");

let isConnected = false;

const initializeDatabase = async (mongoURI) => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log("✅ Connected to the database");
  } catch (error) {
    console.log("❌ Error connecting to the database:", error.message);
    throw error;
  }
};

module.exports = { initializeDatabase };
