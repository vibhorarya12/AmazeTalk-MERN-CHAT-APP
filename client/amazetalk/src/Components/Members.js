import React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CancelSharpIcon from "@mui/icons-material/CancelSharp";
function Members(props) {
  return (
    <div>
      <Stack direction="row" spacing={1}>
        {props.userImage ? (
          <Avatar
            style={{ height: 50, width: 50, marginTop: 15 }}
            src={props.userImage}
          />
        ) : (
          <Avatar style={{ height: 50, width: 50, marginTop: 15 }}>
            {props.name[0]}
          </Avatar>
        )}

        <Typography style={{ marginTop: 20, fontWeight: "bold" }}>
          {props.name}
        </Typography>
        {props.isAdmin ? (
          <AdminPanelSettingsIcon color="primary" style={{ marginTop: 20 }} />
        ) : (
          null
        )}
      </Stack>
    </div>
  );
}

export default Members;
