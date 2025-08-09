const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Allow requests only from your frontend URL
app.use(cors({
  origin: 'https://portfolio-site-wsw3.onrender.com' // replace with your actual frontend URL
}));

app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.post('/api/send', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Submission from ${name}`,
    text: `You have a new message from:\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    html: `<h3>New Contact Form Submission</h3>
           <p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
           <p><strong>Message:</strong></p>
           <p>${message}</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    res.status(200).send({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send({ success: false, message: 'Something went wrong. Please try again later.' });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
