import Blog from "../models/Blog.js";
import fs from "fs";
import path from "path";

export const createBlog = async (req, res) => {
  try {
    console.log("🚀 Create Blog Request Started");

    // 1. Validate Files
    if (!req.files || req.files.length === 0) {
      console.log("❌ No files received");
      return res.status(400).json({ error: "No images uploaded." });
    }

    const { title, description, category, alts } = req.body;

    // 2. Validate Data
    if (!title || !description || !category) {
      console.log("❌ Missing fields");
      return res.status(400).json({ error: "Missing required fields." });
    }

    // 3. FORCE USE /tmp DIRECTORY (Render Safe)
    // Using '/tmp' avoids "Permission Denied" errors on cloud servers
    const uploadDir = "/tmp/uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`📁 Created directory: ${uploadDir}`);
    }

    // 4. Process Images
    let processedImages = [];
    let altTexts = [];
    
    if (alts) {
      try { altTexts = JSON.parse(alts); } catch (e) { console.error(e); }
    }

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      if (!file.buffer) {
        console.log("❌ File buffer missing");
        return res.status(500).json({ error: "File buffer missing. Check Multer config." });
      }

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      const filename = `blog-${uniqueSuffix}${path.extname(file.originalname)}`;
      const filePath = path.join(uploadDir, filename);

      // Write to /tmp
      fs.writeFileSync(filePath, file.buffer);
      processedImages.push({
        url: `/uploads/${filename}`, // Note: You still need to serve /tmp as /uploads in server.js
        alt: altTexts[i] || ""
      });
      console.log(`✅ Saved image to /tmp: ${filename}`);
    }

    // 5. Handle User ID (Temporarily Dummy or skip if schema allows)
    // If your schema REQUIRES 'creator', you must fix this.
    // For now, let's try to save WITHOUT a creator if possible, or use a dummy ID.
    let userId = req.user?._id; 
    // If req.user is undefined, we skip it for now to test the upload.
    // You will need to add the user back later.

    const blogData = {
      title,
      description,
      category, // Ensure this ID matches your DB
      images: processedImages,
    };

    // Only add creator if it exists
    if (userId) blogData.creator = userId;

    console.log("💾 Saving to DB:", blogData);

    const blog = new Blog(blogData);
    await blog.save();
    await blog.populate("category", "name");

    console.log("✅ Blog Saved Successfully");
    res.status(201).json({ success: true, result: blog });

  } catch (err) {
    console.error("🔥 FULL SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// ─────────────────────────────────────
// UPDATE BLOG
// ─────────────────────────────────────
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, alts } = req.body;

    const updateData = {
      title,
      description,
      category,
    };

    // Handle Images if new ones are uploaded
    if (req.files && req.files.length > 0) {
      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const altTexts = alts ? JSON.parse(alts) : [];
      let newImages = [];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const filename = `blog-${uniqueSuffix}${path.extname(file.originalname)}`;
        const outputPath = path.join(uploadDir, filename);

        // Using Sharp for optimization here
        await sharp(file.buffer)
          .resize({ width: 800, withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toFile(outputPath);

        newImages.push({
          url: `/uploads/${filename}`,
          alt: altTexts[i] || ""
        });
      }
      updateData.images = newImages; 
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category", "name")
     .populate("creator", "name email");

    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      result: updatedBlog,
    });
  } catch (err) {
    console.error("Update Blog Error:", err);
    res.status(500).json({ error: err.message || "Server Error" });
  }
};

// ... (Keep your other functions like getAllBlogs, getBlogById exactly as they are) ...
// Just ensure getBlogById and getAllBlogs populate 'images' correctly if needed, 
// but usually .find() returns the whole object automatically.

export const getAllBlogs = async (req, res) => {
  try {
    // ✅ CHANGE TO THIS: Empty object means "Find Everything"
    const blogs = await Blog.find({}) 
      .populate("category", "name slug")
      .populate("creator", "username name")
      .sort({ createdAt: -1 });

    console.log("Found blogs count:", blogs); // Check your server terminal logs

    res.status(200).json({ success: true, response: blogs });
  } catch (error) {
    console.error("Get All Blogs Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get Single
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("creator", "name email")
      .populate("category", "name slug");

    if (!blog || blog.delete_status)
      return res.status(404).json({ error: "Blog not found" });

    res.status(200).json({
      success: true,
      response: blog,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const getBlogsByCategorySlug = async (req, res) => {
  try {
    // 1. Get slug and normalize to lowercase to avoid case-sensitivity issues
    const { slug } = req.params;
    const normalizedSlug = slug.toLowerCase();

    // 2. Find the category by slug
    const category = await Category.findOne({ slug: normalizedSlug });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // 3. Find blogs that reference this category's ID
    // Note: 'delete_status' is included assuming your Blog model has this field.
    // If you don't use soft-deletes, remove that line.
    const blogs = await Blog.find({
      category: category._id,
      delete_status: false, 
    })
      .populate("creator", "username email")
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    // 4. Return data matching your frontend expectation
    res.status(200).json({
      category: category,
      blogs: blogs,
    });

  } catch (err) {
    console.error("Error in getBlogsByCategorySlug:", err);
    res.status(500).json({ message: err.message });
  }
};



// Delete (Fixed Typo)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || blog.delete_status) return res.status(404).json({ error: "Blog not found" });

    blog.delete_status = true;
    await blog.save();

    // FIXED: changed 'bog' to 'blog'
    res.status(200).json({ success: true, message: "Blog deleted (soft)", blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const getMyBlogs = async (req, res) => {
  try {
    // req.user is attached by your authMiddleware
    const userId = req.user.id;

    const blogs = await Blog.find({ creator: userId })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    // Return data structure matching your frontend expectation
    res.status(200).json({ response: blogs });
  } catch (error) {
    console.error("Error fetching my blogs:", error);
    res.status(500).json({ message: "Server Error" });
  }
};