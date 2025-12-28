import { createContext, useContext, useEffect, useState } from "react";

const PopupContext = createContext();

export function PopupProvider(props) {
    const [popup, setPopup] = useState(null);
    // console.log("popup childre", children)
    function showPopup({ message, type = "error", duration = 3000 }) {
        setPopup({ message, type });

        if (duration) {
            setTimeout(() => {
                setPopup(null);
            }, duration);
        }
    }

    function closePopup() {
        setPopup(null);
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




