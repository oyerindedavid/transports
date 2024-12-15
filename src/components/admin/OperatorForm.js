import React, { useState, useEffect } from 'react';
import { modifyOperator, addOperator } from '../../hooks/https';

// This form is used for both editting and operator creation.
function OperatorForm({ setActive, operator }) {

  const [formData, setFormdata] = useState({
    fullName: '',
    email: '',
    privilege: '',
  });

  // UseEffect to populate form when editing
  useEffect(() => {
    if (operator) {
      setFormdata({
        id: operator._id || '',
        fullName: operator.fullName || '',
        email: operator.email || '',
        privilege: operator.privilege || '',
      });
    }
  }, [operator]);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Determine if we're adding or editing
    if (operator) {
      // Edit logic (send PUT/POST request)
      // console.log('Editing operator', formData);

      try {
        // Wait for the API call to modify the operator
        const editUser = await modifyOperator(formData);
        console.log(formData);

        if (!editUser) {
          alert("Error updating operator info.");
          return;
        }

        // Optional: Handle the response from the server, e.g., showing a success message
        alert("Success!");

        // Refresh the page or update the state to reflect the changes
        window.location.reload();
        setActive(false);
      } catch (err) {
        console.error("Error updating operator:", err);
      }

    } else {

      // Add logic (send POST request)
      try {
        addOperator(formData).then((res) => {
          if (res.ok) {
            alert('Success');
            setActive(false);
            // Refresh the page or update the state to reflect the changes
            window.location.reload();
            return res.json();
          } else {
            alert('Operator already exist.');
          }
        }).catch(error => {
          // This block catches any errors in the process
          console.error('Error:', error);
        });
        setActive(false);

        // if (response.ok) {
        //   console.log('Done!');
        // } else {
        //   alert('Operator already exist.')
        // }
      } catch (err) {
        alert('Operator already exist.')
      }
      console.log('Adding new operator', formData);
    }

    // Close the form after submission
  };

  const onChange = (e) => {
    setFormdata({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <div className='bg-blue-100 p-3 max-w-sm mx-auto py-4 rounded-lg'>
      <form onSubmit={onSubmit}>
        <div className="mb-5 max-w-sm">
          <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900">Full name</label>
          <input
            type="text"
            id="fullName"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block w-full p-2.5"
            placeholder="Full name"
            required
            value={formData.fullName}
            onChange={onChange}
          />
        </div>

        <div className="mb-5 max-w-sm">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block w-full p-2.5"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={onChange}
          />
        </div>

        <div className="mb-5 max-w-sm">
          <label htmlFor="privilege" className="block mb-2 text-sm font-medium text-gray-900">Privilege</label>
          <select id="privilege" name="privilege" required value={formData.privilege} onChange={onChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block w-full p-2.5'>
            <option value="">Select Privilege</option>
            <option value="Admin">Admin</option>
            <option value="Operator">Operator</option>
          </select>
        </div>

        <button type="submit" className='mb-3 text-white bg-blue-700 
        hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium 
        rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
          {operator ? 'Edit' : 'Add'} Operator
        </button>
      </form>
    </div>
  );
}

export default OperatorForm;
