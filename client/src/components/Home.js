import { Fragment, useEffect, useRef, useState, } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, CssBaseline, Button, TextField } from "@material-ui/core";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";

const styles = {
  root: {
    height: "97vh",
  },
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversations: state.conversations,
  };
};

const mapDispatchToProps = {
};

const connector = connect(mapStateToProps, mapDispatchToProps)

const Home = (props) => {
  const { classes, user } = props;

  const [rooms, setRooms] = useState(["Covid", "News", "Nodejs"])
  const history = useHistory()

  const [selectedRoom, setSelectedRoom] = useState("")

  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value)
  }

  const handleSubmit = (event) => {
    if(selectedRoom) {
      history.push("/activegroup");
    }
  }

  if (!user._id) {
    return <Redirect to="/login" />;
  }

  return(
    <form onSubmit={handleSubmit}>
    <Grid container md={8} xs={12} item direction="column" spacing={5} className={classes.gridMargin} >
      <Grid item xs={12} md={12}>
        <TextField 
          aria-label="username"
          label="Username"
          name="username"
          type="text"
          fullWidth
          required
          value={user.username}
          InputProps={{ classes: { root: classes.textFieldWeight } }}
          InputLabelProps={{ required: false, classes: { root: classes.formLabelStyles, focused: classes.focused } }}
        />
      </Grid>
      <Grid item xs={12} md={12}>
        <select name="rooms" id="rooms" onChange={handleRoomChange}>
          <option>Select a Room: </option>
          {
            rooms.map((room, idx) => (
              <option key={idx} value={room}>{room}</option>
            ))
          }
        </select>
      </Grid>
      <Grid container item md={12} justifyContent="center">
        <Button className={classes.btn} type="submit" variant="contained" size="large" color="primary" onClick={handleSubmit}>
          Join Room
        </Button>
      </Grid>
    </Grid>
  </form>
  )
}

export default connector(withStyles(styles)(Home));