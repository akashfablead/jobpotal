const contactModel = require("../models/contact.model");

// Handle contact form submission
    export const submitContactForm = async (req, res) => {
    
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Save the contact form data to the database
    const contact = new contactModel({ name, email, message });
    await contact.save();

    res.status(201).json({ message: 'Message received successfully!' });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};