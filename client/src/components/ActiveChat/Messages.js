import React,{ Fragment } from "react";
import { Box, makeStyles } from "@material-ui/core";
import { SenderBubble, OtherUserBubble, MessageSeenAvatar } from "../ActiveChat";
import moment from "moment";
import uniqid from "uniqid";

const useStyles = makeStyles({
  chatSubContainer: {
    paddingLeft: 41,
    paddingRight: 41,
    overflow: "auto",
    height: "70vh"
  }
})

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId, latestMessageSeen, unseenMessages } = props;
  return (
    <Box className={classes.chatSubContainer}>
    {
      messages.map((message, index) => {
        const time = moment(message.createdAt).format("h:mm");
        const messagingBubble = message.senderId === userId ? (
          <SenderBubble 
              key={message.id} 
              text={message.text} 
              time={time} 
              unseenMessages={unseenMessages}
              index={index} 
              lengthOfMessages={messages.length} />
        ) : (
          <OtherUserBubble 
              key={message.id} 
              text={message.text} 
              time={time} 
              otherUser={otherUser}  />
        );

        const seenBubble = (index === (messages.length - 1) && latestMessageSeen) ? (
          <MessageSeenAvatar 
              key={uniqid()} 
              otherUser={otherUser} 
              index={index} 
              lengthOfMessages={messages.length} />
        ) : ((index === (messages.length - (unseenMessages + 1))) && !latestMessageSeen) ? (
          <MessageSeenAvatar 
              key={uniqid()} 
              otherUser={otherUser} 
              index={index} 
              lengthOfMessages={messages.length} />
        ) : (index === (messages.length - 1) && (unseenMessages === 0)) ? (
          <MessageSeenAvatar 
              key={uniqid()} 
              otherUser={otherUser} 
              index={index} 
              lengthOfMessages={messages.length} />
        ) : null

        return (
          <Fragment key={uniqid()}>
            { messagingBubble }
            { seenBubble }
          </Fragment>
        )  
      })
    }
    </Box>
  );
};

export default Messages;
