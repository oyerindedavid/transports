import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserRequestPage from './pages/userRequestPage';
import SigninOperator from './pages/signinOperator';
import Viewrequests from './pages/Viewrequests';
import Modifyoperator from './pages/Modifyoperator';
import OperatorContextProvider from './hooks/OperatorContext';
import ProtectedRoute from './hooks/ProtectedRoute';
import Loader from './components/Loader';
import Welcome from './components/Welcome';

function App() {
  const [loading, setLoading] = useState(); 
  const location = useLocation(); 

  // Detect route changes and trigger loader
  useEffect(() => {
    setLoading(true); // Start loading when route changes

    // Simulate async route loading or component mounting delay
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after content is ready (e.g., after a delay)
    }, 1000); 

    return () => clearTimeout(timer); 
  }, [location]); // Runs every time the route changes

  return (
    <OperatorContextProvider>
      
      {/* Show loader if loading is true */}
      {loading ? <Loader /> : (
        <Routes>
          <Route exact path='/' element={<Welcome />} />

          <Route exact path='/requests' element={<UserRequestPage />} />

          <Route path='/operator'>
            <Route index element={<SigninOperator />} />

            <Route path='viewrequests' element={
              <ProtectedRoute>
                <Viewrequests />
              </ProtectedRoute>
            } />

            <Route path='modify' element={
              <ProtectedRoute>
                <Modifyoperator />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      )}
    </OperatorContextProvider>
  );
}

export default App;