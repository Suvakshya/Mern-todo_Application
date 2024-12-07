const userModel = require("../models/userModle");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

//Register
const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    //validation
    if (!username || !email || !password) {
      return res.status(500).send({
        success: false,
        message: "Plese Provide All Fields ",
      });
    }

    //check exisiting user
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(500).send({
        success: false,
        message: "user already exist",
      });
    }

    //hashing the password before saving the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //saving newly registered user with the hashed password
    const newUser = new userModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    //sending the response after registering the user successfully
    res.status(200).send({
      success: true,
      message: "User registered successfully",
    });
    // /
    //
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Registration Api",
      error,
    });
  }
};

//Login
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //find user
    const user = await userModel.findOne({ email: email });

    //user validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid user or password",
      });
    }
    //match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "invalid Credentials",
      });
    }

    //token
    const token = await JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // sending the user detail after finding the user , matching the password  and after generating jwt
    res.status(200).send({
      success: true,
      message: "Login successfully",
      token: token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "login api",
      error,
    });
  }
};

module.exports = { registerController, loginController };
