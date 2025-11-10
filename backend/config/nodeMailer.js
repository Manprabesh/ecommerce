import nodemailer from 'nodemailer';

const nodemailerConfig = async (receiver,subject, text, body) => {

    const sender = process.env.gmail;
    const googlePass = process.env.googlePass;
    const transporter = nodemailer.createTransport({
        service: "gmail",
            auth: {
                user: sender,
                pass: googlePass,
            }
        })

    console.log("transporting  ", transporter)

    const info = await transporter.sendMail({
        from: sender,
        to: receiver,
        subject: subject,
        text: text, // plain‑text body
        html: body, // HTML body
    });
    console.log("email send", info)
}

export default nodemailerConfig