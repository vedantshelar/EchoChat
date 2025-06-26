require("dotenv").config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

async function hashPassword(plainPassword) {
  const hash = await bcrypt.hash(plainPassword, 10);
    return hash;
}

async function compareHash(plainPassword,hashPassword) {
    const result = await bcrypt.compare(plainPassword, hashPassword);
    return result;
}

function createJwtToken(userId){
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn: "1d"});
    return token;
}

function isUserAuthenticated(req,res,next){
    const token = req.cookies.token;
    if(token){
        next();
    }else{
        res.json({error:"You Are Not Authenticated!"});
    }
}

function getTokenData(req,next){
    const token = req.cookies.token;
        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET);
            return decoded.userId;
        } catch (error) {
            next(error);
        }
}

module.exports = {hashPassword,compareHash,createJwtToken,isUserAuthenticated,getTokenData}