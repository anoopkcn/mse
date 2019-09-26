import React from "react";
import { forwardRef } from "react";
import MaterialTable from "material-table";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { makeStyles } from "@material-ui/core/styles";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: "0 0 0 0"
  }
}));

const NodesTable = props => {
  var allNodes = props.data;
  var isDetailsPanel = props.detailsPanel;

  const classes = useStyles();

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
        sorting: true
      }}
      icons={{
        SortArrow: forwardRef((props, ref) => (
          <ExpandLessIcon {...props} ref={ref} />
        ))
      }}
      columns={[
        { title: "PK", field: "id", type: "numeric", defaultSort: "desc" },
        { title: "Created", field: "ctime", type: "datetime" },
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
              return <div>{rowData.attributes.process_state}</div>;
            } else {
              return false;
            }
          }
        }
      ]}
      onRowClick={(event, rowData, togglePanel) => togglePanel()}
    />
  );
};
export default NodesTable;
