import { UserModel } from "../../models/UserModel.js";
import bcrypt from "bcrypt";

export const registerController = async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please fill all the fields", ok: false });
  }

  try {
    const userMatch = await UserModel.findOne({ email });

    if (userMatch) {
      return res
        .status(400)
        .json({ message: "User already exists. Please login.", ok: false });
    }

    bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS),
      async (err, hash) => {
        if (err) {
          return res
            .status(500)
            .json({
              message: "Error hashing password",
              error: err.message,
              ok: false,
            });
        }
        const newUser = new UserModel({ name, email, password: hash });
        await newUser.save();

        res
          .status(201)
          .json({
            message: "User registered successfully!",
            newUser: { name, email },
            ok: true,
          });
      },
    );
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Internal server error",
        error: error.message,
        ok: false,
      });
  }
};