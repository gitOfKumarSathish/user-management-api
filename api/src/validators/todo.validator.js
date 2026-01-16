const { z } = require("zod");

exports.taskCreateSchema = z.object({
    title: z.string().min(4, { message: "Title is required" }).max(255, { message: "Title must be less than 255 characters" }),
    description: z.string().min(4, { message: "Description is required" }).max(255, { message: "Description must be less than 255 characters" }),
    status: z.enum(["pending", "in progress", "completed"], {
        required_error: "Status is required",
        invalid_type_error: "Status must be a string",
        message: "Invalid Status: Use pending, in progress or completed"
    }),
    priority: z.enum(["low", "medium", "high"], {
        required_error: "Priority is required",
        invalid_type_error: "Priority must be a string",
        message: "Invalid Priority: Use low, medium or high"
    }),
    due_date: z.coerce.date(),
    created_at: z.coerce.date().optional(),
    updated_at: z.coerce.date().optional(),
});

exports.taskUpdateSchema = z.object({
    description: z
        .string()
        .min(4, "Description must be at least 4 characters")
        .max(255, "Description must be less than 255 characters")
        .optional(),

    status: z
        .enum(["pending", "in progress", "completed"])
        .optional(),

    priority: z
        .enum(["low", "medium", "high"])
        .optional(),

    due_date: z
        .coerce
        .date()
        .optional()
        .refine(
            (date) => !date || date <= new Date(),
            { message: "Due date cannot be in the future" }
        ),
}).strict(); // 🔒 VERY IMPORTANT
