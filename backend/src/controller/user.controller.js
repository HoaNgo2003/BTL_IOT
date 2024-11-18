const userService = require("../services/user.services.js");
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await userService.login(email, password);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      message: "user name or password wrong",
    });
  }
};
const signup = async (req, res) => {
  try {
    const data = await userService.createUser(req.body);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
module.exports = { login, signup };
