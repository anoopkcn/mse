import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import { AutoSizer, Column, Table } from "react-virtualized";

const styles = theme => ({
  flexContainer: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box"
  },
  tableRow: {
    cursor: "pointer"
  },
  tableRowHover: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200]
    }
  },
  tableCell: {
    flex: 1
  },
  noClick: {
    cursor: "initial"
  }
});

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 50,
    rowHeight: 50
  };

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={"left"}
        // {(columnIndex != null && columns[columnIndex].numeric) || false ? "right": "left"}
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(
          classes.tableCell,
          classes.flexContainer,
          classes.noClick
        )}
        variant="head"
        style={{ height: headerHeight }}
        align={"left"} //columns[columnIndex].numeric || false ? "right" : "left"
      >
        <span>{label}</span>
      </TableCell>
    );
  };
  statusFormat = (status, code) => {
    if (code != null) {
      if (code === 0) {
        return (
          <span>
            {status}&nbsp;&nbsp;
            <span style={{ color: "green" }}>
              <b>{code}</b>
            </span>
          </span>
        );
      } else {
        return (
          <span>
            {status}&nbsp;&nbsp;
            <span style={{ color: "red" }}>
              <b>{code}</b>
            </span>
          </span>
        );
      }
    } else if (status === undefined) {
      return "";
    } else {
      return `${status}`;
    }
  };

  getLast = (data, loc = 1) => data[data.length - loc];

  render() {
    const {
      classes,
      columns,
      rowHeight,
      headerHeight,
      ...tableProps
    } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            headerHeight={headerHeight}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={headerProps =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  cellDataGetter={({ rowData }) => {
                    switch (dataKey) {
                      case "node_type":
                        return this.getLast(rowData.node_type.split("."), 2);
                      case "attributes.process_label":
                        return rowData.attributes.process_label;
                      case "attributes.process_state":
                        return this.statusFormat(
                          rowData.attributes.process_state,
                          rowData.attributes.exit_status
                        );
                      default:
                        return rowData[dataKey];
                    }
                  }}
                  width={width}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool
    })
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number
};

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

// ---
const columns = [
  {
    label: "PK",
    dataKey: "id",
    numeric: true
  },
  {
    label: "Created",
    dataKey: "ctime"
  },
  {
    label: "Node Label",
    dataKey: "attributes.process_label"
  },
  {
    label: "Node Type",
    dataKey: "node_type"
  },
  {
    label: "Node State",
    dataKey: "attributes.process_state"
  }
];

export default function VirtualDataTable(props) {
  const rows = props.data.data.nodes;
  return (
    <VirtualizedTable
      rowCount={rows.length}
      rowGetter={({ index }) => rows[index]}
      columns={columns}
    />
  );
}
