const User = require("../models/User");

exports.me = async (req, res, next) => {
    try {
        // const user = await User.findById(req.user.id).select("-passwordHash -__v");
        const user = await User.findById(req.user.id).select("_id name email role isActive createdAt");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json({ user });
    } catch (err) {
        next(err);
    }
};
