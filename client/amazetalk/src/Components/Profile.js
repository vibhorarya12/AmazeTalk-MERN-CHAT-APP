import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import GroupsIcon from "@mui/icons-material/Groups";
import Logout from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import AttachEmailSharpIcon from "@mui/icons-material/AttachEmailSharp";
import Modal from "@mui/material/Modal";
import { motion } from "framer-motion";
import VerifiedSharpIcon from "@mui/icons-material/VerifiedSharp";
import { useSelector } from "react-redux";

export default function AccountMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const lightTheme = useSelector((state) => state.themeKey);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "60%", sm: "40%", md: "30%", lg: "30%", xl: "20%" },
    height: { xs: "40%", sm: "40%", md: "40%", lg: "45%", xl: "40%" },
    bgcolor: lightTheme ? "background.paper" : "#C5BAAF",
    boxShadow: 24,
    borderRadius: "5%",
    p: 4,
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="options">
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{ width: 42, height: 42 }}
              src={`data:image/jpeg;base64,${localStorage.getItem(
                "userImage"
              )}`}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            setShowModal(true);
          }}
        >
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={() => navigate("create-groups")}>
          <GroupsIcon style={{ marginRight: 10 }} fontSize="large" /> New Group
        </MenuItem>
        <Divider />

        <MenuItem
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("userName");
            localStorage.removeItem("conversations");
            localStorage.removeItem("email");
            localStorage.removeItem("userImage");
            handleClose();
            navigate("/");
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <Modal
        open={showModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack direction="column" spacing={2}>
            <motion.div
              style={{ alignSelf: "center" }}
              animate={{ scale: 1 }}
              initial={{ scale: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Avatar
                sx={{
                  width: "58%",
                  height: "78%",
                  boxShadow: 15,
                  left: "20%",
                  right: "20%",
                }}
                src={`data:image/jpeg;base64,${localStorage.getItem(
                  "userImage"
                )}`}
              />
            </motion.div>
            <Typography
              sx={{ alignSelf: "center" }}
              fontSize={"1.5rem"}
              fontFamily={"monospace"}
            >
              {localStorage.getItem("userName")}
              {localStorage.getItem("userImage") ? (
                <VerifiedSharpIcon sx={{ color: "#7A306C" }} />
              ) : null}
            </Typography>
            <MenuItem sx={{ alignSelf: "center" }}>
              <AttachEmailSharpIcon sx={{ color: "#7A306C" }} />{" "}
              <p style={{ fontSize: "23px", fontFamily: "monospace" }}>
                {localStorage.getItem("email")}
              </p>
            </MenuItem>
          </Stack>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
