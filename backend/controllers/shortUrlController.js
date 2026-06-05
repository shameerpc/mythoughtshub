import ShortUrl from "../models/ShortUrl.js";

// Helper to generate a random 6-character alphanumeric code
const generateShortCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ success: false, message: "originalUrl is required" });
    }

    // Check if short code already exists for this original URL
    let shortUrlEntry = await ShortUrl.findOne({ originalUrl });
    if (shortUrlEntry) {
      const backendUrl = process.env.REACT_APP_API_URL || `${req.protocol}://${req.get("host")}`;
      return res.status(200).json({
        success: true,
        shortCode: shortUrlEntry.shortCode,
        shortUrl: `${backendUrl}/s/${shortUrlEntry.shortCode}`,
      });
    }

    // Generate unique code
    let shortCode = generateShortCode();
    let codeExists = await ShortUrl.findOne({ shortCode });
    while (codeExists) {
      shortCode = generateShortCode();
      codeExists = await ShortUrl.findOne({ shortCode });
    }

    // Create entry
    shortUrlEntry = new ShortUrl({
      originalUrl,
      shortCode,
    });
    await shortUrlEntry.save();

    const backendUrl = process.env.REACT_APP_API_URL || `${req.protocol}://${req.get("host")}`;
    res.status(201).json({
      success: true,
      shortCode: shortUrlEntry.shortCode,
      shortUrl: `${backendUrl}/s/${shortUrlEntry.shortCode}`,
    });
  } catch (error) {
    console.error("Shorten URL error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const shortUrlEntry = await ShortUrl.findOne({ shortCode: code });

    if (!shortUrlEntry) {
      // If code not found, redirect to the frontend base url
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      return res.redirect(frontendUrl);
    }

    // Increment click count
    shortUrlEntry.clicks = (shortUrlEntry.clicks || 0) + 1;
    await shortUrlEntry.save();

    // Redirect to the original URL
    res.redirect(shortUrlEntry.originalUrl);
  } catch (error) {
    console.error("Redirect URL error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
