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
import CloseIcon from "@mui/icons-material/Close";
import styles from "../Styles/VideoComponent.module.css";
import io from "socket.io-client";
import withAuth from "../utils/withAuth";
import { Input } from "postcss";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
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
  const [videoAvailable, setVideoAvailable] = useState(true);
  const [audioAvailable, setAudioAvailable] = useState(true);
  const [audio, setAudio] = useState();
  const [video, setVideo] = useState([]);
  const [screenAvailable, setScreenAvailable] = useState();
  let [newMessages, setNewMessages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  let [messages, setMessages] = useState([]);
  let [screen, setScreen] = useState();
  let [message, setMessage] = useState("");
  let [videos, setVideos] = useState([]);
  let localVideoRef = useRef();
  var socketRef = useRef();
  let socketIdRef = useRef();
  const videoRef = useRef([]);
  const bottomRf = useRef(null);
  const previewVideoRef = useRef();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:768px)');
  const [mobileChatboxClosing, setMobileChatboxClosing] = useState(false);

  useEffect(() => {
    let isComponentMounted = true;
    
    if (askForUsername) {
      if (previewVideoRef.current && previewVideoRef.current.srcObject) {
        try {
          let tracks = previewVideoRef.current.srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        } catch (e) {}
      }

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          if (!isComponentMounted) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }
          window.previewStream = stream;
          if (previewVideoRef.current) {
            previewVideoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.log("Error accessing media devices:", err);
          setVideoAvailable(false);
          setAudioAvailable(false);
        });
    }

    return () => {
      isComponentMounted = false;
      if (window.previewStream) {
        window.previewStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [askForUsername]);

  let connect = () => {
    if (username.trim()) {
      setAskForUsername(false);
      getMedia();
    }
  };

  useEffect(() => {
    if (showModal && bottomRf.current) {
      bottomRf.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, showModal]);

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
    socketRef.current = io.connect("https://linkify-production-1188.up.railway.app", { secure: false }); //represents client side socket connection (current)

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
                autoplay: true, // Auto-play the video as soon as it's added
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
      // Only attempt to stop tracks if localVideoRef exists and has srcObject
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => {
          try {
            track.stop();
          } catch (e) {
            console.log('Error stopping track:', e);
          }
        });
      }
    } catch (e) {
      console.log('Error stopping screen share:', e);
    }

    try {
      // Create blackSilence stream only if we need to set it
      if (localVideoRef.current) {
        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
        window.localStream = blackSilence();
        localVideoRef.current.srcObject = window.localStream;
      }
    } catch (e) {
      console.log('Error setting black silence:', e);
    }

    // Only call getUserMedia if we haven't already stopped
    if (!screen) {
      getUserMedia();
    }
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

  const handleLogoClick = () => {
    // Function to stop all tracks in a stream
    
    window.location.href = "/home";
  };

  // Handle mobile chatbox close with animation
  const handleMobileChatboxClose = () => {
    setMobileChatboxClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setMobileChatboxClosing(false);
    }, 350); // match animation duration
  };

  return (
    <>
      <div className="overflow-hidden">
        <div className={styles.linkifyText} onClick={handleLogoClick}>
          Linkify
        </div>
        {askForUsername === true ? (
          <div className={styles.usernameModal}>
            
            <div className={styles.modalContent}>
              <Link className="div text-2xl md:text-4xl cursor-pointer pl-4 md:pl-14 font-bold text-amber-50" onClick={()=>{window.location.href="/"}}>Linkify</Link>
              <div className={styles.previewVideo}>
                <video
                  ref={previewVideoRef}
                  autoPlay
                  muted
                  playsInline
                />
              </div>
              <TextField
                className={styles.usernameInput}
                label="Enter your name"
                variant="filled"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                InputProps={{
                  style: { color: '#fef3c7' }
                }}
              />
              <Button
                className={styles.joinButton}
                onClick={connect}
                variant="contained"
                disabled={!username.trim()}
              >
                Join Meeting
              </Button>
            </div>
          </div>
        ) : (
          <div className={`${styles.meetVideoContainer}`}>
            {/* Mobile: Only render chatbox if showModal is true */}
            {(isMobile && (showModal || mobileChatboxClosing)) && (
              <div className={
                styles.chatboxCenterMobile + ' ' +
                (mobileChatboxClosing
                  ? styles.chatboxSlideOutMobile
                  : styles.chatboxSlideInMobile)
              }>
                <div className={`${styles.chatRoom} z-20`}>
                  <div className={styles.chatHeader}>
                    <h3>In-call messages</h3>
                    <IconButton
                      aria-label="Close chat"
                      onClick={handleMobileChatboxClose}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: '#fff',
                        background: 'rgba(171, 27, 158, 0.25)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        borderRadius: '50%',
                        boxShadow: '0 2px 8px 0 rgba(171, 27, 158, 0.10)',
                        transition: 'background 0.2s',
                        cursor: 'pointer',
                      }}
                      size="small"
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                  <div className={`${styles.chatContainer} msgDisplay h-[95%] relative z-10 pb-[90px] overflow-y-auto`}>
                    <div className={`${styles.chattingDisplay} pl-1 z-10`}>
                      {messages.length !== 0 ? (
                        messages.map((item, index) => {
                          const isSent = item.sender === username;
                          return (
                            <div
                              className={`${styles.msgData}${isSent ? ' ' + styles.sent : ''} ml-0.5 mt-2.5`}
                              style={{ marginBottom: "20px" }}
                              key={index}
                            >
                              <p className="semibold">{item.sender}</p>
                              <p className=" font-light break-words max-w-[400px]" >{item.data}</p>
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
                  <div className={styles.chattingArea}>
                    <TextField
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      id="outlined-basic"
                      label="Enter Your chat"
                      variant="outlined"
                      fullWidth
                      onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                      sx={{
                        input: { color: "#26193A" },
                        "& label": { color: "#26193A" },
                        "& label.Mui-focused": { color: "#26193A" },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px",
                          "& fieldset": { borderColor: "#26193A" },
                          "&:hover fieldset": { borderColor: "#FFFFFF" },
                          "&.Mui-focused fieldset": { borderColor: "#FFFFFF" },
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      sx={{
                        background: "linear-gradient(45deg, #AB1B9E, #8A72A8)",
                        color: "#fff",
                        borderRadius: "50%",
                        minWidth: "48px",
                        minHeight: "48px",
                        marginLeft: "8px",
                        boxShadow: "none",
                        "&:hover": {
                          background: "linear-gradient(45deg, #8A72A8, #AB1B9E)",
                        },
                      }}
                      onClick={sendMessage}
                      disabled={!message.trim()}
                    >
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {/* Desktop: keep old logic */}
            {!isMobile && (
              <div
                aria-hidden={!showModal}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 15,
                  height: '95vh',
                  zIndex: 40,
                  pointerEvents: showModal ? 'auto' : 'none',
                  visibility: showModal ? 'visible' : 'hidden',
                  transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)',
                  transform: showModal ? 'translateX(0)' : 'translateX(-120%)',
                  opacity: showModal ? 1 : 0,
                  maxWidth: '100vw',
                  width: '360px',
                }}
              >
                <div className={`${styles.chatRoom} z-20`}>
                  <div className={styles.chatHeader}>
                    <h3>In-call messages</h3>
                    <IconButton
                      aria-label="Close chat"
                      onClick={() => setShowModal(false)}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: '#fff',
                        background: 'rgba(171, 27, 158, 0.25)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        borderRadius: '50%',
                        boxShadow: '0 2px 8px 0 rgba(171, 27, 158, 0.10)',
                        transition: 'background 0.2s',
                        cursor: 'pointer',
                      }}
                      size="small"
                    >
                      <CloseIcon />
                    </IconButton>
                  </div>
                  <div className={`${styles.chatContainer} msgDisplay h-[95%] relative z-10 pb-[90px] overflow-y-auto`}>
                    <div className={`${styles.chattingDisplay} pl-1 z-10`}>
                      {messages.length !== 0 ? (
                        messages.map((item, index) => {
                          const isSent = item.sender === username;
                          return (
                            <div
                              className={`${styles.msgData}${isSent ? ' ' + styles.sent : ''} ml-0.5 mt-2.5`}
                              style={{ marginBottom: "20px" }}
                              key={index}
                            >
                              <p className="semibold">{item.sender}</p>
                              <p className=" font-light break-words max-w-[400px]" >{item.data}</p>
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
                  <div className={styles.chattingArea}>
                    <TextField
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      id="outlined-basic"
                      label="Enter Your chat"
                      variant="outlined"
                      fullWidth
                      onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                      sx={{
                        input: { color: "#26193A" },
                        "& label": { color: "#26193A" },
                        "& label.Mui-focused": { color: "#26193A" },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px",
                          "& fieldset": { borderColor: "#26193A" },
                          "&:hover fieldset": { borderColor: "#FFFFFF" },
                          "&.Mui-focused fieldset": { borderColor: "#FFFFFF" },
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      sx={{
                        background: "linear-gradient(45deg, #AB1B9E, #8A72A8)",
                        color: "#fff",
                        borderRadius: "50%",
                        minWidth: "48px",
                        minHeight: "48px",
                        marginLeft: "8px",
                        boxShadow: "none",
                        "&:hover": {
                          background: "linear-gradient(45deg, #8A72A8, #AB1B9E)",
                        },
                      }}
                      onClick={sendMessage}
                      disabled={!message.trim()}
                    >
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13" /><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>
                    </Button>
                  </div>
                </div>
              </div>
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

              <IconButton
                onClick={() => setShowModal(!showModal)}
                style={{ color: "white" }}
              >
                <ChatIcon />
              </IconButton>
            </div>

            <video
              className={styles.meetUserVideo}
              ref={localVideoRef}
              autoPlay
              muted
            ></video>

            <div className={styles.conferenceView}>
              {videos.map((video) => (
                <div className={`${styles.videosContainer} relative`} key={video.socketId}>
                  <video
                    style={{
                      width: "fit-content",
                      height: "auto",
                      borderRadius: "20px",
                      margin: "7px",
                    }}
                    data-socket={video.socketId}
                    ref={(ref) => {
                      if (ref && video.stream) {
                        ref.srcObject = video.stream;
                      }
                    }}
                    autoPlay
                  ></video>
                  {/* Username label for other users only, inside the video container */}
                  {otherUsernames[video.socketId] && otherUsernames[video.socketId] !== username && (
                    <p className={`${styles.usernameLabel} absolute bottom-0 left-0`}>
                      {otherUsernames[video.socketId]}
                    </p>
                  )}
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
