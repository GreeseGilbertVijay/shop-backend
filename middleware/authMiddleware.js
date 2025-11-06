import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // Prefer Authorization: Bearer <token>
  let token = req.headers.authorization?.split(" ")[1];

  // Fallback to cookie named "token" if present
  if (!token && req.headers.cookie) {
    const cookieHeader = req.headers.cookie;
    const parsed = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, ...rest] = c.trim().split("=");
        return [decodeURIComponent(k), decodeURIComponent(rest.join("="))];
      })
    );
    token = parsed.token;
  }

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const secret = process.env.JWT_SECRET || "SECRET123";
    const verified = jwt.verify(token, secret);
    req.user = verified.id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
