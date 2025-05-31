import { Server } from "socket.io";

export const connectToSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "https://linkify-ecru.vercel.app/", 
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true,
    },
  });

  let connections = {};
  let timeOnline = {};
  let messages = {};
  let usernames = {};

  io.on("connection", (socket) => {
    socket.on("join-call", (RoomId, username) => {
      if (connections[RoomId] === undefined) {
        connections[RoomId] = [];
      }
      usernames[socket.id] = username //saving usernames at server
      console.log("username:", username)
      connections[RoomId].push(socket.id);
      timeOnline[socket.id] = new Date();
      //for getting usernames of previously connected client for new user
     const existingUsername = Object.entries(usernames).filter(([id])=> id!=socket.id).map(([id, name])=>({socketId: id, userName: name })) //just destructure the array and give array of objects to existingUsers variables 

     socket.emit("existingUsers", existingUsername);
      console.log(existingUsername);
     //for sending username of current user to other users
      for(let a=0; a<connections[RoomId].length; a++){
        if(connections[RoomId][a]== socket.id) continue

        io.to(connections[RoomId][a]).emit(
          "username",
          socket.id,
          username
        )
      }

      for (let a = 0; a < connections[RoomId].length; ++a) {
        io.to(connections[RoomId][a]).emit(
          "user-joined",
          socket.id,
          connections[RoomId] // an array of clients in room
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
          if (clients[a] === socket.id) {
            key = room;

            for (let a = 0; a < connections[key].length; ++a) {
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
