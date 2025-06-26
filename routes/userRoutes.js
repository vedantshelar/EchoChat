const express = require("express");
const router = express.Router({ mergeParams: true });
const { isUserAuthenticated } = require("../utils");
const { registerUser, loginUser, logoutUser, getUserDataFromToken, getCurrentUserData, getUserById, getReceiverData, getUserChats, getAllUserData } = require("../controllers/userControllers");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", isUserAuthenticated, logoutUser)

router.get("/tokenData", isUserAuthenticated, getUserDataFromToken);

router.get("/getCurrentUserData", isUserAuthenticated, getCurrentUserData);

router.get("/:userId", isUserAuthenticated, getUserById)

router.get("/getReceiverData/:receiverId", isUserAuthenticated, getReceiverData)

router.get("/chat/:senderId/:receiverId", getUserChats)


router.get("/:userId/all", isUserAuthenticated, getAllUserData)


module.exports = router;