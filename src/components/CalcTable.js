import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
}));

const CalcTable = (props) => {
  const classes = useStyles();
  const items = props.data

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell align="left">PK</TableCell>
            <TableCell align="left">Created</TableCell>
            <TableCell align="left">Process Label</TableCell>
            <TableCell align="left">Process State</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.data.calculations.map(item => (
            <TableRow key={item.id}>
              <TableCell component="th" scope="item">{item.id}</TableCell>
              <TableCell align="left">{item.ctime}</TableCell>
              <TableCell align="left">{item.attributes.process_label}</TableCell>
              <TableCell align="left">{item.attributes.process_state} [{item.attributes.exit_status}]</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default CalcTable