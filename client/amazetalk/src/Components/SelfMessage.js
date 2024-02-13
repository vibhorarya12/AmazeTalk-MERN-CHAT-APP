import React, { useState } from 'react'
import "./myStyle.css";
export default function SelfMessage({props}) {
  const date = new Date(props.createdAt);
  const options = { hour: 'numeric', minute: 'numeric', hour12: true };
  const formattedTime = date.toLocaleTimeString("en-IN", { ...options, timeZone: "Asia/Kolkata" });
  const [view, setView] = useState(false);

  return (
    <div className="self-message-container" onClick={()=>setView(!view)}>
      <div className="messageBox">
        <p style={{ color: "black" }}>{props.content}</p>
        {view?<p className="self-timeStamp" style={{color:'black'}}>{formattedTime}</p>:null}  
      </div>
    </div>
  )
}
