import { Outlet } from "react-router";
import api from "../services/api";
import { useEffect, useState } from "react";
import AuthRequired from "../components/NoAuth";

function Dashboard() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        (async () => {
            const response = await api.isAuthenticated();
            setUser(response.user)
            console.log("response", response)
        })()
    }, [])
    return (
        <>

            {
                console.log("getting user", user)
            }
            {

                user ? <Outlet /> : <AuthRequired />
            }
        </>
    )
}

export default Dashboard