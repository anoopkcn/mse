import React from "react";
import { forwardRef } from 'react';
import MaterialTable from 'material-table'
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
const NodesTable = props =>{
    var allNodes = props.data.data.nodes
    // console.log(allNodes[0].attributes)
    function getLast(data, loc=1){
      return data[data.length-loc]
    }
    function statusFormat(status, code){
        if(code!=null){
          return `${status}[${code}]`
        }else if(status === undefined){
          return ''
        }else{
          return `${status}`
        }
    }
    return (
      <MaterialTable
        title="Nodes"
        options={{
          pageSize: 10,
          sorting: true
        }}
        icons={{
          SortArrow: forwardRef((props, ref) => <ExpandLessIcon {...props} ref={ref} />),
        }}
        columns={[
          { title: 'PK', field: 'id', type: 'numeric', defaultSort: 'desc'},
          { title: 'Created', field: 'ctime', type: 'datetime', },
          { 
            title: 'Node Type', 
            field: 'node_type',
            render: rowData => <span>{getLast(rowData.node_type.split('.'),2)}</span>
          },
          { title: 'Label', field: 'label' },
          { 
            title: 'Status', 
            field: 'attributes.process_state',
            render: rowData => <span>{statusFormat(rowData.attributes.process_state,rowData.attributes.exit_status)}</span>
          },
        ]}
        data={allNodes}
      />
    )
}
export default NodesTable;