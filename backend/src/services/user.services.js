const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwtProvider = require("../config/jwtProvider.js");

const createUser = async (userData) => {
  const { username, password, email } = userData;
  const isUserExit = await User.findOne({ email });
  if (isUserExit) {
    throw new Error("Email already exists!");
  }
  const hashPassword = await bcrypt.hash(password, 8);
  console.log(hashPassword);
  const user = await User.create({ username, email, password: hashPassword });
  delete user.password;
  return user;
};

const getUserByToken = async (token) => {
  const userId = jwtProvider.getUserIdFromToken(token);
  const user = await User.findOne({ _id: userId });
  if (!user) throw new Error("User doesn't exist!");
  return user;
};

const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found!");
  return user;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found!");
  }
  return user;
};

const login = async (email, password) => {
  const user = await getUserByEmail(email);

  const isMatch = await bcrypt.compare(password, user.password);
  // console.log(isMatch);

  if (isMatch) {
    const userData = user.toObject();
    delete userData.password;
    const token = jwtProvider.createToken(user._id);
    return {
      user: userData,
      token,
    };
  }

  throw new Error("Username or password incorrect");
};

module.exports = {
  getUserById,
  getUserByToken,
  createUser,
  getUserByEmail,
  login,
};
