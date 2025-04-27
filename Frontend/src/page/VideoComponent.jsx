import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import io from "socket.io-client";

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
  const [videoAvailable, setVideoAvailable] = useState(); //this represents our permission of video or audio from our device
  const [audioAvailable, setAudioAvailable] = useState();
  const [audio, setAudio] = useState(); //this represent multiple streams from other users
  const [video, setVideo] = useState([]); //this will be an array bc there will be streams of multiple users(video confrencing)
  const [screenAvailable, setScreenAvailable] = useState();
  let localVideoRef = useRef();
  var socketRef = useRef();
  let socketIdRef = useRef();
  const videoRef = useRef([])
  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  let connectToSocketServer = async () => {
    socketRef.current = io.connect("http://localhost:8080", { secure: false }); //represents client side socket connection

    socketRef.current.on("signal", gotMsgFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);

      socketIdRef.current = socketRef.current.id; //socket id that we get for each client on connection with server

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideo((prevVideo) =>
          prevVideo.filter((video) => video.SocketId !== id)
        ); //we're filtering out video of that user which has left, also used callback as we need most recent value array, if many users left at same time then react can batch up the setVideo and will not give us most recent array but we need most recent array so callback func as here our new array value depends on previous
      });
      socketRef.current.on("user-joined", (socketId, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection( //new connected user is making peerConnection with other laready existing clients (or users) in the room
            peerConfigConnections 
          );

          connections[socketListId].onicecandidate = (event) => { //.onicecandidate is an event that is triggered when ice candidate (ask chatGpt) is found for any peer
            if (event.candidate != null) {  
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ 'ice': event.candidate }) // We're sending ICE info to the other peer so they can use it to establish a direct connection with us.

              );
            }
          };

          connections[socketListId].onaddstream = (event)=>{
            let videoExists = videoRef.current.find(video=>video.socketId === socketListId);
            //checking if some user b and c are already connected to us but maybe sending new stream bc of refresh, connecctivity issue etc
            if(videoExists){
              setVideo(videos => {
                const updatedVideos = videos.map(video =>
                  video.socketId === socketListId ? {...video, stream: event.stream} : video
                );
                return updatedVideos;
              })
            }else{
              //if they are sending their stream for first time then we'll create new video obj of then in our videos
              let newVideo = {
                socketId: socketListId,
                stream: event.stream, 
                autoplay: true, // Auto-play the video as soon as it’s added
                playsinline: true  //is useful for mobile devices to play video inline (not full screen)
              }

              setVideo(videos => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos
              })
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

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(() => {})
        .then((stream) => {})
        .catch((e) => {
          console.log(e);
        });
    } else {
      try {
      } catch {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
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

  return (
    <>
      <div>
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
          ""
        )}
      </div>
    </>
  );
}

export default VideoMeetingComponent;
