const jwt = require("jsonwebtoken");

const SECRET_KEY = "adhsakgfkgkasjf";
const jwtProvider = require("../config/jwtProvider");
const userService = require("../services/user.services");
async function checkToken(req, res, next) {
  // Lấy token từ header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }
  const userId = await jwtProvider.getUserIdFromToken(token);
  try {
    const user = await userService.getUserById(userId);
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    return res.status(400).json({ message: "Token invalid" });
  }
}

module.exports = checkToken;
