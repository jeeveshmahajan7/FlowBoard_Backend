const app = require("./app");
const { initializeDatabase } = require("./db/db.connect");
const { PORT, mongoURI, NODE_ENV } = require("./config/env");

const startServer = async () => {
  await initializeDatabase(mongoURI);

  if (NODE_ENV !== "production") {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  }
};

startServer();

module.exports = app; // IMPORTANT for Vercel
