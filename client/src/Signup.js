import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Button,
  FormHelperText,
  useMediaQuery,
  useTheme,
  TextField,
  makeStyles
} from "@material-ui/core";
import { register } from "./store/utils/thunkCreators";

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

const Signup = (props) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const history = useHistory();
  const classes = useStyles();
  const { user, register } = props;
  const [formErrorMessage, setFormErrorMessage] = useState({});

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }

    await register({ username, firstName, lastName, password });
  };



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
            <Typography color="secondary">Already have an account?</Typography>
          </Grid>
          <Grid item className={isSmall ? classes.topGrid : classes.marginRight}>
            <Box boxShadow={3} borderRadius="4px">
              <Button
                onClick={() => history.push("/login")}
                color="primary"
                className={classes.btn}
              >Login</Button>
            </Box>
          </Grid>
        </Grid>

        <Grid item md={12} xs={12}>
          <Grid item xs={12} md={8} className={classes.gridMargin}>
            <Box mt={isSmall ? 5: 5} mb={5} textAlign={isSmall ? "center" : "left"} >
              <Typography 
                variant="h4"
                component="h2"
                gutterBottom
              >Create an account.</Typography>
            </Box>
          </Grid>
          <Grid item>
            <form onSubmit={handleRegister}>
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
                    label="First Name"
                    aria-label="First Name"
                    type="text"
                    name="firstName"
                    fullWidth
                    required
                    InputProps={{ classes: { root: classes.textFieldWeight } }}
                    InputLabelProps={{ required: false, classes: { root: classes.formLabelStyles, focused: classes.focused } }}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField 
                    label="Last Name"
                    aria-label="Last Name"
                    type="text"
                    name="lastName"
                    fullWidth
                    required
                    InputProps={{ classes: { root: classes.textFieldWeight } }}
                    InputLabelProps={{ required: false, classes: { root: classes.formLabelStyles, focused: classes.focused } }}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField 
                    aria-label="password"
                    label="Password"
                    type="password"
                    inputProps={{ minLength: 6 }}
                    name="password"
                    fullWidth
                    required
                    InputProps={{ classes: { root: classes.textFieldWeight } }}
                    InputLabelProps={{ required: false, classes: { root: classes.formLabelStyles, focused: classes.focused } }}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField
                    label="Confirm Password"
                    aria-label="confirm password"
                    type="password"
                    inputProps={{ minLength: 6 }}
                    name="confirmPassword"
                    fullWidth
                    required
                    InputProps={{ classes: { root: classes.textFieldWeight } }}
                    InputLabelProps={{ required: false, classes: { root: classes.formLabelStyles, focused: classes.focused } }}
                  >
                    <FormHelperText>
                      {formErrorMessage.confirmPassword}
                      </FormHelperText>
                  </TextField>
                </Grid>
                
                <Grid container item md={12} justifyContent="center">
                  <Button className={classes.btn} type="submit" variant="contained" size="large" color="primary">
                    Create
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
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
