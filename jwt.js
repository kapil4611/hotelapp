const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
    // first check request headers has authentication or not
    const authorization = req.headers.authorization;
    if (!authorization) return res.json({ error: "Token not found" });

    // Extract the jwt token from request headers 
    // Normaly token passes in (Authorization/authorization)request header
    // const token = req.headers.authorization;

    // Bearer token passed in request header
    const token = req.headers.authorization.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Unauthorized" });

    try {
        // verify token
        const decoded = jwt.verify(token, (process.env.JWT_SECRET || "jwtsecretkey"));

        // Attach user information to the request object
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({ error: "Invalid token" });
    }
}

// Function to generate JWT token
const generateToken = (userData) => {
    // Generate new JWT token using user data
    // UserData should be proper object then only expire token featue will work
    return jwt.sign(userData, (process.env.JWT_SECRET || "jwtsecretkey"), { expiresIn: 30000 });
};

module.exports = { jwtAuthMiddleware, generateToken };