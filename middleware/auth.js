const config = require('config');
const jwt = require('jsonwebtoken');

// Middleware function
// next -> calls next thing when something is done
// Goal: get the token
function auth (req, res,next) {
    const token = req.header('x-auth-token');

    // Check for token
    if (!token) {
        // 401 status - incorrect permissions, unauthorized access
        return res.status(401).json({ msg: 'No token, authorization denied'});
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        // Add user from payload
        req.user = decoded;
        // Call the next piece of middleware
        next();
    } catch (exception) {
        res.status(400).json({ msg: 'Token is not valid'});
    }
}

module.exports = auth;