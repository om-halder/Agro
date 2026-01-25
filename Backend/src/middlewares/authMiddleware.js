import { verifyFirebaseToken } from "../services/firebaseService.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = await verifyFirebaseToken(token);

    console.log("✅ Auth user:", decoded.uid, decoded.email);

    req.user = decoded; // uid, email, role, etc.
    next();
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
