import React, { useState, useEffect } from 'react';
import { getAllOperators } from '../../hooks/https';
import { FaUserEdit } from "react-icons/fa";

function Edituser({ setOperatorToEdit, setActive }) {
  const [operators, setOperators] = useState([]);

  // Fetch operators when component mounts
  useEffect(() => {
    getAllOperators().then((data) => {
      setOperators(data);
    });
  }, []);

  const editOperator = (operator) => {
    setOperatorToEdit(operator); // Set the operator to edit
    setActive(true); // Show the form for editing
  };

  return (
    <div className='max-w-sm mx-auto py-1 my-1'>
      {/* Display the list of operators sorted by the latest added */}
      {operators
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))  // Sort by date descending
        .map((operator) => (
          <div key={operator._id} className='flex justify-between bg-blue-100 rounded-lg my-3 py-2'>
            <div>{operator.fullName}</div>
            <div onClick={() => editOperator(operator)}>
              {/* Edit icon */}
              <div role="img" aria-label="edit">
                <FaUserEdit size={25} />
              </div>
            </div>
          </div>
        ))}
    </div>

  );
}

export default Edituser;