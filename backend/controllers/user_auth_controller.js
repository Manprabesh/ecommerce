import { model } from "../config/database.js";

const user_signup = async (req, res) => {
    const email = req.body.email;
    // console.log()
    // return res.json("email received", email);
    const [users, createdAt] = await new  model.User(
        {
            where: { email: req.body.email },
            defaults:{
                email:req.body.email,
                password: req.body.password
            },
        }
    );

    console.log('created at', createdAt);
}

// export default user_signup;