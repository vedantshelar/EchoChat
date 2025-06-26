require("dotenv").config();
const { getTokenData } = require("../utils");
const Message = require("../models/Message");
const Group = require("../models/Group");


const createGroup = async (req, res, next) => {
    try {
        const userId = getTokenData(req, next);
        const groupName = req.body.groupName;
        const group = new Group({ name: groupName, createdBy: userId });
        group.members.push(userId);
        await group.save();
        res.json({ success: "Group Created Successfully!" });
    } catch (error) {
        next(error)
    }
}

const destroyGroup = async (req, res, next) => {
    try {
        const userId = getTokenData(req, next);
        const groupId = req.params.groupId;
        const group = await Group.deleteOne({ createdBy: userId, _id: groupId });
        await Message.deleteMany({ group: groupId });
        console.log("Messages deleted after group deletion");
        if (group) {
            res.json({ success: `Group Has Been Deleted Successfully!` });
        } else {
            res.json({ error: `Some Error Occured While Deleting Group!` });
        }
    } catch (error) {
        next(error);
    }
}

const requestGroup = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.params.userId;
        await Group.findByIdAndUpdate(groupId, { $addToSet: { pendingRequests: userId } });
        res.json({ success: "Request Has Been Made!" });
    } catch (error) {
        next(error);
    }
}

const acceptUserRequest = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.params.userId;
        await Group.updateOne(
            { _id: groupId }, // condition to find the group
            {
                $addToSet: { members: userId },
                $pull: { pendingRequests: userId }
            }
        );
        res.json({ success: "User Request Has Been Accepted!" });
    } catch (error) {
        next(error);
    }
}

const rejectUserRequest = async (req, res, next) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.params.userId;
        await Group.updateOne(
            { _id: groupId }, // condition to find the group
            {
                $pull: { pendingRequests: userId }
            }
        );
        res.json({ success: "User Request Has Been Rejected!" });
    } catch (error) {
        next(error);
    }
}

const groupChats =  async (req, res, next) => {
    try {
        const senderId = req.params.senderId;
        const groupId = req.params.groupId;
        const group = await Group.findById(groupId);
        const memberIds = group.members.map(id => id.toString());
        const messages = await Message.find({
            $and: [
                {
                    $or: [
                        { sender: senderId, receiver: null },
                        { sender: { $in: memberIds }, receiver: null }
                    ]
                },
                { group: groupId }
            ]
        }).sort({ createdAt: 1 }).populate("sender");
        res.json(messages);
    } catch (error) {
        next(error)
    }
}

const getGroupById = async (req, res, next) => {
    try {
        const group = await Group.findById(req.params.groupId).populate("members");
        res.json(group);
    } catch (error) {
        next(error)
    }
}

const removeGroupMember = async (req, res, next) => {
    try {
        const userId = getTokenData(req, next);
        const group = await Group.findById(req.params.groupId);
        if (group) {
            if (group.createdBy == userId) {
                await Group.updateOne({_id:group._id},{$pull:{members:req.params.memberId}});
                res.json({ success: "Member has been removed!" });
            } else {
                res.json({ error: "You are not authorized to remove member" });
            }
        } else {
            res.json({ error: "Group Does Not Exists!" });
        }
    } catch (error) {
        next(error)
    }
}

const getAllGroups = async (req, res, next) => {
    try {
        const groups = await Group.find({});
        res.json(groups);
    } catch (error) {
        next(error)
    }
}

module.exports = {createGroup,destroyGroup,requestGroup,acceptUserRequest,rejectUserRequest,groupChats,getGroupById,removeGroupMember,getAllGroups}