import React from "react";
import "./myStyle.css";
import Avatar from "@mui/material/Avatar";
import { bufferToImage } from "./Utils";


export default function MessageOthers({ props }) {
 
  const date = new Date(props.createdAt);
  const isGroup = props.chat.isGroupChat;
  // Format time using toLocaleTimeString
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  const formattedTime = date.toLocaleTimeString("en-IN", {
    ...options,
    timeZone: "Asia/Kolkata",
  });

  return (
    <div className="other-message-container" onClick={() => console.log(props)}>
      <div className="conversation-container extra">
        {isGroup && props.sender.image ? (
          <Avatar
            className="con-icon"
            sx={{ width: 30, height: 30, borderRadius: 25 }}
            src={bufferToImage(props.sender.image)}
          />
        ) : null}
        <div className="other-text-content">
          {isGroup ? (
            <p className="con-title" style={{ fontSize: "small" }}>
              {props.sender.name}{" "}
            </p>
          ) : null}
          <p style={{color:'black'}} >{props.content}</p>
          <p className="self-timeStamp" style={{color:'black'}}>{formattedTime}</p>
        </div>
      </div>
    </div>
  );
}
