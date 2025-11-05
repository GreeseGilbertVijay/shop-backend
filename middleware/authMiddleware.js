import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const verified = jwt.verify(token, "SECRET123");
    req.user = verified.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
