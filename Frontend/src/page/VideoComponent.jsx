import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
function VideoMeetingComponent() {
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");
  const [videoAvailable, setVideoAvailable] = useState();
  const [audioAvailable, setAudioAvailable] = useState();
  const [audio, setAudio] = useState();
  const [video, setVideo] = useState();
  const [screenAvailable, setScreenAvailable] = useState();
  let localVideoRef = useRef();

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

  let getUserMedia = ()=>{
    if((video && videoAvailable) || (audio && audioAvailable)){
      navigator.mediaDevices.getUserMedia({video: video, audio: audio})
      .then(()=>{})
      .then((stream)=>{})
      .catch((e)=>{console.log(e)})
    }else{
      try{

      }catch{
        let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach((track)=>{
              track.stop()
            })
      }
    }
  }

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
            <Button variant="contained" onClick={connect}>Connect</Button>

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
