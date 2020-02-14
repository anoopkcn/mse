import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Modal from "react-modal";
import NotesIcon from "@material-ui/icons/Notes";
import Divider from "@material-ui/core/Divider";
import { db } from "../lib/global";
import {catRemoteFile} from "../lib/utils";

/**
 * AiiDA node REPORT react component
 * @param {object} props [reported message from AiiDA]
 */
function LogData(props) {
  var data = props.data;
  if (data.length !== 0) {
    return data.map(row => (
      <span key={row.id}>
        {row.message}
        <Divider />
      </span>
    ));
  } else {
    return <span>No REPORT associated with this calculation</span>;
  }
}
function CatData(props) {
  var data = props.data;
  if (data.length !== 0) {
    return data.map((row, index) => (
      <p style={{ margin: 0 }} key={index}>
        {row}
      </p>
    ));
  } else {
    return <span>Loading from remote...</span>;
  }
}

export function LogButton(props) {
  var rowData = props.data;
  const [data, setData] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event, pk) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    if (pk) getLog(pk);
    setData([]);
    setLoaded(false);
  };

  const open = Boolean(anchorEl);

  function getLog(pk) {
    const queryText = `SELECT * FROM public.db_dblog where dbnode_id = ${pk} order by id desc`;
    if (!isLoaded) {
      db.query(queryText, (err, res) => {
        if (res.rows) {
          setData(res.rows);
          // console.log(res.rows.length);
          setLoaded(true);
        }
      });
    }
  }
  return (
    <React.Fragment>
      <Button
        disableRipple={true}
        onClick={event => handleClick(event, rowData.id)}
      >
        <NotesIcon
          fontSize="small"
          color={
            rowData.node_type.split(".")[0] !== "process"
              ? "disabled"
              : "secondary"
          }
        />
      </Button>
      {rowData.node_type.split(".")[0] === "process" && (
        <Modal style={{ zIndex: 2100 }} isOpen={open}>
          <div style={
            { width:'77%',
            position:'fixed', 
            paddingTop:4, 
            paddingBottom:4, 
            backgroundColor:'#ffffff',
            borderBottom: "1px solid #cccccc",
            }}>
            <Button
              disableRipple={true}
              variant="outlined"
              fontSize="small"
              style={{ float: "right" }}
              onClick={handleClick}
            >
              Close
            </Button>
          </div>
          <div style={{height:50}}></div>
          <LogData data={data} />
        </Modal>
      )}
    </React.Fragment>
  );
}
export function CatFile(props) {
  var rowData = props.data;
  var computerId = props.computerId;
  var remotePath = props.remotePath;
  var remoteWorkdir = (remotePath)? remotePath:props.remoteWorkdir;
  const [data, setData] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  var hostname;
  var username;

  const handleClick = (event, remoteWorkdir, computerId) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    if (remoteWorkdir) getText(remoteWorkdir, computerId);
    setData([]);
    setLoaded(false);
  };

  const open = Boolean(anchorEl);

  function getText(remoteWorkdir, computerId) {
    const queryText = `SELECT * FROM public.db_dbauthinfo where dbcomputer_id = ${computerId} order by id desc`;
    if (!isLoaded) {
      db.query(queryText, (err, res) => {
        if (res.rows.length) {
          hostname = res.rows[0]["auth_params"]["gss_host"];
          username = res.rows[0]["auth_params"]["username"];
          setData(catRemoteFile(hostname, username, remoteWorkdir, rowData));
          setLoaded(true);
        }else{
          setData(['This node might be imported from a different database. Computer ID cannot be determined. Please use the terminal'])
          setLoaded(true);
        }
      });
    }
  }
  return (
    <React.Fragment>
      <Button
        disableRipple={true}
        onClick={event => handleClick(event, remoteWorkdir, computerId)}
      >
        {rowData}
      </Button>
      <Modal style={{ zIndex: 2100 }} isOpen={open}>
        <div style={{ height: 50 }}>
          <Button
            disableRipple={true}
            variant="outlined"
            fontSize="small"
            style={{ float: "right" }}
            onClick={handleClick}
          >
            Close
          </Button>
        </div>
        <div style={{ height: "80vh", overflow: "scroll" }}>
          {<CatData data={data} />}
        </div>
      </Modal>
    </React.Fragment>
  );
}
