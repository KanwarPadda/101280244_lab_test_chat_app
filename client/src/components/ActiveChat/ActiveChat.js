import { useEffect, Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { socket } from "../../socket/socket"
import { messageSeenStatus } from "../../store/conversations"
import { postMessage, updateNotifications } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column"
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  }
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const [text, setText] = useState("");
  const { user, messageSeenStatus, postMessage } = props;
  // const conversation = props.conversation || {};

  const activeConversation = "Covid";
  const conversation = {
    otherUser: {
      username: "Covid",
      online: true
    },
    messages: [
      { id: 1, text: "Hello" }
    ],
    currentLoggedUser: {latestMessageSeen: false},
    unseenMessages: 10,
    notifications: []
  }
  
  useEffect(() => {
    if(activeConversation === "" || !conversation.otherUser || !conversation.notifications.length) return;
    // socket goes to receiver of the message
    socket.emit("message_seen",{ 
      recipientId: conversation.otherUser.id,
      senderId: null
    })

    // this is for current user when he clicks we reset notifications to zero
    messageSeenStatus({
      recipientId: conversation.otherUser.id,
      senderId: null
    })
    
    updateNotifications(conversation.otherUser.id)

  },[activeConversation])

  const handleInputChange = (event) => setText(event.target.value);

  const handleSubmitMessage = async (event) => {
    event.preventDefault();
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: event.target.text.value,
      recipientId: conversation.otherUser.id,
      conversationId: conversation.id,
      senderId: user.id,
      recipientLatestMessageSeen: conversation.currentLoggedUser.latestMessageSeen,
      sender: conversation.id ? null : user
    };
    await postMessage(reqBody);
    // TODO:
    // // to make the scroll to go to the bottom when user send a message
    // let scrollHeight = chatContainerRef.current.scrollHeight;
    // chatContainerRef.current.scrollTop = scrollHeight;

    setText("");
  }

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <Fragment>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
              latestMessageSeen={conversation.currentLoggedUser.latestMessageSeen}
              unseenMessages={conversation.unseenMessages}
            />
            <Input
              handleSubmitMessage={handleSubmitMessage}
              handleInputChange={handleInputChange}
              text={text}
            />
          </Box>
        </Fragment>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    activeConversation: state.activeConversation,
    conversation:
      state.conversations &&
      state.conversations.find(
        (conversation) => conversation.otherUser.username === state.activeConversation
      )
  };
};

const mapDispatchToProps = (dispatch) => ({
  messageSeenStatus: data => dispatch(messageSeenStatus(data)),
  postMessage: data => dispatch(postMessage(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
