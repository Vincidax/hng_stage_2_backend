const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({
      status: 'Unauthorized',
      message: 'No token provided',
      statusCode: 401,
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'Unauthorized',
      message: 'Invalid token',
      statusCode: 401,
    });
  }
};

module.exports = authMiddleware;
