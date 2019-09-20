import React, { useEffect, useState } from "react";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { amber } from '@material-ui/core/colors';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import Box from '@material-ui/core/Box';

import { VERDI } from '../lib/global'
import {utils} from '../lib/utils'

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

    useEffect(() => {
        if(VERDI){
            var stdout = utils.execSync(`${VERDI} status | grep -E "profile:|repository:|postgres:|rabbitmq:|daemon:"`).toString()
            setData(stdout.split('\n'))
        }
    }, []);

    const classes = useStyles();
    const classes1 = useStyles1();
    if (!VERDI) {
        return (
            <List className={classes1.root} dense={true}>
           <SnackbarContent
            className={clsx(classes1['warning'], 'noVerdi')}
            aria-describedby="client-snackbar"
            message={
              <span id="client-snackbar" className={classes1.message}>
                <WarningIcon className={clsx(classes1.icon, classes1.iconVariant)} />
                <Box fontStyle="italic" m={1}>
                  Did not find python environment. Add path to the <code>bin</code> of your environment in <code>~/.elemental</code> JSON file. 
                    {'{'}<code>"python_env": "/path/to/python_env"</code>{'}'}
                  </Box>
              </span>
            }
          />
        </List>
        )
    } else {
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