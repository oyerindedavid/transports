import { React, createContext, useState, useEffect } from "react";

export const UserContext = createContext({});

// Manage signed-in operator's data throughout the appplication
export default function OperatorContextProvider({ children }) {
    const [loader, setLoader] = useState(false)
    
    const [userInfo, setUserInfo] = useState(() => {
        // Check if userInfo is already in localStorage
        const storedUserInfo = localStorage.getItem('userInfo');
        return storedUserInfo ? JSON.parse(storedUserInfo) : null;
    });

    // Whenever userInfo changes, update localStorage
    useEffect(() => {
        if (userInfo) {
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        } else {
            localStorage.removeItem('userInfo'); // Cleanup when logged out
        }
    }, [userInfo]);

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, loader, setLoader }}>
            {children}
        </UserContext.Provider>
    )
}