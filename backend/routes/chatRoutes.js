const express = require("express");
const router = express.Router();
const {
  accessChat,
  fetchChats,
  sendMessage,
  allMessages,
} = require("../controllers/chatController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/send").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

module.exports = router;
