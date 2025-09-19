
import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
    try {

        const token = req.cookies?.accessToken;
        if (!token) {
            return res.status(401).json({ msg: "No access token, please login" });
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        req.user = {
            userId: decoded.id,
            role: decoded.role,
        };

        next();
    } catch (err) {
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
};

export const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ msg: "Forbidden: insufficient rights" });
        }
        next();
    };
};