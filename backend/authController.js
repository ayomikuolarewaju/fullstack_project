import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "./userModel.js";
import { validateUser } from "./validation.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, age } = req.body;

    const validationError = validateUser({ name, email, age });
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.createAuth({ name, email, password: hashedPassword, age });

    res.status(201).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
      token: jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" }),
    });
  } catch (err) {
    next(err);
  }
};

// Login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findByEmail(email);

    if (!user) return res.status(401).json({ success: false, error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, token, data: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};
