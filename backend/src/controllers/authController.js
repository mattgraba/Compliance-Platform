// controllers/authController.js
import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logAction } from "../utils/auditLogger.js";

export const register = async (req, res) => {
  try {
    const { email, password, name, roleId, dispensaryId } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: { connect: { id: roleId } },
        dispensary: dispensaryId ? { connect: { id: dispensaryId } } : undefined,
      },
      include: { role: true },
    });

    // Log the action
    await logAction(req.user?.userId ?? newUser.id, `Registered user ${newUser.email}`);
    
    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Check password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    // Sign JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Log the action
    await logAction(user.id, `Logged in`);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
