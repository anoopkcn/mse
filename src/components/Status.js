import React, { useEffect , useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {PYENV_BIN_DIR} from './global'


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
      exec(`${PYENV_BIN_DIR}/verdi status`, (error, stdout, stderr) => { 
        setData(stdout); 
    });
    }, []);

    const classes = useStyles();
    console.log(items)
    return (
            <List className={classes.root}>
                    <List>
                      <ListItem> 
                        <ListItemText primary="profile :" />
                      </ListItem>
                      <ListItem> 
                        <ListItemText primary="repository :" />
                      </ListItem> 
                      <ListItem> 
                        <ListItemText primary="postgres :" />
                      </ListItem> 
                      <ListItem> 
                        <ListItemText primary="rabbitmq :" />
                      </ListItem>
                       <ListItem> 
                        <ListItemText primary="daemon :" />
                      </ListItem>
                   </List>
            </List>

    )
}

  
