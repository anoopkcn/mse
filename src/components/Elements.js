import React from "react";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles(theme => ({
  attr: {
    color: "#7D7E7F",
    background: "#D9DBDE",
    padding: "4px 7px",
    borderRadius: 3
    // "&::after": {
    //   content: '"xx"'
    // }
  }
}));
export function Attr(props) {
  const classes = useStyles();
  return <span className={classes.attr}>{props.children}</span>;
}
