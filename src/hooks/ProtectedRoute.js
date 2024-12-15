import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom';
import { UserContext } from './OperatorContext'

// Protect children routes from unnauthorized access
const ProtectedRoute = ({ children }) => {
    const { userInfo } = useContext(UserContext);

    if (!userInfo) {
        // If the user is not logged in, redirect to the login page
        return <Navigate to="/operator" />;
    }

    // If the user is authenticated, allow access to the protected route
    return children;
};

export default ProtectedRoute;