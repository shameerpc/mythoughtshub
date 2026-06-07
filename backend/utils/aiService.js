import { Anthropic } from "@anthropic-ai/sdk";

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

// Heuristic fallback generator in case Anthropic is not set up or fails
const generateFallbackSEO = (product) => {
  const { name = "", description = "", category = "General", brand = "" } = product;

  // Clean brand prefix
  const brandName = brand || "MyThoughtsHub";
  const baseName = name.replace(new RegExp(`^${brandName}\\s+`, "i"), "").trim();

  // Primary and secondary keywords extraction
  const cleanName = baseName.toLowerCase().replace(/[^a-z0-9\s]/g, "");
  const words = cleanName.split(/\s+/).filter(w => w.length > 3);
  const primaryKeyword = words.slice(0, 3).join(" ") || baseName;
  const secondaryKeywords = words.slice(3, 6).join(", ") || category;
  const longTailKeywords = `${primaryKeyword} best review 2026, where to buy ${primaryKeyword}`;

  // Slugs for image SEO
  const slugifiedName = baseName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 40);
  const cleanCategory = category.toLowerCase().replace(/[^a-z0-9]/g, "");
  const imageFilename = `${slugifiedName}-${cleanCategory}-seo.jpg`;

  // Pinterest titles variations
  const pinTitle = `Must-Have ${baseName} Review - Worth the Price?`.substring(0, 100);

  // Pinterest descriptions
  const pinDescription = `Looking for the best ${baseName} in ${category}? Here is an honest review and breakdown of its features, quality, and pricing. Click to read the full review!`.substring(0, 500);

  // Alt text
  const pinAltText = `Detailed review and close-up image of the ${baseName} product from the ${category} collection, highlighting design and utility.`;

  // Pinterest tags
  const pinTags = [
    category.replace(/\s+/g, ""),
    brandName.replace(/\s+/g, ""),
    "AmazonFinds",
    "ProductReview",
    "ShoppingGuide",
    "GiftsForHer",
    "TechGadgets"
  ].filter(Boolean);

  // Social sharing templates
  const socialShares = {
    pinterest: `📌 Highly Recommended: ${baseName}! Check out our in-depth review on MyThoughtsHub. #PinterestFinds #${category.replace(/\s+/g, "")}`,
    facebook: `Check out our latest review on the ${name}. Find out if this product lives up to the hype and is worth your investment! Read more at MyThoughtsHub.`,
    linkedin: `📊 Product Spotlight: We've compiled a comprehensive analysis of the ${name} within the ${category} space. Discover the core pros, cons, and performance scores in our full article.`,
    twitter: `Honest review: is the ${baseName} really worth it? Check out our verdict on MyThoughtsHub! 🚀 #${category.replace(/\s+/g, "")} #AmazonReviews`,
    whatsapp: `Hey, found this detailed review of the ${name} on MyThoughtsHub! Thought you might be interested in the pros/cons: `,
    telegram: `Check out this honest review of the ${name} on MyThoughtsHub! Find out if it is worth your investment: `
  };

  // Content Angles
  const contentAngles = [
    `Unboxing & Initial Thoughts on ${baseName}`,
    `Why the ${baseName} is a Game Changer for ${category}`,
    `Is the ${baseName} Worth the Price? Full Analysis`
  ];

  // Heuristic SEO scores
  const pScore = name.length >= 25 && name.length <= 60 ? 88 : 75;
  const ogScore = description.length >= 100 ? 90 : 70;
  const imgScore = pinAltText.length > 30 ? 95 : 65;
  const overallScore = Math.round((pScore + ogScore + imgScore) / 3);

  return {
    pinTitle,
    pinDescription,
    pinAltText,
    pinTags,
    ogTitle: name,
    ogDescription: description.substring(0, 200),
    socialSharing: socialShares,
    imageSeo: {
      filename: imageFilename,
      altText: pinAltText,
      title: `${baseName} - SEO Product Image`,
      caption: `Reviewing the ${baseName} from ${brandName} under the ${category} category.`
    },
    seoScore: {
      pinterestScore: pScore,
      ogScore: ogScore,
      imageScore: imgScore,
      overallScore: overallScore
    },
    trendSuggestions: {
      keywords: [primaryKeyword, ...words.slice(1, 4)].filter(Boolean),
      tags: pinTags,
      contentAngles: contentAngles
    }
  };
};

export const generateSeoMetadata = async (product) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.log("⚠️ ANTHROPIC_API_KEY not configured. Falling back to rule-based SEO generator.");
    return generateFallbackSEO(product);
  }

  try {
    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `You are an expert SEO copywriter specialized in Pinterest Rich Pins, Open Graph metadata, and viral social sharing content.
Your task is to analyze the product details provided and generate optimized SEO copy.
You MUST respond with a valid, clean, parseable JSON object. Do NOT include markdown blocks like \`\`\`json or any other text before/after the JSON.

Expected JSON Structure:
{
  "pinTitle": "Pinterest Pin Title (50-100 chars, click-worthy, includes keywords naturally)",
  "pinDescription": "Pinterest Pin Description (200-500 chars, SEO-friendly, includes keywords, ends with a CTA, no hashtag stuffing)",
  "pinAltText": "Descriptive accessibility alt text for Pinterest (100-200 chars, SEO keywords included naturally)",
  "pinTags": ["array", "of", "5-10", "camelcase", "hashtags"],
  "ogTitle": "Open Graph Title for Facebook/WhatsApp/X (under 60 chars)",
  "ogDescription": "Open Graph Description (100-150 chars, high CTR summary)",
  "socialSharing": {
    "pinterest": "Optimized share text for Pinterest pins",
    "facebook": "Engaging Facebook post script",
    "linkedin": "Professional LinkedIn summary",
    "twitter": "Short X tweet under 260 chars with hashtags",
    "whatsapp": "Informal WhatsApp recommendation text",
    "telegram": "Telegram sharing message with call to action"
  },
  "imageSeo": {
    "filename": "seo-optimized-lowercase-hyphenated-image-filename.jpg",
    "altText": "Descriptive image alt text",
    "title": "Clean, optimized image title (max 50 chars)",
    "caption": "Contextual image caption (max 100 chars)"
  },
  "seoScore": {
    "pinterestScore": 95,
    "ogScore": 92,
    "imageScore": 90,
    "overallScore": 92
  },
  "trendSuggestions": {
    "keywords": ["primary keyword", "secondary keyword", "long tail keyword"],
    "tags": ["relevant", "trending", "pinterest", "topics"],
    "contentAngles": ["Viral angle 1", "Comparison angle 2", "SEO guide angle 3"]
  }
}`;

    const userMessage = `Product Details:
Title: ${product.name}
Description: ${product.description}
Category: ${product.category}
Brand: ${product.brand || "MyThoughtsHub"}
`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const textContent = response.content[0].text;
    
    // Clean potential markdown tags
    const jsonString = textContent
      .trim()
      .replace(/^```json\s*/i, "")
      .replace(/```$/, "")
      .trim();

    const parsedData = JSON.parse(jsonString);
    return parsedData;
  } catch (error) {
    console.error("💥 Anthropic API call failed. Using rule-based fallback generator:", error);
    return generateFallbackSEO(product);
  }
};
