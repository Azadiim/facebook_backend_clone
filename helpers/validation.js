import User from "../models/User.js";
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
};

const validateLength = (text, min, max) => {
  if (text.length < min || text.length > max) {
    return false;
  }
  return true;
};

const validateUserName = async (username) => {
  let a = false;
  do {
    const check = await User.findOne({ username });
    if (check) {
      username += (+new Date() * Math.random()).toString().substring(0, 1);
      a = true;
    } else {
      a = false;
    }
  } while (a);
  return username;
};

export { validateEmail, validateLength, validateUserName };

