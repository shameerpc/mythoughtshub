import multer from "multer";
import path from "path";
import fs from "fs";

// 1. Ensure the uploads folder exists (Still needed, as Sharp will save here)
const uploadFolder = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// 2. ✅ CHANGE: Use Memory Storage
// This keeps the file in RAM (req.file.buffer) so we can compress it with Sharp
const storage = multer.memoryStorage();

// File type validation (Keep as is)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"));
  }
};

export const upload = multer({ 
  storage, // Uses memoryStorage now
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});