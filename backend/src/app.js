import express from "express";
import { createServer } from "node:http";
import "dotenv/config";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";
import cors from "cors";
import userRoutes from "./routes/users.routes.js";
const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.get("/", async (req, res) => {
  res.json({ hello: "world" });
});
const corsOption = {
  origin: ["https://linkify-ecru.vercel.app", "https://linkify-ecru.vercel.app/"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.set("port", process.env.PORT || 8080);
app.use(cors(corsOption));
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));
app.use("/api/v1/users", userRoutes);

//Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

const start = async () => {
  const connectionDb = await mongoose.connect(process.env.MongoUrl);
  console.log(`Mongo connected DB HOST: ${connectionDb.connection.host}`);
  server.listen(app.get("port"), () => {
    console.log("Listening on port 8080");
  });
};

start();
