import React from 'react'
import { makeStyles } from "@material-ui/core/styles";
import { Box, Avatar } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    root: {
      display: "flex",
      alignItems: "flex-end",
      flexDirection: "column",
    },
    avatar: {
      height: 20,
      width: 20
    },
    marginBottom: {
      marginBottom: "6.5rem"
    }
}));

const MessageSeenAvatar = (props) => {
  const classes = useStyles();
  const { otherUser, index, lengthOfMessages } = props;
  return (
    <Box className={(index === (lengthOfMessages - 1)) ? `${classes.marginBottom} ${classes.root}` : classes.root}>
        <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar}></Avatar>
    </Box>
  )
}

export default MessageSeenAvatar