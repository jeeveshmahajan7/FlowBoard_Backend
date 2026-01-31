const express = require("express");
const cors = require("cors");

const errorHandler = require("./middlewares/error.middleware");

// Importing routes
const taskRoutes = require("./routes/task.routes");
const teamRoutes = require("./routes/team.routes");
const projectRoutes = require("./routes/project.routes");
const tagRoutes = require("./routes/tag.routes");
const reportRoutes = require("./routes/report.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ FlowBoard backend is operational" });
});

// Using routes
app.use("/tasks", taskRoutes);
app.use("/teams", teamRoutes);
app.use("/projects", projectRoutes);
app.use("/tags", tagRoutes);
app.use("/report", reportRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.use(errorHandler);

module.exports = app;
