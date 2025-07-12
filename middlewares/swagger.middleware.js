import { NODE_ENV, SWAGGER_TOKEN } from "../config/env.js";

const protectSwagger = (req, res, next) => {
    const expectedToken = `Bearer ${SWAGGER_TOKEN}`;

    const cookieToken = req.cookies['swagger_token'];
    const headerToken = req.headers.authorization;

    const isAuthorized = cookieToken === expectedToken || headerToken === expectedToken;

    if (NODE_ENV === "production" && SWAGGER_TOKEN && !isAuthorized) {
        return res.status(403).json({ message: "Access to API docs is forbidden" });
    }
    
    next();
};

export default protectSwagger;