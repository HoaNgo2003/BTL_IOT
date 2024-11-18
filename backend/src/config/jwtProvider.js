const jwt = require("jsonwebtoken");
const SECRET_KEY = "adhsakgfkgkasjf";
const createToken = (userId) => {
  const token = jwt.sign(
    {
      userId,
    },
    SECRET_KEY,
    {
      expiresIn: "48hr",
      algorithm: "HS256",
    }
  );
  return token;
};
const getUserIdFromToken = async (token) => {
  try {
    console.log("okkkk");
    console.log(token);
    const decodeToken = jwt.verify(token, SECRET_KEY);
    console.log(decodeToken);
    return decodeToken.userId;
  } catch (error) {
    // console.log(error);
    return "token invalid";
  }
};
module.exports = { createToken, getUserIdFromToken };
