import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
} from "../conversations";
import { setActiveChat } from '../activeConversation';
import { gotUser, setFetchingStatus } from "../user";
import { socket } from "../../socket/socket"
import axiosInstance from "../../api"

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axiosInstance.get("/auth/user");
    dispatch(gotUser(data));
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", credentials);
    dispatch(gotUser(data));
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", credentials);
    dispatch(gotUser(data));
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axiosInstance.delete("/auth/logout");
    socket.emit("logout", id);
    socket.removeAllListeners();
    dispatch(gotUser({}));

  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get("/api/conversations");
    dispatch(gotConversations(data));
    // dispatch(setActiveChat(data[0].otherUser.username));
  } catch (error) {
    console.error(error);
  }
};

export const updateNotifications = async (otherUserId) => {
  try {
    const { data } = await axiosInstance.put(`/api/conversations/update/notifications/${otherUserId}`);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

const saveMessage = async (body) => {
  const { data } = await axiosInstance.post("/api/messages", body);
  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
    recipientLatestMessageSeen: body.recipientLatestMessageSeen
  });
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message, undefined));
    }

    sendMessage(data, body);
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm, loggedInUserId) => async (dispatch) => {
  try {
    const { data } = await axiosInstance.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data, loggedInUserId));
  } catch (error) {
    console.error(error);
  }
};
