import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";
import User from "../models/user.model";


// ======================
// ENV
// ======================
const JWT_SECRET = process.env.JWT_SECRET as string;
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// ======================
// ZOD SCHEMAS
// ======================
const registerSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6),
});

// ======================
// HELPERS
// ======================
const generateToken = (payload: { id: string; email: string }) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

// ======================
// REGISTER
// ======================
export const register = async (req: Request, res: Response) => {
    try {
        const parsed = registerSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const { fullName, email, password } = parsed.data;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        const token = generateToken({
            id: user._id.toString(),
            email: user.email as string,
        });

        res.cookie("token", token, COOKIE_OPTIONS);

        const { password: _, ...userData } = user.toObject();

        return res.status(201).json({
            message: "User registered successfully",
            user: userData
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

// ======================
// LOGIN
// ======================
export const login = async (req: Request, res: Response) => {
    try {
        const parsed = loginSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: parsed.error.flatten().fieldErrors,
            });
        }

        const { email, password } = parsed.data;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password as string);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }


        const token = generateToken({
            id: user._id.toString(),
            email: user.email as string,
        });

        res.cookie("token", token, COOKIE_OPTIONS);
        const { password: _, ...userData } = user.toObject();
        return res.status(200).json({
            message: "Login successful",
            user: userData,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export const logout = (_req: Request, res: Response) => {
    res.clearCookie("token", COOKIE_OPTIONS);
    return res.status(200).json({ message: "Logged out successfully" });
};
