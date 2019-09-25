import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { db_profile } from "../lib/global";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  }
}));

export default function AiidaProfile() {
  const [profile, setData] = useState([]);
  useEffect(() => {
    if (db_profile) {
      setData(db_profile);
    }
  }, []);

  const classes = useStyles();
  return (
    <List className={classes.root}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="User" src="" />
        </ListItemAvatar>
        {profile && profile.options && (
          <ListItemText
            primary={
              profile.options.user_first_name +
              " " +
              profile.options.user_last_name
            }
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {profile.default_profile}&nbsp;-&nbsp;
                </Typography>
                default profile
              </React.Fragment>
            }
          />
        )}
      </ListItem>
      <Divider />
      {profile && profile.options && (
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <List dense={true}>
              <ListItem>
                <ListItemText
                  primary={
                    profile.profiles[profile.default_profile].AIIDADB_ENGINE
                  }
                  secondary="engine"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    profile.profiles[profile.default_profile].AIIDADB_BACKEND
                  }
                  secondary="backend"
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <List dense={true}>
              <ListItem>
                <ListItemText
                  primary={
                    profile.profiles[profile.default_profile].AIIDADB_USER
                  }
                  secondary="db-user"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    profile.profiles[profile.default_profile].AIIDADB_HOST +
                    ":" +
                    profile.profiles[profile.default_profile].AIIDADB_PORT
                  }
                  secondary="db-host"
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      )}
    </List>
  );
}
