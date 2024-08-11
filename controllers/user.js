import { codeGenerator } from "../helpers/codeGenerator.js";
import sendVerificationEmail from "../helpers/mailer.js";
import sendConfEmail from "../helpers/nodemailder.js";
import generateToken from "../helpers/token.js";
import {
  validateLength,
  validateEmail,
  validateUserName,
} from "../helpers/validation.js";
import User from "../models/User.js";
import Code from "../models/Code.js";
import Post from "../models/Post.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendResetCode from "../helpers/emailjs.js";
import { response } from "express";
const register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      gender,
      username,
      bYear,
      bMonth,
      bDay,
    } = req.body;

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "invalid email" });
    }

    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        message: "This email is already exists. Try with another one!",
      });
    }
    if (!validateLength(first_name, 3, 30)) {
      return res
        .status(400)
        .json({ message: "First name must be between 3 and 30 characters." });
    }
    if (!validateLength(last_name, 3, 30)) {
      return res
        .status(400)
        .json({ message: "Last name must be between 3 and 30 characters." });
    }
    if (!validateLength(password, 4, 40)) {
      return res
        .status(400)
        .json({ message: "Password must be between 6 and 40 characters." });
    }

    const cryptedPassword = await bcrypt.hash(password, 12);
    const tempUserName = first_name + last_name;
    const newUserName = await validateUserName(tempUserName);

    const user = await new User({
      first_name,
      last_name,
      email,
      password: cryptedPassword,
      gender,
      username: newUserName,
      bYear,
      bMonth,
      bDay,
    }).save();

    const emailVerificationToken = generateToken(
      { id: user._id.toString() },
      "7d"
    );

    const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;

    sendConfEmail(user.email, user.first_name, url);

    //// sendVerificationEmail(user.email, user.first_name, url);

    const token = generateToken({ id: user._id.toString() }, "7d");
    res.send({
      id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      token: token,
      verify: user.verify,
      message: "register success! please activate your email to start",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const activateAccount = async (req, res) => {
  try {
    const validUser = req.user.id;
    const { token } = req.body;
    const user = await jwt.verify(token, process.env.TOKEN_SECRET);
    const check = await User.findById(user.id);
    if (validUser !== user.id) {
      return res.status(400).json({
        message: "You do not have the authorization to complete this action.",
      });
    }
    if (check.verify == true) {
      return res
        .status(404)
        .json({ message: "the user has been verified already" });
    } else {
      await User.findByIdAndUpdate(check, { verify: true });
      return res
        .status(200)
        .json({ message: "Account has been activated successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: "You should sign up first" });
    }
    const check = await bcrypt.compare(password, user.password);
    if (check) {
      const token = generateToken({ id: user._id.toString() }, "7d");
      res.send({
        id: user._id,
        username: user.username,
        picture: user.picture,
        first_name: user.first_name,
        last_name: user.last_name,
        token: token,
        verify: user.verify,
      });
    } else {
      return res.status(401).json({ msg: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const auth = (req, res) => {
  try {
    console.log(req.user);
    return res.status(200).json({ message: "hello from auth" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email }).select("-password");
    if (!user) {
      return res.status(400).json({ message: "Account does not exist!" });
    }
    return res.status(200).json({ email: user.email, picture: user.picture });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const sendResetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const codeGen = codeGenerator(5);
    const code = await new Code({ code: codeGen, user: user._id }).save();
    sendResetCode(user.first_name, codeGen, user.email);
    return res
      .status(200)
      .json({ message: "Email reset code has been sent to your email" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const resetCodeValidations = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    const dbCode = await Code.findOne({ user: user._id });

    if (dbCode.code !== code) {
      return res.status(400).json({ message: "Your code is not valid!" });
    }
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const changePasswords = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cryptedPassword = await bcrypt.hash(password, 12);
    const user = await User.findOneAndUpdate(
      { email: email },
      { password: cryptedPassword }
    );
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const profile = await User.findOne({ username }).select("-password");
    const posts = await Post.find({ user: profile._id })
      .populate("user")
      .sort({ createdAt: -1 });
    if (!profile) {
      return res.json({ profileExist: false });
    }
    res.json({ ...profile.toObject(), posts });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updateProf = async (req, res) => {
  try {
    const { url } = req.body;
    const updatedprof = await User.findByIdAndUpdate(req.user.id, {
      picture: url,
    });
    res.json({ updateProf });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updateCover = async (req, res) => {
  try {
    const { url } = req.body;
    const updatedcover = await User.findByIdAndUpdate(req.user.id, {
      cover: url,
    });
    res.json({ updatedcover });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const updateBio = async (req, res) => {
  try {
    const { intro } = req.body;
    const updatedDetails = await User.findByIdAndUpdate(
      req.user.id,
      {
        details: intro,
      },
      { new: true }
    );
   
    res.json(updatedDetails.details);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getDetails = async (req, res) => {
  try {
    const { details } = await User.findById(req.user.id);
    res.json({ details });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export {
  register,
  activateAccount,
  login,
  auth,
  findUser,
  sendResetPasswordCode,
  resetCodeValidations,
  changePasswords,
  getProfile,
  updateProf,
  updateCover,
  updateBio,
  getDetails,
};
