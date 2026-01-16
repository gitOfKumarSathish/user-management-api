const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

// Import the package
const { StatusCodes, getReasonPhrase } = require('http-status-codes');

function signToken(user) {
    return jwt.sign(
        { sub: user._id.toString(), role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
}

exports.signUp = async (req, res, next) => {
    try {
        // Zod strips unknown fields by default, so we grab 'role' from req.body separately if it's not in the schema
        const { name, email, password, role, isActive } = registerSchema.parse(req.body);

        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) {
            return res.status(StatusCodes.CONFLICT).json({ message: "email already registered" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            passwordHash,
            role,
            isActive
        });

        // const token = signToken(user);

        return res.status(201).json({
            message: "registered",
            user: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive },
            // token,
        });
    } catch (err) {
        next(err);
    }
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, isActive } = registerSchema.parse(req.body);

        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) {
            return res.status(StatusCodes.CONFLICT).json({ message: "email already registered" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            passwordHash,
            role,
            isActive
        });

        // const token = signToken(user);

        return res.status(201).json({
            message: "registered",
            user: { id: user._id, name: user.name, email: user.email, role: user.role, isActive: user.isActive },
            // token,
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user || !user.isActive) {
            return res.status(401).json({ message: "invalid credentials" });
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ message: "invalid credentials" });
        }
        if (password.length < 8) return res.status(400).json({ message: "password must be at least 8 characters" });


        const token = signToken(user);

        return res.status(200).json({
            role: "naan than da Leo...",
            message: "logged_in",
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token,
        });
    } catch (err) {
        next(err);
    }
};

// const { changePasswordSchema } = require("../validations/auth"); // if you use zod/joi

exports.changePassword = async (req, res, next) => {
    try {
        // ✅ 1) Validate input (recommended)
        // const { oldPassword, newPassword } = changePasswordSchema.parse(req.body);

        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "oldPassword and newPassword are required" });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ message: "newPassword must be at least 8 characters" });
        }

        // ✅ 2) Get logged in user (req.user.id must come from JWT middleware)
        const user = await User.findById(req.user.id);
        if (!user || !user.isActive) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ 3) Check old password
        const ok = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!ok) {
            return res.status(401).json({ message: "Old password is incorrect" });
        }

        // ✅ 4) Prevent using same password again (optional)
        const same = await bcrypt.compare(newPassword, user.passwordHash);
        if (same) {
            return res.status(400).json({ message: "New password must be different from old password" });
        }

        // ✅ 5) Hash + save new password
        const saltRounds = 12;
        user.passwordHash = await bcrypt.hash(newPassword, saltRounds);

        // ✅ 6) Optional but recommended: invalidate old tokens
        // user.passwordChangedAt = new Date(); // add this field in schema
        // or user.tokenVersion = (user.tokenVersion || 0) + 1;

        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
        next(err);
    }
};
