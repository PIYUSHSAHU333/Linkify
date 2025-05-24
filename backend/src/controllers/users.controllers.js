import { User } from "../models/users.model.js";
import httpstatus from "http-status";
import crypto from "crypto";
import bcrypt, { hash } from "bcrypt";
import { Meeting } from "../models/meetings.model.js";
import jwt from "jsonwebtoken";
import { ExpressErr } from "../utils/ExpressErr.js";
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
    throw new ExpressErr(httpstatus.BAD_REQUEST, "Provide all the details");
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new ExpressErr(httpstatus.NOT_FOUND, "User not found");
  }
  const isPassword = await bcrypt.compare(password, user.password);
  if (isPassword) {
    let token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.jwt_Secret,
      { expiresIn: "7d" }
    );
    console.log("token from login controller:", token);
    return res.status(httpstatus.OK).json({ token: token });
  } else {
    throw new ExpressErr(
      httpstatus.UNAUTHORIZED,
      "Invalid username or password"
    );
  }
};

const history = async (req, res, next) => {
  
  const { userId } = req.query;

  const user = await User.findById(userId);
  const Meetinghistory = await Meeting.find({ user_id: user._id });
  console.log("meetingHistory:",Meetinghistory);

  res.json(Meetinghistory);
};

const addHistory = async (req, res, next) => {
  const { token, meetingCode, userId } = req.body;
  const user = await User.findById( userId );
  const newMeeting = new Meeting({
    user_id: user._id,
    meetingCode: meetingCode,
  });
  console.log("newMeeting: ", newMeeting);
  await newMeeting.save();
  res.status(httpstatus.CREATED).json({ message: "Added code to history" }); //with axios can get this message via respone.data.message
};

const verify = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ExpressErr(httpstatus.UNAUTHORIZED, "Token missing or malformed");
  }
  try {
    let token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.jwt_Secret);
    return res.status(httpstatus.OK).json({ user: decoded });
  } catch (e) {
    throw new ExpressErr(httpstatus.UNAUTHORIZED, "Invalid or expired session");
  }
};
export { login, register, history, addHistory, verify };
