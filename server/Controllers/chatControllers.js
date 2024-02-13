const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");
const handler = require("express-async-handler");

const accessChat = handler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("user id not sent in params");
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("users", "-password")
        .populate("latestMessage.sender", "name email");
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
});

const fetchChats = handler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updateAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const fetchGroups = handler(async (req, res) => {
  try {
    const allGroups = await Chat.where("isGroupChat").equals(true);
    res.status(200).send(allGroups);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const createGroupChat = handler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Data is insufficient" });
  }

  var users = req.body.users;
  console.log("chatController/createGroups : ", req);
  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const groupExit = handler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});
const addSelfGroup = handler(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});
const addMemberToGroup = handler(async (req, res) => {
  const { groupId, usersToAdd } = req.body;

  if (
    !groupId ||
    !usersToAdd ||
    !Array.isArray(usersToAdd) ||
    usersToAdd.length === 0
  ) {
    return res.status(400).send({ message: "Invalid data provided" });
  }

  try {
    const updatedGroup = await Chat.findByIdAndUpdate(
      groupId,
      { $addToSet: { users: { $each: usersToAdd } } }, // Using $addToSet and $each to ensure uniqueness
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updatedGroup) {
      return res.status(404).send({ message: "Group not found" });
    }

    res.status(200).json(updatedGroup);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

const getUsersInGroup = handler(async (req, res) => {
  const { groupId } = req.body;

  if (!groupId) {
    return res.status(400).send({ message: "Invalid data provided" });
  }

  try {
    const group = await Chat.findById(groupId).populate(
      "users",
      "name _id image"
    );

    if (!group) {
      return res.status(404).send({ message: "Group not found" });
    }

    const adminId = group.groupAdmin ? group.groupAdmin._id : null;
    const userMappings = group.users.map((user) => ({
      userId: user._id,
      username: user.name,
      userImage: user.image,
    }));
    const userNamesSet = new Set(group.users.map((user) => user.name));
    const userNames = Array.from(userNamesSet);

    res.status(200).json({ adminId, userNames, userMappings });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = {
  accessChat,
  fetchChats,
  fetchGroups,
  createGroupChat,
  groupExit,
  addSelfGroup,
  addMemberToGroup,
  getUsersInGroup,
};
