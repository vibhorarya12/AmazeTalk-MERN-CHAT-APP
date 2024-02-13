const express = require("express");
const userModel = require("../Models/userModel");
const handler = require("express-async-handler");
const generateToken = require("../Config/generateToken");

const loginController = handler(async (req, res) => {
  const { name, password } = req.body;
  const user = await userModel.findOne({ name });
  if (user && (await user.matchPassword(password))) {

    const imageBase64 = user.image ? user.image.toString('base64') : null;
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      image : imageBase64,
      token: generateToken(user._id),
      
    };
    res.json(response);
  } else {
    res.status(401);
    throw new Error("invalid username and password");
  }
});

//registration controller///
const registerController = handler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const image = req.file;

    if (!name || !email || !password) {
      res.status(400).json({ error: "Blank fields" });
      return;
    }

    // Check if the email already exists
    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    // Check for username
    const userExist = await userModel.findOne({ name });
    if (userExist) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }

    // Create entry in the database
    let user;
    if (image) {
      user = await userModel.create({
        name,
        email,
        password,
        image :image.buffer,
      });
    } else {
      user = await userModel.create({ name, email, password });
    }

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: "Registration error" });
    }
  } catch (error) {
    console.error("Registration failed:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const fetchAllUsersController = handler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await userModel.find(keyword).find({
    _id: { $ne: req.user._id },
  });
  res.send(users);
});

module.exports = { registerController, loginController , fetchAllUsersController};
