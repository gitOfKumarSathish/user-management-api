const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");

exports.listUsers = async (req, res, next) => {
    try {
        const page = Math.max(parseInt(req.query.page || "1", 10), 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
        const q = (req.query.q || "").trim();

        const filter = {};
        if (q) {
            filter.$or = [
                { name: { $regex: q, $options: "i" } },
                { email: { $regex: q, $options: "i" } },
            ];
        }

        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            User.find(filter)
                .select("_id name email role isActive createdAt")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments(filter),
        ]);

        res.json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            items,
        });
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, role, isActive } = req.body;

        const allowedRoles = ["admin", "manager", "user"];

        const update = {};
        if (name !== undefined) update.name = name;
        if (role !== undefined) {
            // Only admins and managers can update role
            if (!['admin', 'manager'].includes(req.user.role)) {
                return res.status(StatusCodes.FORBIDDEN).json({ message: "Only admins and managers can update roles" });
            }
            if (!allowedRoles.includes(role)) {
                return res.status(400).json({ message: `Invalid role. Use: ${allowedRoles.join(", ")}` });
            }
            update.role = role;
        }
        if (isActive !== undefined) update.isActive = !!isActive;

        const user = await User.findByIdAndUpdate(
            id,
            { $set: update },
            { new: true, runValidators: true }
        ).select("id name email role isActive createdAt");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "updated", user });
    } catch (err) {
        next(err);
    }
};

exports.deactivateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(
            id,
            { $set: { isActive: false } },
            { new: true }
        ).select("_id name email role isActive createdAt");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "deactivated", user });
    } catch (err) {
        next(err);
    }
};

exports.activateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(
            id,
            { $set: { isActive: true } },
            { new: true }
        ).select("_id name email role isActive createdAt");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ message: "deactivated", user });
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        if (user._id.toString() === req.user.id) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: "You are not authorized to delete this user" });
        }
        if (!['admin', 'manager'].includes(req.user.role)) return res.status(400).json({ message: "Invalid role" });
        res.json({ message: "deleted", user });
    } catch (err) {
        next(err);
    }
};