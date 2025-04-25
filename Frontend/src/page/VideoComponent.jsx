import React, { useEffect, useRef, useState } from "react";
import TextField from '@mui/material/TextField'; 
import { Button } from "@mui/material";
function VideoMeetingComponent() {
  const [askForUsername, setAskForUsername] = useState(true);
  const [username, setUsername] = useState("");
  const [videoAvailable, setVideoAvailable] = useState();
  const [audioAvailable, setAudioAvailable] = useState()
  let localVideoRef = useRef()



const getPermission = async()=>{
  try{
   const videoPermission = await navigator.mediaDevices.getUserMedia({video: true}) ;

    if(videoPermission){
      setVideoAvailable(true)
    }else{
      setVideoAvailable(false)
    }

    const audioPermission = await navigator.mediaDevices.getUserMedia({audio: true}) ;

    if(audioPermission){
      setAudioAvailable(true)
    }else{
      setAudioAvailable(false)
    }

  }catch{

  }
}

useEffect(()=>{
    getPermission();
}, [])

  return (
    <>
      
      <div>
        {askForUsername === true ? 
          <div>
            <h2>Enter the lobby</h2>
            <TextField id="outlined-basic" label="Username" value={username} variant="outlined" onChange={(e)=>{setUsername(e.target.value)}} />
            <Button variant="contained">Connect</Button>

            <div>
              <video ref={localVideoRef} autoPlay muted></video>
            </div>
          </div>
         : 
          ""
        }
      </div>
    </>
  );
}

export default VideoMeetingComponent;
