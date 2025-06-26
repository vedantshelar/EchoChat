const User = require("../models/User");
const { hashPassword, compareHash, createJwtToken, getTokenData } = require("../utils");
const Message = require("../models/Message");

const registerUser = async (req, res, next) => {
    try {
        const user = req.body;
        const hash = await hashPassword(user.password);
        user.password = hash;
        const newUser = new User(user);
        await newUser.save();
        const token = createJwtToken(newUser._id);
        res.cookie("token", token, {
            httpOnly: true,          // Prevent access from JavaScript (secure)
            secure: true,           // Set to true if using HTTPS
            sameSite: "none",         // Helps prevent CSRF
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.json({ success: "User Accout Has been created Successfully! Welcome" });
    } catch (error) {
        next(error);
    }
}

const loginUser = async (req, res, next) => {
    try {
        const user = req.body;
        const dbUser = await User.findOne({ username: user.username });
        if (!dbUser) {
            res.json({ error: "Enter a valid username!" });
        } else {
            const result = await compareHash(user.password, dbUser.password);
            if (result) {
                const token = createJwtToken(dbUser._id);
                res.cookie("token", token, {
                    httpOnly: true,          // Prevent access from JavaScript (secure)
                    secure: true,           // Set to true if using HTTPS
                    sameSite: "none",         // Helps prevent CSRF
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                });
                res.json({ success: "Logged in successfully!" });
            } else {
                res.json({ error: "Incorrect Password!" });
            }
        }
    } catch (error) {
        next(error);
    }
}

const logoutUser = async (req, res, next) => {
    try {
        const userId = getTokenData(req, next);
        await User.findByIdAndUpdate(userId, { isOnline: false });
        res.clearCookie("token", {
            httpOnly: true,          // Prevent access from JavaScript (secure)
            secure: true,           // Set to true if using HTTPS
            sameSite: "none",         // Helps prevent CSRF
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.json({ success: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
}

const getUserDataFromToken = async (req, res, next) => {
    const userId = getTokenData(req, next);
    res.json({ userId });
}

const getCurrentUserData = async (req, res, next) => {
    const userId = getTokenData(req, next);
    const user = await User.findById(userId);
    res.json(user);
}

const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        res.json(user);
    } catch (error) {
        next(error)
    }
}

const getReceiverData = async (req, res, next) => {
    try {
        const receiver = await User.findById(req.params.receiverId);
        res.json(receiver);
    } catch (error) {
        next(error);
    }
}

const getUserChats = async (req, res, next) => {
    try {
        const senderId = req.params.senderId;
        const receiverId = req.params.receiverId;
        const messages = await Message.find({ $or: [{ sender: senderId, receiver: receiverId }, { sender: receiverId, receiver: senderId }] }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (error) {
        next(error)
    }
}

const getAllUserData = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.userId } });
        res.json(users);
    } catch (error) {
        next(error);
    }
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    getTokenData,
    getUserDataFromToken,
    getCurrentUserData,
    getUserById,
    getReceiverData,
    getUserChats,
    getAllUserData
}