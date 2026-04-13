import bcrypt from "bcrypt";
import { UserModel } from "../../models/UserModel.js";
import jwt from "jsonwebtoken";

export const loginController = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please fill all the fields", ok: false });
  }

  try {
    const userMatch = await UserModel.findOne({ email });
    if (!userMatch) {
      return res
        .status(400)
        .json({ message: "User not found. Please register.", ok: false });
    }

    bcrypt.compare(password, userMatch.password, async (err, result) => {
      if (err) {
        return res.status(500).json({
          message: "Error comparing passwords",
          error: err.message,
          ok: false,
        });
      }
      if (result) {
        const payload = { name: userMatch.name, email: userMatch.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        return res.status(200).json({
          message: "Login successful!",
          token,
          ok: true,
        });
      } else {
        return res
          .status(400)
          .json({ message: "Invalid Password!", ok: false });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      ok: false,
    });
  }
};