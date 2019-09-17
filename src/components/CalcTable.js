import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';

const CalcTable = (props) => {
    const items = props.data
    return (
        <div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>PK</th>
                  <th>Created</th>
                  <th>Process label</th>
                  <th>Process State</th>
                </tr>
              </thead>
              <tbody>
                {items.data.calculations.map(item => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.ctime}</td>
                    <td>{item.attributes.process_label}</td>
                    <td>{item.attributes.process_state} [{item.attributes.exit_status}]</td>
                  </tr>
                ))}
                </tbody>
          </Table> 
        </div>
    );
};

export default CalcTable;
