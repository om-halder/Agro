import { verifyFirebaseToken } from "../services/firebaseService.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = await verifyFirebaseToken(token);
    req.user = decoded; // decoded.uid, decoded.email, etc.
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
