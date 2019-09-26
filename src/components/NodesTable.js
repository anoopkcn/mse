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
  details: {
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

function createData(property, content) {
  return { property, content };
}

function DetailsPanel(props) {
  const rowData = props.data;
  const classes = useStyles();
  const rows = [
    createData("uuid", rowData.uuid),
    createData("Node Type", rowData.node_type),
    createData("Created", rowData.ctime.toGMTString()),
    createData("Modified", rowData.mtime.toGMTString()),
    createData("Label", rowData.label),
    createData("Description", rowData.description)
  ];
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
              {rows.map(
                row =>
                  row.content !== "" && (
                    <ListItem key={"key" + row.property}>
                      <ListItemText
                        primary={
                          <span>
                            <Attr>{row.property}</Attr> {row.content}
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
                        <Attr>Process Type</Attr> {rowData.process_type}
                      </span>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box
            style={{ height: 300 }}
            component="div"
            overflow="scroll"
            className={classes.box}
          ></Box>
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
