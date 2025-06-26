require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const cookie = require("cookie");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const User = require("./models/User");
const Message = require("./models/Message");


const app = express();
const SECRET = process.env.JWT_SECRET;

//db connection

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('CHATAPP DB is connected!'));

const server = http.createServer(app); // create HTTP server

const io = new Server(server, {
    cors: {
        origin: process.env.REACT_APP_URL,// allow frontend
        credentials: true //allow cookies to be sent from client
    },
});

server.listen(process.env.PORT_NO, () => {
    console.log("Server running on "+process.env.PORT_NO);
});

// middlewares 

app.use(express.static("public"));
app.use(cors({
    origin: process.env.REACT_APP_URL,
    credentials: true
}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

//routes

app.use("/user",userRoutes);
app.use("/group",groupRoutes);

//socket.io

const userSocketMap = {};

// Socket.IO JWT auth middleware
io.use((socket, next) => {
    const cookies = socket.handshake.headers.cookie;
  
    if (!cookies) return next(new Error("No cookies found"));
  
    const { token } = cookie.parse(cookies);
  
    if (!token) return next(new Error("Authentication error"));
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error("Invalid token"));
  
      socket.userId = decoded.userId; // Attach user info to socket
      next();
    });
  });

io.on("connection",async(socket)=>{
    await User.findByIdAndUpdate(socket.userId,{isOnline:true});
    userSocketMap[socket.userId] = socket.id;

    socket.on("private-message",async({from,to,content,count,groupId=null})=>{
        const receiverSocketId = userSocketMap[to];
        const senderSocketId = userSocketMap[from];
        if(groupId===null){
            const message = new Message({sender:from,receiver:to,content:content});
            await message.save();
            if(receiverSocketId){
                socket.to(receiverSocketId).emit("receive-private-message",content);
            }
        }else{
            if(count===0){
                const message = new Message({sender:from,content:content,group:groupId});
                await message.save();
            }
            if(receiverSocketId){
                socket.to(receiverSocketId).emit("receive-private-message",content);
            }
        }
    })
      // Listen for disconnect
  socket.on("disconnect", (reason) => {
    delete userSocketMap[socket.userId];
  });
})

app.use((error,req,res,next)=>{
    console.log(error);
    res.json({error:"Error Middleware"});
});

