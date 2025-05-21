import { User } from "../models/users.model.js";
import httpstatus from "http-status";
import crypto from "crypto";
import bcrypt, { hash } from "bcrypt";
import { Meeting } from "../models/meetings.model.js";
import jwt from "jsonwebtoken";
const register = async (req, res) => {
  console.log("register api");
  const { username, name, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res
      .status(httpstatus.FOUND)
      .json({ message: "Username already exists" });
  }

  const hashedPassword = await brycpt.hash(password, 10);

  const newUser = new User({
    name: name,
    password: hashedPassword,
    username: username,
  });
  await newUser.save();
  res.status(httpstatus.CREATED).json({ message: "User registered" });
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please provide all the details" });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(httpstatus.NOT_FOUND).json({ message: "User not found" });
  }
  const isPassword = await bcrypt.compare(password, user.password);
  if (isPassword) {
    let token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.jwt_Secret,
      { expiresIn: "7d" }
    );
    console.log("token from login controller:", token);
    return res.status(httpstatus.OK).json({token: token});
  } else {
   return res
      .status(httpstatus.UNAUTHORIZED)
      .json({ message: "Invalid username or password" });
  }
};

const history = async (req, res) => {
  console.log("history hit")
  const { userId } = req.query;
  // console.log(userId,"userid from history")
  try {
    const user = await User.findById( userId );
    if (!user) {
      console.log("User not found illah");
    } else if (user) {
      console.log("User found:", user);
    }
    const Meetinghistory = await Meeting.find({ user_id: user._id });
    // console.log("meetingHistory from backend: ", Meetinghistory);
    res.json(Meetinghistory);
  } catch (e) {
    res.json(`Something went wrong: ${e}`);
  }
};

const addHistory = async (req, res) => {
  const { token, meetingCode, userId } = req.body;
  try {
    const user = await User.findById({userId});
    console.log("user from addhistory with its user._id:", user, user._id);
    const newMeeting = new Meeting({
      user_id: user._id,
      meetingCode: meetingCode,
    });
    console.log("newMeeting: ", newMeeting);
    await newMeeting.save();
    res.status(httpstatus.CREATED).json({ message: "Added code to history" }); //with axios can get this message via respone.data.message
  } catch (e) {
    res.json({ message: `Something went wrong: ${e}` });
  }
};

const verify = async (req, res) => {
  // console.log("verification hit")
  try {
    const  authHeader  = req.headers.authorization;
    // console.log("auth header:",authHeader);
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(httpstatus.UNAUTHORIZED).json({message: 'Token missing or malformed'})
    }
    let token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.jwt_Secret)
    // console.log("verification controller, decoded: ", decoded);
    return res.status(httpstatus.OK).json({user: decoded})
  } catch (e) {
    console.log(e)
    return res.status(httpstatus.UNAUTHORIZED).json({message: "Invalid or expired session"});
  }
};
export { login, register, history, addHistory, verify };
