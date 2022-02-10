// ACTIONS

const INIT_SOCKET = "INIT_SOCKET";

// ACTION CREATORS

export const initSocket = (status = false) => ({
  type: INIT_SOCKET,
  data: status,
});

// REDUCER

const reducer = (state = { initializedSocket: false }, action) => {
  switch (action.type) {
    case INIT_SOCKET:
      return {
        ...state,
        initializedSocket: action.data
      }
    default:
      return state;
  }
};

export default reducer