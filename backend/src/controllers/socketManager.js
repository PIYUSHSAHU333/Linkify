import { Server } from "socket.io";

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", //only in development environment
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  io.on("connect", (socket) => {
    socket.on("join-call", (RoomId) => {
      if (connections[RoomId] === undefined) {
        connections[RoomId] = [];
      }
      connections[RoomId].push(socket.id);
      timeOnline[socket.id] = new Date();
  
      for (let a = 0; a < connections[RoomId].length; ++a) {
        io.to(connections[RoomId][a]).emit(
          "user-joined",
          socket.id,
          connections[RoomId]
        );
      }
  
      if (messages[RoomId] !== undefined) {
        for (let a = 0; a < messages[RoomId].length; ++a) {
          io.to(socket.id).emit(
            "chat-message",
            messages[RoomId][a]["data"],
            messages[RoomId][a]["sender"],
            messages[RoomId][a]["socket-id-sender"]
          );
        }
      }
    });
  
    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });
  
    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomvalue]) => {
          if (!isFound && roomvalue.includes(socket.id)) {
            return [roomKey, true];
          }
          return [room, isFound];
        },
        ["", false]
      );
  
      if (found === true) {
        if (messages[matchingRoom] === undefined) {
          messages[matchingRoom] = [];
        }
        messages[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        }); //Here we're pushing into db or temp storage
  
        connections[matchingRoom].forEach((element) => {
          io.to(element).emit("chat-message", data, sender, socket.id);
        });
      }
    });
  
    socket.on("disconnect", () => {
      var diffTime = Math.abs(timeOnline[socket.id] - new Date());
  
      var key;
  
      for (const [room, clients] of JSON.parse(
        JSON.stringify(Object.entries(connections)) //deep copy of connections object
      )) {
        for (let a = 0; a < clients.length; ++a) {
          if (v[a] === socket.id) {
            key = room;
  
            for (let a = 0; connections[key].length; ++a) {
              io.to(connections[key][a]).emit("user-left", socket.id);
            }
            const index = connections[key].indexOf(socket.id);
  
            connections[key].splice(index, 1);
  
            if (connections[key].length === 0) {
              delete connections[key];
            }
          }
        }
      }
    });
  });
  

  return io;
};

let connections = {};
let timeOnline = {};
let messages = {};

