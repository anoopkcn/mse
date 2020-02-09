import React, { useEffect, useState, useRef } from "react";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import RotateRightIcon from "@material-ui/icons/RotateRight";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import BallotIcon from "@material-ui/icons/Ballot";
import CastConnectedIcon from "@material-ui/icons/CastConnected";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Grow from "@material-ui/core/Grow";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import NodesTable from "./NodesTable";
import "../assets/css/animations.css";
import { AIIDA_RESTAPI_URL, startRestAPI, db_profile, db } from "../lib/global";

const url = `${AIIDA_RESTAPI_URL}/nodes?orderby=-id`;

const intervalRep = ["1s", "2s", "5s", "10s", "20s"];
const intervalTime = [1, 2, 5, 10, 20];

const useStyles = makeStyles(theme => ({
  palette: {
    secondary: { main: "#11cb5f" }
  },
  root: {
    minHeight: 500,
    width: "100%",
    border: "1px solid rgba(0, 0, 0, .125)"
    // boxShadow: '0 0 0 0',
  },
  loading: {
    textAlign: "center",
    paddingTop: 132.5 // (minheight/2) - (iconSize/2)
  },
  toolbar: {
    width: "100%",
    backgroundColor: "#FAFAFA"
    // padding: theme.spacing(1, 2),
  },
  button: {
    margin: theme.spacing(0, 1, 0, 0)
  },

  intervalButton: {
    margin: theme.spacing(0.3, 0, 0, 0)
  }
}));

function fetchNode() {
  if (AIIDA_RESTAPI_URL) {
    return fetch(url)
      .then(result => result.json())
      .then(result => {
        if (result.data) {
          return result;
        } else {
          return false;
        }
      })
      .catch(error => {
        return false;
      });
  }
}

export default function Nodes() {
  const [data, setData] = useState({});
  const [isLoaded, setLoaded] = useState(false);
  const [isDatabase, setDatabase] = useState(true);
  const [isRestAPI, setRestAPI] = useState(false);

  //for split button
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [isIntervel, setTimeInterval] = useState(false);

  const classes = useStyles();
  const queryText = "select * from db_dbnode";

  var fetchInterval = 1000 * intervalTime[selectedIndex];

  const activeColor = isActive => {
    return isActive ? "secondary" : "disabled";
  };
  const activeColorButton = isActive => {
    if (isActive) return "secondary";
  };

  const activateDatabase = () => {
    setDatabase(true);
    setRestAPI(false);
  };
  const activateRestAPI = () => {
    setDatabase(false);
    setRestAPI(true);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
    setTimeInterval(true);
  };
  const switchInterval = () => {
    setTimeInterval(!isIntervel);
  };
  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  // const handleClose = event => {
  //   if (anchorRef.current && anchorRef.current.contains(event.target)) {
  //     return;
  //   }
  // };

  if (!isDatabase) {
    startRestAPI();
  }
  useEffect(() => {
    let didCancel = false;
    async function fetchData() {
      if (db_profile && isDatabase) {
        db.query(queryText, (err, res) => {
          if (!err && !didCancel) {
            setData(res.rows);
            setLoaded(true);
          }
        });
      } else if (isRestAPI) {
        fetchNode()
          .then(result => {
            if (result.data && !didCancel) {
              setData(result);
              setLoaded(true);
            }
          })
          .catch(error => setLoaded(false));
      }
    }

    if (isDatabase || isRestAPI) {
      fetchData();
      if (isIntervel) {
        setInterval(() => {
          fetchData();
        }, fetchInterval);
      }
    }
    return () => {
      didCancel = true;
    };
  }, [isDatabase, isRestAPI, fetchInterval, isIntervel]);

  let nodesTable;
  if (isLoaded && data) {
    if (isDatabase === false && isRestAPI === false) {
      nodesTable = (
        <div>
          You have to set the path to aiida config and start the postgress
          server or start remote REST API connection{" "}
        </div>
      );
    } else if (isDatabase && !isRestAPI && !data.data) {
      nodesTable = <NodesTable data={data} rest={isRestAPI} detailsPanel={isIntervel} />;
    } else if (isRestAPI && !isDatabase && data.data) {
      nodesTable = (
        <NodesTable data={data.data.nodes} rest={isRestAPI} detailsPanel={isIntervel} />
      );
    } else {
      nodesTable = (
        <div className={classes.loading}>
          <p>Switch on the live loading</p>
          <RotateRightIcon
            className="Loading"
            color="disabled"
            fontSize="large"
          />
        </div>
      );
    }
  } else {
    nodesTable = (
      <div className={classes.loading}>
        <p>Switch on the live loading</p>
        <RotateRightIcon
          className="Loading"
          color="disabled"
          fontSize="large"
        />
      </div>
    );
  }
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.toolbar}>
            <div className={classes.toolbarIcons}>
              <Grid container spacing={1}>
                <Grid item xs={10}>
                  <Button
                    disableRipple={true}
                    variant="outlined"
                    className={classes.button}
                    onClick={activateDatabase}
                  >
                    <BallotIcon color={activeColor(isDatabase)} />
                  </Button>
                  <Button
                    disableRipple={true}
                    variant="outlined"
                    onClick={activateRestAPI}
                  >
                    <CastConnectedIcon color={activeColor(isRestAPI)} />
                  </Button>
                </Grid>
                <Grid item xs={2} align="right">
                  <ButtonGroup
                    disableRipple={true}
                    size="small"
                    className={classes.intervalButton}
                    color={activeColorButton(isIntervel)}
                    ref={anchorRef}
                    aria-label="split button"
                  >
                    <Button
                      disableRipple={true}
                      size="small"
                      onClick={switchInterval}
                    >
                      {intervalRep[selectedIndex]}
                    </Button>
                    <Button
                      disableRipple={true}
                      size="small"
                      color={activeColorButton(isIntervel)}
                      aria-owns={open ? "menu-list-grow" : undefined}
                      aria-haspopup="true"
                      onClick={handleToggle}
                    >
                      <ArrowDropDownIcon />
                    </Button>
                  </ButtonGroup>
                </Grid>
              </Grid>
              <Popper
                style={{ zIndex: 2000 }}
                size="small"
                open={open}
                anchorEl={anchorRef.current}
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === "bottom" ? "center top" : "center bottom"
                    }}
                  >
                    <Paper id="menu-list-grow">
                      <MenuList>
                        {intervalRep.map((option, index) => (
                          <MenuItem
                            key={option}
                            selected={index === selectedIndex}
                            onClick={event => handleMenuItemClick(event, index)}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.root}>{nodesTable}</Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
