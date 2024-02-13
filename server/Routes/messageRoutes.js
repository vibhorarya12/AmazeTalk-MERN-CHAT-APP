const express = require("express");
const router = express.Router();
const {allMessages, sendMessage} = require("../Controllers/messageControllers");
const protect = require("../middleware/authMiddleWare");
router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect,sendMessage);

module.exports = router;
