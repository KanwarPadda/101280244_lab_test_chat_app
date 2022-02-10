export const addMessageToStore = (state, payload) => {
  const { message, sender, senderId, recipientLatestMessageSeen } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      // if the sender has seen the receiver's latest message only then he/she can send notification for message
      if(convo.currentLoggedUser.latestMessageSeen){
        // if the both sender and reciver are on the same chat, they will not receive notification.
        if(convo.otherUser.id === senderId && !recipientLatestMessageSeen){
          const convoCopy = { ...convo };
          convoCopy.messages.push(message);
          convoCopy.latestMessageText = message.text;
          convoCopy.notificationsCount = convo.notificationsCount + 1;
          return convoCopy;
        }else{
          const convoCopy = { ...convo };
          convoCopy.messages.push(message);
          convoCopy.latestMessageText = message.text;
          return convoCopy;
        }
      }else{
        const convoCopy = { ...convo };
        convoCopy.messages.push(message);
        convoCopy.latestMessageText = message.text;
        convoCopy.unseenMessages = convo.unseenMessages + 1;
        return convoCopy;
      }
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users, loggedInUserId) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = {
        otherUser: user,
        messages: [],
        currentLoggedUser: {
          latestMessageSeen: false,
          id: loggedInUserId,
        }
      };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = { ...convo };
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const messageSeen = (state, payload) => {
  const { recipientId, senderId } = payload;
  console.log(payload);
  // to reset notification to zero
  if(senderId) {
    return state.map(convo => {
      if(convo.currentLoggedUser.id === senderId){
        const convoCopy = { ...convo };
        convoCopy.notificationsCount = 0;
        return convoCopy;
      }else{
        return convo;
      }
    })
  }
  
  if(recipientId){  // if message is seen by receiver, now change the lastestMessageSeen status
    return state.map(convo => {
      if(convo.otherUser.id === recipientId){
          const convoCopy = { ...convo };
          convoCopy.currentLoggedUser.latestMessageSeen = true;
          convoCopy.unseenMessages = 0;
          return convoCopy;
      }else{
        const convoCopy = { ...convo };
        convoCopy.currentLoggedUser.latestMessageSeen = false;
        convoCopy.breakNotification = undefined;
        return convoCopy;
      }
    })
  }
}