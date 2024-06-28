import jwt from "jsonwebtoken";

const generateToken = (payload, expired) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: expired,
  });
};

export default generateToken;
