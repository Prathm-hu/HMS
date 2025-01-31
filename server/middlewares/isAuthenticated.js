const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "User Not Unauthorized", success: false });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRETE_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token", success: false });
    }
    req.id = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = isAuthenticated;
