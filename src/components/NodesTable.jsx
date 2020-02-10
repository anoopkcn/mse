import React from "react";
import { forwardRef } from "react";
import MaterialTable from "material-table";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { makeStyles } from "@material-ui/core/styles";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { withStyles } from "@material-ui/core/styles";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import DeviceHubIcon from "@material-ui/icons/DeviceHub";
// import { db } from "../lib/global";
import { flattenObject, /*lsRemoteDir*/} from "../lib/utils";
import { LogButton, CatFile } from "./Actions";
import { Attr } from "./Elements";

const { clipboard } = window.require("electron");

function copyToClip(text) {
  clipboard.writeText(text.toString());
}
const ExpansionPanel = withStyles({
  root: {
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0
    },
    "&:before": {
      display: "none"
    },
    "&$expanded": {
      margin: "auto"
    }
  },
  expanded: {}
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    minHeight: 20,
    "&$expanded": {
      minHeight: 20
    }
  },
  content: {
    "&$expanded": {
      margin: "0"
    }
  },
  expanded: {}
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing(1)
  }
}))(MuiExpansionPanelDetails);

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  details: {
    padding: theme.spacing(2)
  },
  box: {
    border: "1px solid rgba(0, 0, 0, .125)",
    // padding: theme.spacing(0)
  },
  grid2: {
    border: 0,
    // padding: theme.spacing(0)
  }
}));

function getLast(data, loc = 1) {
  return data[data.length - loc];
}

function statusFormat(status, code) {
  if (code != null) {
    if (code === 0) {
      return (
        <span>
          {status}&nbsp;&nbsp;(
          <span style={{ color: "green" }}>
            <b>{code}</b>
          </span>
          )
        </span>
      );
    } else {
      return (
        <span>
          {status}&nbsp;&nbsp;(
          <span style={{ color: "red" }}>
            <b>{code}</b>
          </span>
          )
        </span>
      );
    }
  } else if (status === undefined) {
    return "";
  } else {
    return `${status}`;
  }
}

// Define recursive function to print nested values

function createData(property, content) {
  return { property, content };
}

function DetailsPanel(props) {
  const rowData = props.data;
  const classes = useStyles();
  function getMetadata(data_t) {
    var data;
    data=data_t.attributes
    var mRows = [];
    var obj = flattenObject(data);
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        mRows.push(createData(key, obj[key]));
      }
    }
    return mRows;
  }
  function getFiles(data, computerId) {
    var mRows = [];
    var remoteDir = data.remote_workdir;
    var retrieveList = data.retrieve_list;
    var remotePath = data.remote_path;
    if (remoteDir && retrieveList) {
      return retrieveList;
    } else if (remotePath) {
      // const queryText = `SELECT * FROM public.db_dbauthinfo where dbcomputer_id = ${computerId} order by id desc`;
      // db.query(queryText, (err, res) => {
      //   if (res.rows) {
      //     var hostname = res.rows[0]["auth_params"]["gss_host"];
      //     var username = res.rows[0]["auth_params"]["username"];
      //     mRows=lsRemoteDir(hostname, username, remotePath) //.slice(0,-1).map((val,index)=> createData(index,val) )
      //   }
      // });
      return mRows
    } else {
      return mRows;
    }
  }

  const rows = [
    createData("uuid", rowData.uuid),
    createData("Node Type", rowData.node_type),
    createData("Created", rowData.ctime.toString()),
    createData("Modified", rowData.mtime.toString()),
    createData("Label", rowData.label.trim()),
    createData("Description", rowData.description.trim())
  ];
  const metareg=RegExp('detailed_job_info.*')
  return (
    <div className={classes.details}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box
            style={{ height: 300 }}
            component="div"
            overflow="scroll"
            className={classes.box}
          >
            <ExpansionPanelSummary id="panel1a-header">
              <Typography className={classes.heading}>Summary</Typography>
            </ExpansionPanelSummary>
            <List dense={true}>
              <ListItem>
                <ListItemText
                  primary={
                    <span>
                      <span onClick={() => copyToClip(rowData.id)}>
                        <Attr>PK</Attr>
                      </span>{" "}
                      {rowData.id}
                    </span>
                  }
                />
                <ListItemText
                  primary={
                    <span>
                      <span onClick={() => copyToClip(rowData.user_id)}>
                        <Attr>User ID</Attr>
                      </span>{" "}
                      {rowData.user_id}
                    </span>
                  }
                />
              </ListItem>
              {rows.map(
                row =>
                  row.content !== "" && (
                    <ListItem key={"key" + row.property}>
                      <ListItemText
                        primary={
                          <span>
                            <span onClick={() => copyToClip(row.content)}>
                              <Attr>{row.property}</Attr>
                            </span>{" "}
                            {row.content}
                          </span>
                        }
                      />
                    </ListItem>
                  )
              )}

              {rowData.node_type.split(".")[0] === "process" && (
                <ListItem>
                  <ListItemText
                    primary={
                      <span>
                        <span onClick={() => copyToClip(rowData.process_type)}>
                          <Attr>Process Type</Attr>
                        </span>{" "}
                        {rowData.process_type}
                      </span>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Box>
        </Grid>
        <Grid className={classes.grid2} item xs={12} sm={6}>
          <Box
            style={{ height: 300 }}
            component="div"
            overflow="scroll"
            className={classes.box}
          >
            <div>
              <ExpansionPanel square>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>Files</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <List dense={true}>
                    {getFiles(rowData.attributes,rowData.dbcomputer_id).map( (row,index) => (
                      <ListItem key={index}>
                        <CatFile
                          data={row}
                          computerId={rowData.dbcomputer_id}
                          remoteWorkdir={rowData.attributes.remote_workdir}
                          remotePath={rowData.attributes.remote_path}
                        /> 
                      </ListItem>
                    ))}
                  </List>
                </ExpansionPanelDetails>
              </ExpansionPanel>
              <ExpansionPanel square defaultExpanded={true}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <Typography className={classes.heading}>Metadata</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails> 
                  <List dense={true}>
                    {getMetadata(rowData).map(row => (
                      <ListItem key={"key" + row.property}>
                        <ListItemText
                          primary={!metareg.test(row.property) && 
                            <span>
                              <span onClick={() => copyToClip(row.content)}>
                                <Attr>{row.property}</Attr>
                              </span>{" "}
                              {row.content}
                            </span>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </div>
          </Box>
        </Grid>
      </Grid>
    </div>
  ); //<div>{rowData.node_type}</div>;
}

export default function NodesTable(props) {
  var allNodes = props.data;
  const REST = props.rest;
  var isDetailsPanel = props.detailsPanel;
  const classes = useStyles();

  return (
    <MaterialTable
      className={classes.root}
      title="Nodes"
      localization={{
        pagination: {
          previousTooltip: "",
          nextTooltip: "",
          firstTooltip: "",
          lastTooltip: ""
        },
        toolbar: {
          searchTooltip: ""
        }
      }}
      options={{
        pageSize: 20,
        pageSizeOptions: [],
        sorting: true,
        grouping: false,
        padding:"dense",
        headerStyle: {
          zIndex: 0
        }
      }}
      icons={{
        SortArrow: forwardRef((props, ref) => (
          <ExpandLessIcon {...props} ref={ref} />
        ))
      }}
      columns={[
        { title: "PK", field: "id", type: "numeric", defaultSort: "desc" },
        { title: "Modified", field: "mtime", type: "datetime" },
        {
          title: "Node Type",
          field: "node_type",
          render: rowData => (
            <span>{getLast(rowData.node_type.split("."), 2)}</span>
          )
        },
        { title: "Label", field: "label" },
        {
          title: "Status",
          field: "attributes.process_state",
          render: rowData => (
            <React.Fragment>
              {rowData.node_type.split(".")[0] === "process" && (
                <React.Fragment>
                  {REST===false && statusFormat(
                    rowData.attributes.process_state,
                    rowData.attributes.exit_status
                  )}
                </React.Fragment>
              )}
            </React.Fragment>
          )
        },
        {
          title: "",
          render: rowData => (
            <React.Fragment>
              <LogButton data={rowData} />
              <Button disableRipple={true}>
                <DeviceHubIcon fontSize="small" />
              </Button>
            </React.Fragment>
          )
        }
      ]}
      data={allNodes}
      detailPanel={[
        {
          // disabled: true,
          icon: () =>
            !isDetailsPanel ? (
              <ChevronRightIcon color="secondary" fontSize="small" />
            ) : (
              ""
            ),
          render: rowData => {
            if (!isDetailsPanel) {
              return <DetailsPanel data={rowData} />;
            } else {
              return false;
            }
          }
        }
      ]}
      // onRowClick={(event, rowData, togglePanel) => togglePanel()}
    />
  );
}
