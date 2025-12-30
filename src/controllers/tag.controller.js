const Tag = require("../models/tag.model");

const createTag = async (req, res, next) => {
  try {
    const tag = new Tag(req.body);
    const savedTag = await tag.save();

    res
      .status(201)
      .json({ message: "Tag created successfully", tag: savedTag });
  } catch (error) {
    next(error);
  }
};

const getAllTags = async (req, res, next) => {
  try {
    const tags = await Tag.find();

    res
      .status(200)
      .json({ message: "Fetched tags successfully", count: tags.length, tags });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTag,
  getAllTags,
};
