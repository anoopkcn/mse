import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Modal from "react-modal";
import NotesIcon from "@material-ui/icons/Notes";
import Divider from "@material-ui/core/Divider";
import { db } from "../lib/global";

/**
 * AiiDA node REPORT react component
 * @param {object} props [reported message from AiiDA]
 */
function LogData(props) {
  var data = props.data;
  return data.map(row => (
    <span key={row.id}>
      {row.message}
      <Divider />
    </span>
  ));
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
          // console.log(res.rows);
          setLoaded(true);
        }
      });
    }
  }
  return (
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
      {rowData.node_type.split(".")[0] === "process" && (
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
          <LogData data={data} />
        </Modal>
      )}
    </Button>
  );
}
