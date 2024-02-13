import React, { useContext, useState, useEffect } from "react";
import "./myStyle.css";
import { useNavigate } from "react-router-dom";
import { ChatContext } from "../App";
import Avatar from "@mui/material/Avatar";
import { RefreshContext } from "../App";
import Badge from "@mui/material/Badge";
import { useSelector } from "react-redux";
function ConversationsItem({ props }) {
  const [entryCount, setEntryCount] = useState(0);
  const lightTheme = useSelector((state) => state.themeKey);
  const navigate = useNavigate();
  const { setChatInfo, onlineUsers } = useContext(ChatContext);
  const { notifications, setNotifications } = useContext(RefreshContext);
  const iconName = props.name ? props.name[0] : "";
  const title = props.name || "";
  const lastMessage = props.lastMessage || "start a new chat";
  const otherUserImage = props.otherUserImage;

  useEffect(() => {
    let count = 0;

    for (const key in notifications) {
      if (notifications[key].ChatId === props._id) {
        count++;
      }
    }

    setEntryCount(count);
  }, [notifications]);

  const removeNotification = (chatId) => {
    const updatedNotifications = notifications.filter(
      (notification) => notification.ChatId !== chatId
    );
    setNotifications(updatedNotifications);
  };

  function getContentById(id) {
    let latestEntry = null;
    for (const key in notifications) {
      if (notifications[key].ChatId === id) {
        if (
          !latestEntry ||
          notifications[key].timeStamp > latestEntry.timeStamp
        ) {
          latestEntry = notifications[key];
        }
      }
    }
    return latestEntry
      ? latestEntry.isGroupChat
        ? latestEntry.sender + ":" + latestEntry.content
        : latestEntry.content
      : null;
  }

  return (
    <div
      className={"conversation-container"}
      onClick={() => {
        
        localStorage.setItem("conversations", JSON.stringify(props));
        setChatInfo(JSON.parse(localStorage.getItem("conversations")) || []);
        removeNotification(props._id);
        navigate("/app/chat");
      }}
    >
      {otherUserImage && !props.isGroup ? (
        <Avatar
          className="con-icon"
          sx={{
            width: 52,
            height: 52,
            borderRadius: 15,
            border: onlineUsers.has(props.otherUser) ? "2px solid green" : null,
          }}
          src={otherUserImage}
        />
      ) : (
        <p className="con-icon">{iconName} </p>
      )}

      <p
        className="con-title"
        style={{ color: lightTheme ? "black" : "white" }}
      >
        {title}{" "}
      </p>
      <p
        className="con-lastMessage"
        style={{ color: lightTheme ? "black" : "white" }}
      >
        {getContentById(props._id) ? getContentById(props._id) : lastMessage}
      </p>
      <p
        className="con-timeStamp"
        style={{ color: lightTheme ? "black" : "white" }}
      >
        <Badge badgeContent={entryCount} color="success" />
      </p>
    </div>
  );
}

export default ConversationsItem;
