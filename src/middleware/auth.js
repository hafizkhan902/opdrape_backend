const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
	try {
		// Try multiple locations for token
		const authHeader = req.header('Authorization');
		const xAuthToken = req.header('x-auth-token');
		const xAccessToken = req.header('x-access-token');

		let token = '';

		if (authHeader) {
			// Support both "Bearer <token>" and raw token in Authorization
			if (authHeader.startsWith('Bearer ')) {
				token = authHeader.replace('Bearer ', '');
			} else {
				token = authHeader.trim();
			}
		} else if (xAuthToken) {
			token = xAuthToken.trim();
		} else if (xAccessToken) {
			token = xAccessToken.trim();
		}

		if (!token) {
			return res.status(401).json({ error: 'Authentication required' });
		}

		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_dev_secret');

		// Find user
		const user = await User.findById(decoded.userId);

		if (!user) {
			return res.status(401).json({ error: 'User not found' });
		}

		// Add user to request
		req.user = user;
		req.token = token;

		next();
	} catch (error) {
		return res.status(401).json({ error: 'Authentication failed' });
	}
};

module.exports = auth; 