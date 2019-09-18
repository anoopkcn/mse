import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SettingsInputCompositeIcon from '@material-ui/icons/SettingsInputComposite';
import BarChartIcon from '@material-ui/icons/BarChart';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import AssignmentIcon from '@material-ui/icons/Assignment';

export const mainListItems = (
    <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <SettingsInputCompositeIcon />
      </ListItemIcon>
      <ListItemText primary="Plugins" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Plots" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <CloudDownloadIcon />
      </ListItemIcon>
      <ListItemText primary="Search" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
    <div>
    <ListSubheader inset>Groups</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="MAPI" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="CsPbI3" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="impurity" />
    </ListItem>
  </div>
);