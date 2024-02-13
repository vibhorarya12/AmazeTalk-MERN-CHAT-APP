import React from "react";
import "./myStyle.css";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

// for converting base64 image (buffer)//
function bufferToImage(buffer) {
  const uint8Array = new Uint8Array(buffer.data);
  const binaryString = uint8Array.reduce(
    (acc, byte) => acc + String.fromCharCode(byte),
    ""
  );
  const base64String = btoa(binaryString);
  const imageSrc = `data:${buffer.type};base64,${base64String}`;
  return imageSrc;
}
//sending msg component for sending process//
const SendingMsg = (props) => {
  return (
    <div className="self-message-container">
      <div className="messageBox">
        <Stack direction={"row"} spacing={2}>
          <p style={{ color: "black" }}>{props.content}</p>{" "}
          <CircularProgress size={17} />
        </Stack>
      </div>
    </div>
  );
};



export { bufferToImage, SendingMsg};
