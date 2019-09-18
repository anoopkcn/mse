import React, { useEffect , useState} from "react";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { amber } from '@material-ui/core/colors';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';

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

const useStyles1 = makeStyles(theme => ({
  warning: {
    backgroundColor: amber[300],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    color: "#533F02"
  },
}));


export default function Status() {
    const [items, setData] = useState([]);
    const [error, setError] = useState([])

    useEffect(() => {
      exec(`${PYENV_BIN_DIR}/verdi status | grep -E "profile:|repository:|postgres:|rabbitmq:|daemon:"`, (err, stdout, stderr) => { 
        setData(stdout.split('\n'))
        setError([err,stderr])
    });
    }, []);
    const classes = useStyles();
    const classes1 = useStyles1();
    if (error[0]){
      return (
        <List className={classes1.root} dense={true}>
           <SnackbarContent
            className={clsx(classes1['warning'], 'noVerdi')}
            aria-describedby="client-snackbar"
            message={
              <span id="client-snackbar" className={classes1.message}>
                <WarningIcon className={clsx(classes1.icon, classes1.iconVariant)} />
                <p><code>verdi</code> &nbsp;is not defined.
                  Add path to the <code>bin</code> directory of your python environment in <code>~/.elemental</code> json file.
                  Example: {'{'}<code>"PYENV_BIN_DIR":"/home/User/pyenv/bin"</code>{'}'}
                  </p>
              </span>
            }
          />
        </List>
        )
    }else{
      return (
          <List className={classes.root} dense={true}>
            { items.map( (item,i) =>
                    <ListItem key={i}> 
                      <ListItemText primary={item}/>
                    </ListItem>
              )
          }
          </List>
      )
  }
}

  
