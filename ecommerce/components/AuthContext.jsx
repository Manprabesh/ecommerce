import { createContext, useContext, useState, useEffect} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userID, setUserID] = useState(() => {
        return localStorage.getItem("userID");
    });

    useEffect(() => {
        if (userID) {
            localStorage.setItem("userID", userID);
            console.log("the local data",localStorage.getItem("userID"))
        } else {
            localStorage.removeItem("userID");
        }
    }, [userID]);

    return (
        <AuthContext.Provider value={{ userID, setUserID }}>
            {children}
        </AuthContext.Provider>
    );
};


export const UseAuth = () => {
    return useContext(AuthContext)
}