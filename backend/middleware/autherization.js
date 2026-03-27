import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify token using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Attach user to request
    // NOTE: Your controller expects req.user._id, so we ensure it exists here.
    req.user = decoded; 
    
    next();
  } catch (err) {
    console.error("Auth Error:", err.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;