import React, { useEffect, useState } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { fetchUser } from "./store/utils/thunkCreators";
import { initSocket } from "./store/initSocket";
import Signup from "./Signup.js";
import Login from "./Login.js";
import { Home, SnackbarError } from "./components";
import { ActiveChat } from "./components/ActiveChat";
import { initSocketOnce } from "./socket/helper.ts"

const Routes = (props) => {
  const { user, fetchUser, initializedSocket, initSocket } = props;
  const [errorMessage, setErrorMessage] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user.error) {
      // check to make sure error is what we expect, in case we get an unexpected server error object
      if (typeof user.error === "string") {
        setErrorMessage(user.error);
      } else {
        setErrorMessage("Internal Server Error. Please try again");
      }
      setSnackBarOpen(true);
    }
  }, [user.error]);

  useEffect(() => {
    if(!user.id && !initializedSocket) return;
    initSocketOnce({initializedSocket, initSocket, user})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[user])

  if (props.user.isFetchingUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {snackBarOpen && (
        <SnackbarError
          setSnackBarOpen={setSnackBarOpen}
          errorMessage={errorMessage}
          snackBarOpen={snackBarOpen}
        />
      )}
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Signup} />
        <Route
          exact
          path="/"
          render={(props) => (props.user?.id ? <Home /> : <Signup />)}
        />
        <Route path="/home" component={Home} />
        <Route path="/activegroup" component={ActiveChat} />
      </Switch>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    initializedSocket: state.initSocket.initializedSocket 
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser() {
      dispatch(fetchUser());
    },
    initSocket(status) {
      dispatch(initSocket(status))
    }
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));
