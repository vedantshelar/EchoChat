const express = require("express");
const router = express.Router({ mergeParams: true });
const { isUserAuthenticated } = require("../utils");
const { createGroup, destroyGroup, requestGroup, acceptUserRequest, rejectUserRequest, groupChats, getGroupById, removeGroupMember, getAllGroups } = require("../controllers/groupControllers");


router.post("/create", isUserAuthenticated, createGroup)

router.get("/all", isUserAuthenticated,getAllGroups)

router.delete("/destroy/:groupId", isUserAuthenticated, destroyGroup)

router.get("/request/:groupId/:userId", requestGroup)

router.get("/accept/request/:groupId/:userId", acceptUserRequest)

router.get("/reject/request/:groupId/:userId", rejectUserRequest)

router.get("/chat/:groupId/:senderId", groupChats)

router.get("/:groupId", isUserAuthenticated, getGroupById)

router.delete("/:groupId/:memberId", isUserAuthenticated, removeGroupMember);

module.exports = router;