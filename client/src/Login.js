import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  TextField,
  makeStyles
} from "@material-ui/core";
import { login } from "./store/utils/thunkCreators";

import HeroImage from "./components/reusable/HeroImage"

const useStyles = makeStyles({
  btn: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 45,
    paddingRight: 45,
    fontWeight: 600
  },
  gridMargin: {
    margin: "auto"
  },
  topGrid: {
    marginTop: "0.5rem",
  },
  marginRight: {
    marginRight: "4rem"
  },
  textFieldWeight: {
    fontWeight: "bold"
  },
  formLabelStyles: {
    fontSize: "1.1rem",
    color: "#B0B0B0",
    top: "-13px",
    '&$focused': {
      color: "#B0B0B0",
      fontSize: "1.1rem",
      top: "-13px"
    },
  },
  focused: {},
})


const Login = (props) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const history = useHistory();
  const classes = useStyles();
  const { user, login } = props;

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
  };

  console.log("Login ", { user })

  if (user._id) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container spacing={isSmall ? 4 : 0}>
    <HeroImage isXs={isXs} />
    <Grid 
      container 
      item 
      md={8}
      justifyContent="center"
    >
      <Grid 
        container
        item
        direction="column"
        xs={12}
        md={12}
        spacing={2}
        justifyContent="center"
        wrap="nowrap"
        >
        <Grid container item direction={isSmall ? "column" : "row"}  justifyContent="flex-end" alignItems="center" spacing={5} className={classes.topGrid}>
          <Grid item >
            <Typography color="secondary">Don't have an account?</Typography>
          </Grid>
          <Grid item className={isSmall ? classes.topGrid : classes.marginRight}>
            <Box boxShadow={3} borderRadius="4px">
              <Button 
                onClick={() => history.push("/register")}
                color="primary"
                className={classes.btn}
              >Create account</Button>
            </Box>
          </Grid>
        </Grid>

        <Grid item md={12} xs={12}>
          <Grid item xs={12} md={8} className={classes.gridMargin}>
            <Box mt={isSmall ? 5: 5} mb={5}  textAlign={isSmall ? "center" : "left"}>
              <Typography 
                variant="h4"
                component="h2"
                gutterBottom
              >Welcome back!</Typography>
            </Box>
          </Grid>
            <Grid item md={12} >
            <form onSubmit={handleLogin}>
              <Grid container md={8} xs={12} item direction="column" spacing={5} className={classes.gridMargin} >
                <Grid item xs={12} md={12}>
                  <TextField 
                    aria-label="username"
                    label="Username"
                    name="username"
                    type="text"
                    fullWidth
                    required
                    InputProps={{ classes: { root: classes.textFieldWeight } }}
                    InputLabelProps={{ required: false, classes: { root: classes.formLabelStyles, focused: classes.focused } }}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField 
                    label="Password"
                    aria-label="password"
                    type="password"
                    name="password"
                    color="primary"
                    fullWidth
                    required
                    InputProps={{ classes: { root: classes.textFieldWeight } }}
                    InputLabelProps={{ required: false, classes: { root: classes.formLabelStyles, focused: classes.focused } }}
                  />
                </Grid>
                <Grid container item md={12} justifyContent="center">
                  <Button className={classes.btn} type="submit" variant="contained" size="large" color="primary">
                    LogIn
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Grid>

      </Grid>
    </Grid>
  </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)
