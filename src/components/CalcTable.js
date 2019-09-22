import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  }
}));

function getLast(data, loc=1){
  return data[data.length-loc]
}
function statusFormat(status, code){
    if(code!=null){
      if(code === 0 ){
        return (
        <span>{status}&nbsp;&nbsp;<span style={{color:'green'}}><b>{code}</b></span></span>
        )
      }else{
        return(
          <span>{status}&nbsp;&nbsp;<span style={{color:'red'}}><b>{code}</b></span></span>
        )
      }
      
    }else if(status === undefined){
      return ''
    }else{
      return `${status}`
    }
}


const CalcTable = props => {
  const classes = useStyles();
  const items = props.data;

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell align="left">PK</TableCell>
            <TableCell align="left">Created</TableCell>
            <TableCell align="left">Node Label</TableCell>
            <TableCell align="left">Node Type</TableCell>
            <TableCell align="left">Node State</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.data.nodes.map(item => (
            <TableRow key={item.id}>
              <TableCell component="th" scope="item">
                {item.id}
              </TableCell>
              <TableCell align="left">{item.ctime}</TableCell>
              <TableCell align="left">
                {item.attributes.process_label}
              </TableCell>
              <TableCell align="left">{getLast(item.node_type.split('.'),2)}</TableCell>
              <TableCell align="left">{statusFormat(item.attributes.process_state, item.attributes.exit_status)}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default CalcTable;
