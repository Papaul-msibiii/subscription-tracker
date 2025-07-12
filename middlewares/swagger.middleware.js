import { NODE_ENV, SWAGGER_TOKEN } from "../config/env.js";

const protectSwagger = (req, res, next) => {
    const expectedToken = `Bearer ${SWAGGER_TOKEN}`;
    if (NODE_ENV === "production" && SWAGGER_TOKEN && req.headers.authorization !== expectedToken) {
      return res.status(403).json({ message: "Access to API docs is forbidden" });
    }
    next();
};

export default protectSwagger;