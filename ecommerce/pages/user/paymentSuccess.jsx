import { useEffect } from "react";
function Success(){
    useEffect(()=>{
        localStorage.removeItem("toatl_price")
        localStorage.removeItem("cart")
    })
    return(
        <>
        <h1>Payment Success</h1>
        </>
    )
}

export default Success;