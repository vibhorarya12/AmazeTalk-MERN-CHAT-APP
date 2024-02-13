import React, { useContext } from "react";
import SingleChat from "./SingleChat";
import { ChatContext } from "../App";
export default function ChatArea() {

  return <div className="chatArea-container" >
       <SingleChat />
  </div>;
}
