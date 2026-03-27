import Blog from "../models/Blog.js";
import fs from "fs";
import path from "path";
import sharp from "sharp";

// Helper to get upload directory
const getUploadDir = () => "/tmp/uploads";

export const createBlog = async (req, res) => {
  try {
    console.log("🚀 Create Blog Request Started");

    // 1. CHECK AUTHENTICATION
    // Support both '_id' (common in Mongoose) and 'id' (common in JWT payloads)
    const userId = req.user?._id || req.user?.id;
    
    if (!userId) {
      console.log("❌ Authentication failed: User ID not found on request");
      return res.status(401).json({ 
        error: "Unauthorized: You must be logged in to create a blog." 
      });
    }

    // 2. Validate Files
    if (!req.files || req.files.length === 0) {
      console.log("❌ No files received");
      return res.status(400).json({ error: "No images uploaded." });
    }

    const { title, description, category, alts } = req.body;

    // 3. Validate Data
    if (!title || !description || !category) {
      console.log("❌ Missing fields");
      return res.status(400).json({ error: "Missing required fields." });
    }

    // 4. Setup Directory
    const uploadDir = getUploadDir();
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log(`📁 Created directory: ${uploadDir}`);
    }

    // 5. Process Images
    let processedImages = [];
    let altTexts = [];
    
    if (alts) {
      try { altTexts = JSON.parse(alts); } catch (e) { console.error(e); }
    }

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
      const filename = `blog-${uniqueSuffix}${path.extname(file.originalname)}`;
      const filePath = path.join(uploadDir, filename);

      // Write to /tmp
      fs.writeFileSync(filePath, file.buffer);
      processedImages.push({
        url: `/uploads/${filename}`, 
        alt: altTexts[i] || ""
      });
      console.log(`✅ Saved image to /tmp: ${filename}`);
    }

    // 6. Prepare Data with Creator
    const blogData = {
      title,
      description,
      category,
      images: processedImages,
      creator: userId // Explicitly assign the ID
    };

    console.log("💾 Saving to DB with Creator ID:", userId);

    const blog = new Blog(blogData);
    await blog.save();
    await blog.populate("category", "name");
    await blog.populate("creator", "name email");

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
      // FIXED: Use /tmp for consistency with createBlog
      const uploadDir = getUploadDir(); 
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

        // Optimization with Sharp
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
    // 1. Extract Query Parameters with Defaults
    const page = parseInt(req.query.page) || 1;        // Current page (default 1)
    const limit = parseInt(req.query.limit) || 10;     // Items per page (default 10)
    const search = req.query.search || "";             // Search keyword
    const category = req.query.category || "";         // Category ID filter (optional)

    // 2. Build the Query Object (Filtering)
    const query = {};

    // Search logic: Case-insensitive search in Title OR Description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    // Category Filter logic
    if (category) {
      query.category = category;
    }

    // 3. Calculate Total Count (for pagination metadata)
    const total = await Blog.countDocuments(query);

    // 4. Fetch Data with Pagination, Populate, and Sort
    const blogs = await Blog.find(query)
      .populate("category", "name slug") // Get category details
      .populate("creator", "name username avatar") // Get creator details
      .sort({ createdAt: -1 }) // Newest first
      .skip((page - 1) * limit) // Skip previous pages
      .limit(limit); // Limit results per page

    // 5. Calculate Pagination Meta
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // 6. Send "Beautiful" Structured Response
    res.status(200).json({
      success: true,
      count: total,                // Total items matching search/filter
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        limit: limit,
        hasNextPage: hasNextPage,
        hasPrevPage: hasPrevPage
      },
      data: blogs
    });

  } catch (error) {
    console.error("Get All Blogs Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch blogs", 
      error: error.message 
    });
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