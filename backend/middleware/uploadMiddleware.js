import multer from "multer";
import path from "path";
import fs from "fs"; // Import file system to create the folder if it doesn't exist

// 1. Define the upload directory (Must match server.js)
const uploadDir = "/tmp/uploads";

// 2. Ensure the directory exists automatically
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`✅ Created Upload Directory: ${uploadDir}`);
}

// 3. Configure DISK storage (Instead of memory)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files to /tmp/uploads
  },
  filename: function (req, file, cb) {
    // Create a unique filename to prevent overwrites
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Keep the original extension
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// 4. Validate file type
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

export const upload = multer({ 
  storage, // Use the disk storage defined above
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});