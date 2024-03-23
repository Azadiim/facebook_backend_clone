import jwt from "jsonwebtoken";
const userAuth = async (req, res, next) => {
  try {
    let tmp = req.header("Authorization");
    console.log(tmp);
    const token = tmp ? tmp.slice(7, tmp.length) : "";
    if (!token) {
      return res.status(400).json({ message: "Authentication failed" });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(400).json({ message: "Authentication failed" });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { userAuth };
