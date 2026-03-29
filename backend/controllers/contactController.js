import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Basic Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All required fields must be filled." });
    }

    const newMessage = new Message({
      name,
      email,
      phone,
      subject,
      message
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message received! We will contact you shortly."
    });

    // OPTIONAL: If you want to receive an ACTUAL email to your Gmail,
    // you would integrate 'nodemailer' here. 
    // (This requires setting up Gmail App Passwords).

  } catch (err) {
    console.error("Contact Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
};