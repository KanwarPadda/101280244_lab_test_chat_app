import store from "../store"
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  messageSeenStatus
} from "../store/conversations";

export class InitAppWithSockets {
  constructor(socket, user) {
    this.socket = socket;
    this.initialized = false;
    this._userInfo = user
  }

  _listeningAddOnlineUsers = () => {
    this.socket.on("add-online-user", (id) => {
      store.dispatch(addOnlineUser(id));
      console.log('add-online-user success ', 'time=>', new Date().toLocaleString(), "milliseconds=>",new Date().getTime());
    });
  }

  _listeningRemoveOfflineUser = () => {
    this.socket.on("remove-offline-user", (id) => {
      store.dispatch(removeOfflineUser(id));
      console.log('remove-offline-user success ', 'time=>', new Date().toLocaleString(), "milliseconds=>",new Date().getTime());
    });
  }

  _listeningNewMessage = () => {
    this.socket.on("new-message", (data) => {
      store.dispatch(setNewMessage(data.message, data.sender, data.senderId, data.recipientLatestMessageSeen));
      console.log('new-message success ', 'time=>', new Date().toLocaleString(), "milliseconds=>",new Date().getTime());
    });
  }

  _listeningMessage_Seen = () => {
    this.socket.on("message_seen", data => {
      store.dispatch(messageSeenStatus(data));
      console.log('message_seen success ', 'time=>', new Date().toLocaleString(), "milliseconds=>",new Date().getTime());
    })
  }

  subscribeSocket = () => {
    this.socket.removeAllListeners();
    this._listeningAddOnlineUsers();
    this._listeningRemoveOfflineUser();
    this._listeningNewMessage();
    this._listeningMessage_Seen();
    console.log('subscribeSocket success. ', 'time=>', new Date().toLocaleString(),"milliseconds=>",new Date().getTime());
  }

  _init = () => {
    this.socket.connect();
    this.socket.on("connect", () =>  console.log('connection socketId=>', this.socket.id, 'time=>', new Date().toLocaleString()), "milliseconds=>",new Date().getTime())
    this.subscribeSocket();
  }

  init = async () => {
    if (this._userInfo && !this.initialized) {
      await this._init();
      this.initialized = true;
      console.log('initialized');
      let afterReconnecting = false;
      
      this.socket.on("connect_error", (error) => {
        console.log("connect error time=>", new Date().toLocaleString()," message=>",error.message); // prints the message associated with the error
      });

      this.socket.on('reconnect', attemptNumber => {
        if (!afterReconnecting) {
          this.socket.disconnect();
          this._init();
          afterReconnecting = true;
          console.log('not reconnecting, open automatically time=>', new Date().toLocaleString());
        }
        console.log(
          'reconnect successfully. attemptNumber =>',
          attemptNumber,
          'socket-id => ',
          this.socket.id,
          'time=>',
          new Date().toLocaleString(),
        );
      });
      this.socket.on('reconnecting', attemptNumber => {
        afterReconnecting = true;
        console.log(
          'reconnecting. attemptNumber =>',
          attemptNumber,
          'time=>',
          new Date().toLocaleString(),
        );
      });
      this.socket.on('disconnect', async reason => {
        afterReconnecting = false;
        console.log(
          'disconnect in client, disconnect reason =>',
          reason,
          'time=>',
          new Date().toLocaleString(),
        );
      });
      this.socket.on('reconnect_error', error => {
        afterReconnecting = false;
        console.log('reconnect_error. error =>', error, 'time=>', new Date().toLocaleString());
      });

    }
  }

}