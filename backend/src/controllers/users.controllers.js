import { User } from "../models/users.model.js";
import httpstatus from "http-status"
import crypto from "crypto"
import brycpt, { hash } from "bcrypt";
const register = async(req, res)=>{
    console.log("register api")
    const {username, name, password} = req.body;
    
    const existingUser = await User.findOne({username});
    if(existingUser){
        return res.status(httpstatus.FOUND).json({message: "Username already exists"});
    }

    const hashedPassword = await brycpt.hash(password, 10); 

    const newUser = new User({
        name: name,
        password: hashedPassword,
        username: username
    });
     await newUser.save();
    res.status(httpstatus.CREATED).json({message:"User registered"});
}

const login = async(req, res)=>{
    const{username, password} = req.body;

    if(!username || !password){
        return res.status(400).json({message: "Please provide all the details"});
    }

    const user = await User.findOne({username});

    if(!user){
        res.status(httpstatus.NOT_FOUND).json({message: "User not found"});
    }
    const isPassword =  await brycpt.compare(password, user.password)
    if(isPassword){
        let token = crypto.randomBytes(20).toString("hex");
        user.token = token;
        await user.save();
        return res.status(httpstatus.OK).json({token: token})
    }else{
        res.status(httpstatus.UNAUTHORIZED).json({message: "Invalid username or password"})
    }
    
}
export {login, register}