import api from "../../services/api";

function Payment({ address_id }) {
  console.log("incoming addres", address_id)

  async function pay() {
    // 1. Create Order in Backend
    const user_id = localStorage.getItem('userId')
    const products = JSON.parse(localStorage.getItem('products'));
    const totalPrice = JSON.parse(localStorage.getItem('total_price'));
    console.log("products-->", products);
    console.log("totalPrice-->", totalPrice);
    const response = await api.createOrder(
      {
        amount: totalPrice,
        user_id,
        currency: "INR",
        receipt: "this is a receipt",
        notes: "this is a note",
        products,
        address_id

      });


    // const order = await response.json();
    console.log("ORDER FROM BACKEND:", response.data.order);

    // 2. Razorpay Options
    const options = {
      key: import.meta.env.VITE_secret_key,
      amount: response.data.order.amount,
      currency: "INR",
      order_id: response.data.order.id,

      name: "My Store",
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
        console.log("Razorpay Response ->", result);
        const response = await api.verifyPaymnet(result);
        console.log("VERIFY RESPONSE:", response);
        if (response.success) {
          console.log("incoming verification", response)
          alert("Payment Verified Successfully!");
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
      <h1>Payment page</h1>
      <button onClick={pay} className="bg-blue-500 text-white p-2">
        Make Payment
      </button>
    </>
  );
}

export default Payment;
