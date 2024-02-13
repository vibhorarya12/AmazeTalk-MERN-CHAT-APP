const express = require("express");
const Router = express.Router();
const protect = require("../middleware/authMiddleWare");
const {
  accessChat,
  fetchChats,
  fetchGroups,
  createGroupChat,
  groupExit,
  addSelfGroup,
  addMemberToGroup,
  getUsersInGroup
} = require("../Controllers/chatControllers");
Router.route("/").post(protect, accessChat);
Router.route("/").get(protect, fetchChats);
Router.route("/createGroup").post(protect, createGroupChat);
Router.route("/fetchGroups").get(protect, fetchGroups);
Router.route("/groupExit").put(protect, groupExit);
Router.route("/addSelfToGroup").put(protect, addSelfGroup);
Router.route("/addMember").put(protect, addMemberToGroup);
Router.route("/groupInfo").post(protect,getUsersInGroup );
module.exports = Router;
