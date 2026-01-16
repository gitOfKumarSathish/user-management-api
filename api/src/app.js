const express = require("express");
const cors = require("cors");
const { ZodError } = require("zod");
var morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const todoRoutes = require("./routes/todo.routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get("/health", (req, res) => {
    res.json({ ok: true, message: "User Management API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/task", todoRoutes);

// Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err, req, res, next) => {
    if (err instanceof ZodError) {
        const list = err.issues || err.errors || [];
        return res.status(400).json({
            message: "Validation error",
            errors: list.map((e) => ({
                field: (e.path || []).join("."),
                message: e.message,
            })),
        });
    }

    console.error("❌ Error:", err);

    const status = err.statusCode || 500;
    return res.status(status).json({
        message: err.message || "Internal Server Error",
    });
});

module.exports = app;
