import React from "react";
import "../index.css";

const DataTable = ({ customerData, setEdit, deleteCustomer }) => {
  const handleClick = (e) => {
    setEdit(e.target.dataset.id);
  };
  const handleDelete = (e) => {
    deleteCustomer(e.target.dataset.id);
  };
  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr className="table-header">
          <th scope="col">Customer ID</th>
          <th scope="col">Customer Name</th>
          <th scope="col">Email</th>
          <th scope="col">Phone No</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        {customerData.map((e, i) => (
          <tr key={i}>
            <td>{e.CustomerID}</td>
            <td>{e.CustomerName}</td>
            <td>{e.Email}</td>
            <td>{e.PhoneNo}</td>
            <td>
              <i
                className="fa fa-edit cursor-pointer"
                onClick={handleClick}
                data-id={i}
              ></i>
              <i
                className="fa fa-trash ml-4 cursor-pointer"
                onClick={handleDelete}
                data-id={e.CustomerID}
              ></i>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
