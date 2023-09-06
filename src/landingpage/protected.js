const jwt = require('jsonwebtoken');

// Middleware function to validate JWT token
function authenticateToken(req, res, next) {
    // Extract the JWT token from the 'Authorization' header
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify and decode the token
    jwt.verify(token, 'david', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        // The decoded user information can be used in the route handler
        req.user = user;
        next();
    });
}

// Example protected route using the middleware
app.get('/protected-resource', authenticateToken, (req, res) => {
    // The user information is available in req.user
    res.json({ message: 'Access granted to protected resource', user: req.user });
});
