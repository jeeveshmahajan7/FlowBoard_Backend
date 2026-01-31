const express = require("express");
const router = express.Router();

const verifyJWT = require("../middlewares/auth.middleware");
const { searchUsers } = require("../controllers/user.controller");

// Search users (Protected)
router.get("/", verifyJWT, searchUsers);

module.exports = router;
