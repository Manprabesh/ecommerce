import Razorpay from "razorpay"

export async function config_razorpay() {
    const razorpay = new Razorpay({
        key_id: process.env.razorpay_id,
        key_secret: process.env.razorpay_secret_id
    })
    return razorpay;
}