const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @desc    Handle contact form submission
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    // Email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        
        <h3>Contact Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${firstName} ${lastName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Subject:</strong> ${subject}</li>
        </ul>

        <h3>Message:</h3>
        <p>${message}</p>

        <hr>
        <p><small>This message was sent from the DriveNow contact form.</small></p>
      `
    };

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting DriveNow',
      html: `
        <h2>Thank you for contacting DriveNow!</h2>
        
        <p>Dear ${firstName},</p>
        
        <p>We have received your message and our team will get back to you within 24 hours.</p>
        
        <h3>Your Message Details:</h3>
        <ul>
          <li><strong>Subject:</strong> ${subject}</li>
          <li><strong>Message:</strong> ${message}</li>
        </ul>

        <p>If you have any urgent inquiries, please call us at 1-800-DRIVE-NOW.</p>
        
        <p>Best regards,<br>The DriveNow Team</p>
      `
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).json({
      message: 'Contact form submitted successfully! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      message: 'Failed to submit contact form. Please try again.' 
    });
  }
};

module.exports = {
  submitContactForm
};