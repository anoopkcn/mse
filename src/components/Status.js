import React, { useEffect , useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


// const fs = window.require('fs')
// const os = window.require('os')
const exec = window.require('child_process').exec;


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

export default function Status() {
    const [items, setData] = useState([]);

    useEffect(() => {
      exec('ls', (error, stdout, stderr) => { 
        setData(stdout); 
    });
    }, []);

    const classes = useStyles();
    console.log(items)
    return (
            <List className={classes.root}>
              { items && items.options &&
                    <List>
                      <ListItem> 
                        <ListItemText primary="hello" />
                      </ListItem>
                   </List>
              }
            </List>

    )
}