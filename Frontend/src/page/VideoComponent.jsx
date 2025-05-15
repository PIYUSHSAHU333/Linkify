import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button, IconButton, Badge } from "@mui/material";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallEndIcon from "@mui/icons-material/CallEnd";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import ChatIcon from "@mui/icons-material/Chat";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import styles from "../Styles/VideoComponent.module.css";
import io from "socket.io-client";

import { Input } from "postcss";
var connections = {};

// Configuration for WebRTC's RTCPeerConnection
// The "iceServers" array contains the STUN server configuration used for NAT traversal.
// STUN (Session Traversal Utilities for NAT) helps peers discover their public IP address and port
// so they can connect to each other directly, even if they're behind firewalls or routers.
//
// In this case, we are using Google's public STUN server (stun.l.google.com:19302) to assist in this process.
// This configuration is passed to the RTCPeerConnection to enable peer-to-peer communication, such as video calls or file sharing.
const peerConfigConnections = {
  iceservers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function VideoMeetingComponent() {
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");
  const [otherUsernames, setOtherUsernames] = useState({});
  const [videoAvailable, setVideoAvailable] = useState(); //this represents our permission of video or audio from our device
  const [audioAvailable, setAudioAvailable] = useState();
  const [audio, setAudio] = useState(); //this represent multiple streams from other users
  const [video, setVideo] = useState([]); //this will be an array bc there will be streams of multiple users(video confrencing)
  const [screenAvailable, setScreenAvailable] = useState();
  let [newMessages, setNewMessages] = useState(0);
  const [showModal, setShowModal] = useState(true);
  let [messages, setMessages] = useState([]);
  let [screen, setScreen] = useState();
  let [message, setMessage] = useState("");
  let [videos, setVideos] = useState([]);
  let localVideoRef = useRef();
  var socketRef = useRef();
  let socketIdRef = useRef();
  const videoRef = useRef([]);
  const bottomRf = useRef(null)
  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  useEffect(()=>{
      if(bottomRf.current){
        bottomRf.current.scrollIntoView({behaviour: "smooth"});
      }
  }, [messages])
  let getDislayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true })
          .then(getDislayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  let getDislayMediaSuccess = (stream) => {
    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          getUserMedia();
        })
    );

    console.log("HERE");
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }
  };

  const gotMsgFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type == "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => {
                      console.log(e);
                    });
                })
                .catch((e) => {
                  console.log(e);
                });
            }
          })
          .catch((e) => console.log(e));
      }
      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let connectToSocketServer = async () => {
    socketRef.current = io.connect("http://localhost:8080", { secure: false }); //represents client side socket connection (current)

    socketRef.current.on("signal", gotMsgFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href, username);
      socketRef.current.on("existingUsers", (existingUsername) => {
        setOtherUsernames((latestOtherUsername) => {
          const updatedUsernames = { ...latestOtherUsername };
          existingUsername.forEach(({ socketId, userName }) => {
            updatedUsernames[socketId] = userName;
          });
          console.log("updated username: ", updatedUsernames);
          return updatedUsernames;
        });
      });
      socketRef.current.on("username", (userId, username) => {
        setOtherUsernames((latestOtherUsername) => ({
          ...latestOtherUsername,
          [userId]: username,
        }));
      });

      socketIdRef.current = socketRef.current.id; //socket id that we get for each client on connection with server given by socket.io (so socketIdRef is the id of curr user)

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((prevVideo) =>
          prevVideo.filter((video) => video.socketId !== id)
        ); //we're filtering out video of that user which has left, also used callback as we need most recent value array, if many users left at same time then react can batch up the setVideo and will not give us most recent array but we need most recent array so callback func as here our new array value depends on previous
        // connections[id].close();
        delete connections[id];
      });
      socketRef.current.on("user-joined", (socketId, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection( //new connected user is making peerConnection with other laready existing clients (or users) in the room
            peerConfigConnections
          ); //!!!???doubtToBeAsked!!!???

          connections[socketListId].onicecandidate = (event) => {
            //.onicecandidate is an event that is triggered when ice candidate (ask chatGpt) is found for any peer
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate }) // We're sending ICE info to the other peer so they can use it to establish a direct connection with us.
              );
            }
          };

          connections[socketListId].onaddstream = (event) => {
            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId
            );
            //checking if some user b and c are already connected to us but maybe sending new stream bc of refresh, connecctivity issue etc
            if (videoExists) {
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video
                );
                return updatedVideos;
              });
            } else {
              //if they are sending their stream for first time then we'll create new video obj of then in our videos
              let newVideo = {
                socketId: socketListId,
                stream: event.stream,
                autoplay: true, // Auto-play the video as soon as it’s added
                playsinline: true, //is useful for mobile devices to play video inline (not full screen)
              };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          if (window.localStream != undefined && window.localStream != null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            connections[socketListId].addStream(window.localStream);
          }

          if (socketId === socketIdRef.current) {
            //if current user is the one just joined, bc for other user(eg: B) socketId would be of A who just joined but socketIdRef would be own socket id
            for (let id2 in connections) {
              //id2 is representing other users in the connections obj
              if (id2 === socketIdRef.current) continue; //if the loop iterate over me then obv i wont connect to myself so skip

              try {
                connections[id2].addStream(window.localStream);
              } catch (e) {}
              connections[id2].createOffer().then((description) => {
                connections[id2]
                  .setLocalDescription(description)
                  .then(() => {
                    socketRef.current.emit(
                      "signal",
                      id2,
                      JSON.stringify({ sdp: connections[id2].localDescription })
                    );
                  })
                  .catch((e) => console.log(e));
              });
            }
          }
        });
      });
    });
  };

  useEffect(() => {
    const getUserMedia = async () => {
      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMediaStream;
          }
        }
      }
    };

    getUserMedia();
  }, [videoAvailable, audioAvailable]);

  const getPermission = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (screen !== true) {
      if (video != undefined && audio != undefined) {
        getUserMedia();
        console.log("SET STATE HAS", video, audio);
      }
    }
  }, [video, audio]);

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => {
          console.log(e);
        });
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      } catch (e) {
        console.log("getUserMedia error:", e);
      }
    }
  };

  const getMedia = async () => {
    setAudio(audioAvailable);
    setVideo(videoAvailable);
    connectToSocketServer();
  };
  useEffect(() => {
    getPermission();
  }, []);

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }
    console.log("userMediaSuccess");
    window.localStream = stream;
    localVideoRef.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      connections[id].addStream(window.localStream);

      connections[id].createOffer().then((description) => {
        console.log(description);
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoRef.current.srcObject = window.localStream;

          for (let id in connections) {
            connections[id].addStream(window.localStream);

            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };

  let silence = () => {
    //ask GPt on any confusion
    let ctx = new AudioContext(); //creates a container for all sound activity to be happened in that box
    let oscillator = ctx.createOscillator(); //this simply means creating different sound(not creating rn, it'll happen with oscillator.start())
    let dst = oscillator.connect(ctx.createMediaStreamDestination()); //this simply means converting that sound to a media stream
    oscillator.start(); //creating sound
    ctx.resume(); // un-pausing the sound(bc by default in an audio context browser mutes sound)
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false }); //getting the created audio track from obj=>dst.stream.getAudioTracks()[0] this is an object we then copy it's property through object.assign and assign one more property that is enabled: false which means mute
  };
  let black = ({ width = 640, height = 480 } = {}) => {
    //pretty easy
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    }); //creating a canvas and also assigning some height and width to it
    let stream = canvas.captureStream(); //It's like recording whatever is there on canvas and storing it in stream(canvas.captureStream() return object)
    return Object.assign(stream.getVideoTracks()[0], { enabled: false }); //assigning that object 'stream.getVideoTracks()[0]' enabled:false to mute the stream
  };
  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let sendMessage = () => {
    console.log("Send message");
    // console.log(socketRef.current);
    socketRef.current.emit("chat-message", message, username);
    setMessage("");

    // this.setState({ message: "", sender: username })
  };

  let handleVideo = () => {
    setVideo(!video);
    // getUserMedia();
  };
  let handleAudio = () => {
    setAudio(!audio);
    // getUserMedia();
  };
  let handleEndCall = () => {
    localStorage.removeItem("username");
    localStorage.clear();
    try {
      let tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    window.location.href = "/";
  };
  let handleScreen = async () => {
    setScreen(!screen);
  };

  useEffect(() => {
    if (screen == true) {
      getDislayMedia();
    } else if (screen == false) {
      stopScreenShare();
    }
  }, [screen]);

  const stopScreenShare = () => {
    setScreen(false);

    try {
      let tracks = localVideoRef.current.srcObject.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
    } catch (e) {
      console.log(e);
    }

    let blackSilence = (...args) => {
      new MediaStream([black(...args), silence()]);
    };
    window.localStream = blackSilence();

    localVideoRef.current.srcObject = window.localStream;

    getUserMedia();
  };

  let openChat = () => {
    setShowModal(true);
    setNewMessages(0);
  };
  let closeChat = () => {
    setShowModal(false);
  };
  let handleMessage = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      <div className="overflow-hidden">
        {askForUsername === true ? (
          <div>
            <h2>Enter the lobby</h2>
            <TextField
              id="outlined-basic"
              label="Username"
              value={username}
              variant="outlined"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Button variant="contained" onClick={connect}>
              Connect
            </Button>

            <div>
              <video ref={localVideoRef} autoPlay muted></video>
            </div>
          </div>
        ) : (
          <div className={`${styles.meetVideoContainer}`}>
            {showModal ? (
              <div className={`${styles.chatRoom} z-20`}>
                <div className={`${styles.chatContainer} msgDisplay h-[95%] z-10 pb-[90px] overflow-y-auto`}>
                  <h1
                    className="text-4xl rounded-xl p-4 bg-[#26193A] text-[#fff] font-bold"
                    style={{ width: "100%", borderBottom: "solid 1px black" }}
                  >
                    Chat
                  </h1>

                  <div className={`${styles.chattingDisplay} pl-1 z-10`}>
                    {messages.length !== 0 ? (
                      messages.map((item, index) => {
                        // console.log(message);

                        return (
                          <div className="overflow-hidden msgData flex-wrap rounded-xl bg-[#26193A] p-1 pr-1.5 pb-3.5 mt-2.5 ml-0.5 w-fit min-w-[50px]" style={{ marginBottom: "20px" }} key={index}>
                            <p className=" rounded-xl text-[#7b58af] " style={{ fontWeight: "bold" }}>{item.sender}</p>
                            <p className="text-xl font-bold break-words max-w-[400px] text-white">{item.data}</p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-2xl text-white p-1.5 ">
                        No messages yet :)
                      </p>
                    )}
                    <div ref={bottomRf}></div>
                  </div>
                    </div>
                  <div className={`${styles.chattingArea} TF z-30 h-fit fixed bg-[#7b58af] bottom-0 border-t-2 pt-7 w-full `}>
                    <TextField
                      sx={{
                        input: { color: "#26193A" }, // input text color
                        "& label": {
                          color: "#26193A", // default label color
                        },
                        "& label.Mui-focused": {
                          color: "#26193A", // label color on focus
                        },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px",
                          "& fieldset": {
                            borderColor: "#26193A",
                          },
                          "&:hover fieldset": {
                            borderColor: "#FFFFFF",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#FFFFFF",
                          },
                        },
                      }}
                      className="text-white relative left-5 bottom-3 rounded-2xlt"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      id="outlined-basic"
                      label="Enter Your chat"
                      variant="outlined"
                    />
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#26193A",
                        color: "#8A72A8",
                        borderRadius: "20px",
                        textTransform: "none", 
                        "&:hover": {
                          backgroundColor: "#8A72A8",
                          color: "#26193A", 
                        },
                      }}
                      className="relative left-6"
                      onClick={sendMessage}
                    >
                      Send
                    </Button>
                  </div>
                
              </div>
            ) : (
              <></>
            )}

            <div className={styles.buttonContainers}>
              <IconButton onClick={handleVideo} style={{ color: "white" }}>
                {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>
              <IconButton onClick={handleEndCall} style={{ color: "red" }}>
                <CallEndIcon />
              </IconButton>
              <IconButton onClick={handleAudio} style={{ color: "white" }}>
                {audio === true ? <MicIcon /> : <MicOffIcon />}
              </IconButton>

              {screenAvailable === true ? (
                <IconButton onClick={handleScreen} style={{ color: "white" }}>
                  {screen === true ? (
                    <ScreenShareIcon />
                  ) : (
                    <StopScreenShareIcon />
                  )}
                </IconButton>
              ) : (
                <></>
              )}

              <Badge badgeContent={newMessages} max={999} color="orange">
                <IconButton
                  onClick={() => setShowModal(!showModal)}
                  style={{ color: "white" }}
                >
                  <ChatIcon />{" "}
                </IconButton>
              </Badge>
            </div>

            <video
              className={styles.meetUserVideo}
              ref={localVideoRef}
              autoPlay
              muted
            ></video>

            <div className={styles.conferenceView}>
              {videos.map((video) => (
                <div className={styles.videosContainer} key={video.socketId}>
                  <video
                    style={{
                      width: "350px",
                      height: "auto",
                      borderRadius: "20px",
                      margin: "7px",
                    }}
                    data-socket={video.socketId}
                    // Assign the video DOM element using a callback ref.
                    // When both the element is mounted and a media stream is available,
                    // set the stream as the video source so it plays automatically.
                    ref={(ref) => {
                      if (ref && video.stream) {
                        ref.srcObject = video.stream;
                      }
                    }}
                    autoPlay
                  ></video>

                  <p className={styles.usernameLabel}>
                    {otherUsernames[video.socketId] || "Unknown"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default VideoMeetingComponent;
