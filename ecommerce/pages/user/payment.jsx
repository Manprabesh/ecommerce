import api from "../../services/api";
import { useNavigate } from "react-router";
import { CartContext } from "../../components/CartContext";
import { useContext } from "react";
import { usePopup } from "../../context/popUpContext";
import { UseAuth } from "../../components/AuthContext";

function Payment({ address_id }) {
  const cart = useContext(CartContext)
  const { showPopup } = usePopup();
  // console.log("XXXXXXXXXXXXXXXXXx")
  // console.log("getting cart Price ", cart.price)
  // console.log("getting array of product", cart.products)
  const { userID } = UseAuth()
  const navigate = useNavigate()
  async function pay() {

    const response = await api.createOrder(
      {
        amount: cart.price,
        userID,
        currency: "INR",
        receipt: "this is a receipt",
        notes: "this is a note",
        products: cart.products,
        address_id

      });

    console.log("response", response)
    const order_ID = response.data.order_id

    // 2. Razorpay Options
    const options = {
      key: import.meta.env.VITE_secret_key,
      amount: response.data.order.amount,
      currency: "INR",
      order_id: response.data.order.id,

      name: "Pro commerce",
      description: "Test Payment",

      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },

      theme: {
        color: "#3399cc",
      },

      // 3. CALLBACK → Razorpay returns payment data here
      handler: async function (result) {
        const response = await api.verifyPaymnet(result, order_ID);
        console.log("VERIFY RESPONSE:", response);
        if (response.success) {
          setTimeout(() => {
            showPopup({
              message: "Ordered successfully",
              type: "Ordered",
              duration: 4000,
              route: "/user/orders"
            });
          }, 1000 / 2)
        } else {
          alert("Payment Verification Failed!");
        }
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    console.log("rzppp", rzp)
  }

  return (
    <>
      {/* <h1>Payment page</h1> */}
      <button onClick={pay} className="bg-blue-500 text-white p-2 bg-rounded-xl">
        Make Payment
      </button>
    </>
  );
}

export default Payment;
