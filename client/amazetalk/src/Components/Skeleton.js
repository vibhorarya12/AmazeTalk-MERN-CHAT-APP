import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
//skeleton for loading users//
export default function Facebook() {
  return (
    <div>
      <div style={{ marginTop: "10px" }}>
        <Stack direction="row" spacing={2}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={55}
            height={55}
          />

          <Skeleton
            animation="wave"
            height={15}
            width="70%"
            style={{ marginTop: 10 }}
          />
        </Stack>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Stack direction="row" spacing={2}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={55}
            height={55}
          />

          <Skeleton
            animation="wave"
            height={15}
            width="70%"
            style={{ marginTop: 10 }}
          />
        </Stack>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Stack direction="row" spacing={2}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={55}
            height={55}
          />

          <Skeleton
            animation="wave"
            height={15}
            width="70%"
            style={{ marginTop: 10 }}
          />
        </Stack>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Stack direction="row" spacing={2}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={55}
            height={55}
          />

          <Skeleton
            animation="wave"
            height={15}
            width="70%"
            style={{ marginTop: 10 }}
          />
        </Stack>
      </div>
      <div style={{ marginTop: "10px" }}>
        <Stack direction="row" spacing={2}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={55}
            height={55}
          />

          <Skeleton
            animation="wave"
            height={15}
            width="70%"
            style={{ marginTop: 10 }}
          />
        </Stack>
      </div>
    </div>
  );
}
//skeleton for loading messages//
export const MessageSkeleton = () => {
  return (
    <div>
      <div style={{margin:'5px'}}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={"15%"}
          height={50}
          style={{ borderRadius: 20 }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end",margin:'5px' }}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={"15%"}
          height={50}
          style={{ borderRadius: 20 }}
        />
      </div>
      <div style={{margin:'5px'}}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={"15%"}
          height={50}
          style={{ borderRadius: 20 }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end",margin:'5px' }}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={"15%"}
          height={50}
          style={{ borderRadius: 20 }}
        />
      </div>
      <div style={{margin:'5px'}}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={"15%"}
          height={50}
          style={{ borderRadius: 20 }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end",margin:'5px' }}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={"15%"}
          height={50}
          style={{ borderRadius: 20 }}
        />
      </div>
      <div style={{margin:'5px'}}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={"15%"}
          height={50}
          style={{ borderRadius: 20 }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end",margin:'5px' }}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          width={"15%"}
          height={50}
          style={{ borderRadius: 20 }}
        />
      </div>
    </div>
  );
};
