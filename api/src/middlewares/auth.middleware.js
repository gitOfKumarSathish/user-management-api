const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
    try {
        if (req.url.includes['sign-in'] || req.url.includes['sign-up']) return next();
        const header = req.headers.authorization || "";
        const [type, token] = header.split(" ");

        if (type !== "Bearer" || !token) {
            return res.status(401).json({ message: "Missing or invalid Authorization header" });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // attach user info to request for later use
        req.user = {
            id: payload.sub,
            role: payload.role,
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

function requireRole(...roles) {
    console.log({ roles });
    return (req, res, next) => {
        if (!req.user?.role) return res.status(401).json({ message: "Unauthorized" });
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}

module.exports = { requireAuth, requireRole };
