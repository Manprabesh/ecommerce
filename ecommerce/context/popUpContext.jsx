import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
const PopupContext = createContext();

export function PopupProvider(props) {
    const [url, setUrl] = useState(null);
    const [popup, setPopup] = useState(null);
    const navigate = useNavigate()
    const [action, setAction] = useState(null);
    // console.log("popup childre", children)
    function showPopup({ message, type = "error", duration = null, route = null, work }) {
        // console.log("workingg --->", work)
        setPopup({ message, type });
        setAction(() => work);
        setUrl(route)
        if (duration) {
            setTimeout(() => {
                setPopup(null);
            }, duration);
        }
    }


    function closePopup(confirm = false) {
        setPopup(null);
        console.log("kpojpojjjjjj",confirm)
        console.log("action name",typeof action)

        if (confirm && typeof action === "function") {
            action();
        }

        if (url) {
            navigate(url);
        }

        setAction(null);
        setUrl(null);
    }


    return (
        <PopupContext.Provider value={{ popup, showPopup, closePopup }}>
            {props.children}
        </PopupContext.Provider>
    );
}

export function usePopup() {
    return useContext(PopupContext);
}

// const PopupContext = createContext("hello");




