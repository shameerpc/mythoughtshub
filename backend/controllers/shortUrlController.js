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

const isCrawler = (userAgent) => {
  if (!userAgent) return false;
  const crawlers = [
    "facebookexternalhit",
    "twitterbot",
    "pinterest",
    "telegrambot",
    "whatsapp",
    "linkedinbot",
    "slackbot",
    "googlebot",
    "bingbot",
  ];
  return crawlers.some((c) => userAgent.toLowerCase().includes(c));
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

    // Check if the request is from a crawler bot
    const userAgent = req.headers["user-agent"] || "";
    if (isCrawler(userAgent)) {
      const match = shortUrlEntry.originalUrl.match(/[?&]product=([^&]+)/);
      if (match) {
        const productId = match[1];
        const AffiliateProduct = (await import("../models/AffleateProduct.js")).default;
        try {
          const product = await AffiliateProduct.findById(productId);
          if (product) {
            const title = product.pinTitle || product.ogTitle || product.name;
            const desc = product.pinDescription || product.ogDescription || product.description;
            const imageUrl = product.ogImage?.url || product.media?.[0]?.url || "";
            
            return res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <meta name="description" content="${desc}" />
  <meta property="og:title" content="${product.ogTitle || product.name}" />
  <meta property="og:description" content="${product.ogDescription || product.description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="${shortUrlEntry.originalUrl}" />
  <meta property="og:type" content="product" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${product.ogTitle || product.name}" />
  <meta name="twitter:description" content="${product.ogDescription || product.description}" />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta name="pinterest-rich-pin" content="true" />
  <meta http-equiv="refresh" content="0;url=${shortUrlEntry.originalUrl}" />
</head>
<body>
  <p>Redirecting to deal...</p>
  <script>window.location.href = "${shortUrlEntry.originalUrl}";</script>
</body>
</html>`);
          }
        } catch (err) {
          console.error("Failed to fetch product details for crawler:", err);
        }
      }
    }

    // Redirect to the original URL
    res.redirect(shortUrlEntry.originalUrl);
  } catch (error) {
    console.error("Redirect URL error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
