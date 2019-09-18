import React, { useEffect , useState} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';


const fs = window.require('fs')
const os = window.require('os')


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));

const PROFILE_FILE = `${os.homedir()}/.aiida/config.json`

export default function Profile() {
    const [items, setData] = useState([]);

    useEffect(() => {
     fs.readFile(PROFILE_FILE, 'utf-8', (err, data) => {setData(JSON.parse(data)) });
    }, []);

    const classes = useStyles();
    return (
            <List className={classes.root}>
             
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="User" src="" />
                </ListItemAvatar>
                { items && items.options && 
                    <ListItemText
                      primary={items.options.user_first_name+' ' + items.options.user_last_name}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" className={classes.inline} color="textPrimary">
                            {items.default_profile}&nbsp;-&nbsp;
                          </Typography>
                          default profile
                        </React.Fragment>
                      }
                    />
                }
              </ListItem>
              <Divider />
              { items && items.options &&
                <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                    <List dense={true}>
                      <ListItem> 
                        <ListItemText primary={'Engine : '+items.profiles[items.default_profile].AIIDADB_ENGINE} />
                      </ListItem>
                     <ListItem> 
                        <ListItemText primary={'Backend : ' +items.profiles[items.default_profile].AIIDADB_BACKEND} />
                      </ListItem>
                   </List>
                   </Grid>
                   <Grid item xs={12} md={6}>
                    <List dense={true}>
                      <ListItem> 
                        <ListItemText primary={'DB User : '+items.profiles[items.default_profile].AIIDADB_USER} />
                      </ListItem>
                     <ListItem> 
                        <ListItemText primary={'DB Host : '+items.profiles[items.default_profile].AIIDADB_HOST+":"+items.profiles[items.default_profile].AIIDADB_PORT} />
                      </ListItem>
                   </List>
                   </Grid>
               </Grid>
              }
            </List>

    )
}
















