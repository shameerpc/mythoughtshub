import User from "../models/user.js";

const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("role username email");
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.admin = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Unable to verify admin access" });
  }
};

export default requireAdmin;
