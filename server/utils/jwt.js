import jwt from "jsonwebtoken";

export const validateJWT = (req, res, next) => {
  console.log("🧾 HEADERS EN BACKEND (GET):", req.headers);

  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  console.log("🧪 TOKEN recibido:", token);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ Token inválido:", err.message);
      return res.status(401).json({ message: "Invalid token: " + err.message });
    }

    req.user = decoded;
    next();
  });
};
