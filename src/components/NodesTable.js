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
import { Attr } from "./Elements";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  box: {
    border: "1px solid #cccccc",
    padding: theme.spacing(2)
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

function DetailsPanel(props) {
  const rowData = props.data;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Box className={classes.box}>
            <List dense={true}>
              <ListItem>
                <ListItemText
                  primary={
                    <span>
                      <Attr>PK</Attr> {rowData.id}
                    </span>
                  }
                />
                <ListItemText
                  primary={
                    <span>
                      <Attr>User ID</Attr> {rowData.user_id}
                    </span>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <span>
                      <Attr>uuid</Attr> {rowData.uuid}
                    </span>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <span>
                      <Attr>node_type</Attr> {rowData.node_type}
                    </span>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <span>
                      <Attr>Created</Attr> {rowData.ctime.toGMTString()}
                    </span>
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={
                    <span>
                      <Attr>Modified</Attr> {rowData.mtime.toGMTString()}
                    </span>
                  }
                />
              </ListItem>
              {rowData.node_type.split(".")[0] === "process" && (
                <ListItem>
                  <ListItemText
                    primary={
                      <span>
                        <Attr>Process Type</Attr> {rowData.process_type}
                      </span>
                    }
                  />
                </ListItem>
              )}
              {rowData.label !== "" && (
                <ListItem>
                  <ListItemText
                    primary={
                      <span>
                        <Attr>Label</Attr> {rowData.label}
                      </span>
                    }
                  />
                </ListItem>
              )}
              {rowData.description !== "" && (
                <ListItem>
                  <ListItemText
                    primary={
                      <span>
                        <Attr>Description</Attr> {rowData.description}
                      </span>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box className={classes.box}>calculation details</Box>
        </Grid>
      </Grid>
    </div>
  ); //<div>{rowData.node_type}</div>;
}

export default function NodesTable(props) {
  var allNodes = props.data;
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
        pageSize: 15,
        pageSizeOptions: [],
        sorting: true,
        grouping: false
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
            <span>
              {statusFormat(
                rowData.attributes.process_state,
                rowData.attributes.exit_status
              )}
            </span>
          )
        }
      ]}
      data={allNodes}
      detailPanel={[
        {
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
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
    />
  );
}
