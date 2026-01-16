const { z } = require("zod");

exports.registerSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.email({ message: "Invalid email format" }),
    role: z.enum(["admin", "manager", "user"], {
        message: "Invalid role. Use: admin, manager, user",
    }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

exports.loginSchema = z.object({
    email: z.email({ message: "Invalid email format" }),
    password: z.string().min(1, { message: "Password is required" }),
});

