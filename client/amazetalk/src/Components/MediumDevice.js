//sidebar for medium device
import React, { useState, useEffect, useContext } from "react";
import ConversationsItem from "./ConversationsItem";
import { IconButton } from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import axios from "axios";
import empty from "./Images/empty2.png";
import Facebook from "./Skeleton";
import { useSelector } from "react-redux";
import { RefreshContext } from "../App";
export default function MediumDevice() {
  const URL = process.env.REACT_APP_API_KEY;
  const [conversations, setConversations] = useState([]);
  const userName = localStorage.getItem("userName");
  const [loading, setLoading] = useState(false);
  const lightTheme = useSelector((state) => state.themeKey);
  const [searchTerm, setSearchTerm] = useState("");
  const { notifications, setNotifications } = useContext(RefreshContext);
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
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${URL}/chats/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

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
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userName]);

  const filteredConversations = conversations.filter((conversation) => {
    return conversation.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return (
    <div className="medium-device-container">
      <div className={"medium-search" + (lightTheme ? "" : " dark")}>
        <IconButton className={"icon"}>
          <SearchSharpIcon />
        </IconButton>
        <input
          placeholder="search"
          className={"search-box" + (lightTheme ? "" : " dark")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className={"medium-con" + (lightTheme ? "" : " dark")}>
        {loading ? (
          <Facebook />
        ) : conversations.length === 0 ? (
          <img style={{ height: "40%", width: "100%" }} src={empty} />
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationsItem props={conversation} key={conversation._id} />
          ))
        )}
      </div>
    </div>
  );
}
