import React, { useState, useEffect, useContext } from "react";
import "./myStyle.css";
import { IconButton } from "@mui/material";
import PersonAddSharpIcon from "@mui/icons-material/PersonAddSharp";
import ModeNightSharpIcon from "@mui/icons-material/ModeNightSharp";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import ConversationsItem from "./ConversationsItem";
import { useNavigate } from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../Features/themeSlice";
import axios from "axios";
import AccountMenu from "./Profile";
import Facebook from "./Skeleton";
import { RefreshContext } from "../App";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge } from "antd";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { ChatContext } from "../App";
import MarkChatUnreadSharpIcon from "@mui/icons-material/MarkChatUnreadSharp";
import empty from "./Images/empty2.png";

export default function Sidebar() {
  const URL = process.env.REACT_APP_API_KEY;
  const lightTheme = useSelector((state) => state.themeKey);
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userName = localStorage.getItem("userName");
  const { MasterRefresh, notifications, setNotifications } =
    useContext(RefreshContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { setChatInfo } = useContext(ChatContext);
  const [loading, setLoading] = useState(false);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
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
  /// handling notifications//
  const removeNotification = (chatId) => {
    // Filter out the notification with the given ChatId
    const updatedNotifications = notifications.filter(
      (notification) => notification.ChatId !== chatId
    );

    // Update the notifications array using setNotifications
    setNotifications(updatedNotifications);
  };

  //handling notification data localStorage access ///
  const storeNotificationInLocalStorage = (notification) => {
    try {
      // Get existing conversations from local storage

      // Create a new object with modified values
      const modifiedNotification = {
        type: notification.type,
        content: notification.content,
        _id: notification.ChatId,
        name: notification.isGroupChat
          ? notification.ChatName
          : notification.sender,
        isGroup: notification.isGroupChat,
        otherUser: notification.senderId,
        otherUserImage: bufferToImage(notification.otherUserImage),
      };

      localStorage.setItem(
        "conversations",
        JSON.stringify(modifiedNotification)
      );
    } catch (error) {
      console.error("Error storing notification in local storage:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`${URL}/chats/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLoading(false);

        if (response.data.length === 0) {
          return;
        }
        const formattedConversations = response.data.map((chat) => {
          const isGroupChat = chat.isGroupChat;
          let chatName = isGroupChat ? chat.chatName : "";

          if (!isGroupChat) {
            // Find the other user's name in one-on-one chats
            const otherUser =
              chat.users.find(
                (u) => u._id !== localStorage.getItem("userId")
              ) || chat.users[0];
            chatName = otherUser ? otherUser.name : "";
          }

          const lastMessage = chat.latestMessage
            ? chat.latestMessage.content
            : "";
          const timeStamp = chat.latestMessage
            ? chat.latestMessage.createdAt
            : "";
          const Image = chat.users
            .filter(
              (obj) =>
                obj._id !== localStorage.getItem("userId") && obj.image !== null
            )
            .map((obj) => obj.image)[0];

          return {
            _id: chat._id,
            name: chatName,
            lastMessage: lastMessage,
            timeStamp: timeStamp,
            isGroup: isGroupChat,
            otherUserImage: Image ? bufferToImage(Image) : null,
            otherUser: chat.users
              .filter((obj) => obj._id !== localStorage.getItem("userId"))
              .map((obj) => obj._id)[0],
          };
        });

        // Sort the array based on the createdAt timestamp of the latestMessage
        formattedConversations.sort(
          (a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)
        );

        setConversations(formattedConversations);
        // console.log(formattedConversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        // Handle error (e.g., display an error message to the user)
      }
    };

    fetchConversations();
  }, [MasterRefresh]);

  // Filter conversation based on the search term
  const filteredConversations = conversations.filter((conversation) => {
    return conversation.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return (
    <div className="sidebar-container">
      <div className={"sb-header" + (lightTheme ? "" : " dark")}>
        <div className="other-icons">
          <IconButton
            className="start-chat"
            onClick={() => navigate("start-chats")}
          >
            <MarkChatUnreadSharpIcon
              className={"icon" + (lightTheme ? "" : " dark")}
            />
          </IconButton>

          <IconButton onClick={() => navigate("users")}>
            <PersonAddSharpIcon
              className={"icon" + (lightTheme ? "" : " dark")}
            />
          </IconButton>
          <IconButton onClick={() => dispatch(toggleTheme())}>
            {lightTheme && (
              <ModeNightSharpIcon
                className={"icon" + (lightTheme ? "" : " dark")}
              />
            )}
            {!lightTheme && (
              <LightModeIcon className={"icon" + (lightTheme ? "" : " dark")} />
            )}
          </IconButton>
          <IconButton onClick={handleClick}>
            <Badge count={notifications.length}>
              <NotificationsIcon
                className={"icon" + (lightTheme ? "" : " dark")}
                sx={{ color: "#757575" }}
              />
            </Badge>
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <MenuItem
                  key={index}
                  onClick={() => {
                    // console.log(notification);
                    handleClose();
                    storeNotificationInLocalStorage(notification);
                    setChatInfo(
                      JSON.parse(localStorage.getItem("conversations")) || []
                    );
                    navigate("chat");
                    removeNotification(notification.ChatId);
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, marginRight: 1 }}>
                    {notification.isGroupChat
                      ? notification.ChatName[0]
                      : notification.sender[0]}
                  </Avatar>
                  {notification.isGroupChat
                    ? notification.ChatName
                    : notification.sender}
                  : {notification.content}
                </MenuItem>
              ))
            ) : (
              <MenuItem onClick={handleClose}>No new notifications</MenuItem>
            )}
          </Menu>
          <AccountMenu letter={userName[0]} />
        </div>
      </div>
      <div className={"sb-search" + (lightTheme ? "" : " dark")}>
        <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
          <SearchSharpIcon />
        </IconButton>
        <input
          placeholder="search"
          className={"search-box" + (lightTheme ? "" : " dark")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className={"sb-conversations" + (lightTheme ? "" : " dark")}>
        {loading ? (
          <Facebook />
        ) : conversations.length === 0 ? (
          <img
            className="image-container"
            style={{ height: "40%", width: "100%" }}
            src={empty}
          />
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationsItem props={conversation} key={conversation._id} />
          ))
        )}
      </div>
    </div>
  );
}
