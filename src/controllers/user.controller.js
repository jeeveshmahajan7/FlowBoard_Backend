const User = require("../models/user.model");

const searchUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";

    // find users where name or email contains search text irrespective of the case
    const users = await User.find({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("name email"); // Never return password

    res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchUsers };
