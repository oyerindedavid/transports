import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../hooks/OperatorContext';
import { loginOperator } from '../hooks/https';
import Loader from '../components/Loader';

function SigninOperator() {
  const navigate = useNavigate();
  const { setUserInfo, loader, setLoader } = useContext(UserContext);
  const [email, setEmail] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setEmail(email);
    setLoader(true)

    await loginOperator(email).then((data) => {
      if (data.success) {  // Check if data exists and if there's no error
        // Populating user container
        setUserInfo(data.operator);
        setLoader(false);
        navigate('/operator/viewrequests/');
      } else {
        // Display the error message if available
        alert('Incorrect Credentials');
        setLoader(false);
      }

    });
  }
  return (
    <> {!loader ?
      <div id='login' className='max-w-sm py-5'>
        <h3 className='font-400 text-center my-2 font-bold'>Login</h3>

        <form className="" onSubmit={onSubmit}>
          <div className="mb-5 max-w-sm">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="E.g operator@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update state directly
            />
          </div>

          <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Signin
          </button>
        </form>
      </div> : <Loader />}
    </>
  );
}

export default SigninOperator;