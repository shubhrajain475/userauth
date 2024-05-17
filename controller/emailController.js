// controllers/emailController.js
import { addEmailToQueue, getEmailQueue, clearEmailQueue } from '../model/emailModel.js';
import { transporter, holidays } from '../config/config.js';


const scheduleEmail = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  addEmailToQueue(email, password);
  res.status(200).json({ message: 'Email scheduled successfully' });
};

const sendScheduledEmails = () => {
  const today = new Date();
  if (holidays.isHoliday(today)) {
    console.log('Today is a holiday. No emails will be sent.');
    return;
  }

  const emailQueue = getEmailQueue();
  emailQueue.forEach(({ email, password }) => {
    sendEmail(email, password);
  });

  clearEmailQueue();
};

const sendEmail = (email, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Automated Email',
    text: 'This is an automated email sent at the end of the day.',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(`Error: ${error}`);
      return;
    }
    console.log('Email sent: ' + info.response);
  });
};

export { scheduleEmail, sendScheduledEmails };
