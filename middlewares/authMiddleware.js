const jwt = require('jsonwebtoken');

// Token-checking Middleware 
function verifyToken(req, res, next) {
    let token = req.session.token;
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error(error)
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = verifyToken;






