import nodemailer from 'nodemailer';

// Configure your email provider here
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER || 'user',
    pass: process.env.SMTP_PASS || 'pass',
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: '"SaaS App" <noreply@saasapp.com>',
    to: email,
    subject: 'Verify your email address',
    html: `
      <h1>Welcome to SaaS App!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
    `,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: '"SaaS App" <noreply@saasapp.com>',
    to: email,
    subject: 'Reset your password',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to set a new password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
};

export const sendPaymentSuccessEmail = async (email: string, amount: number) => {
  await transporter.sendMail({
    from: '"SaaS App" <noreply@saasapp.com>',
    to: email,
    subject: 'Payment Successful',
    html: `
      <h1>Payment Received</h1>
      <p>Thank you for your payment of $${amount.toFixed(2)}.</p>
      <p>Your account has been updated.</p>
    `,
  });
};

export const sendSubscriptionExpiringEmail = async (email: string, endDate: Date) => {
  await transporter.sendMail({
    from: '"SaaS App" <noreply@saasapp.com>',
    to: email,
    subject: 'Action Required: Subscription Expiring Soon',
    html: `
      <h1>Subscription Expiring</h1>
      <p>Your subscription is set to expire on ${endDate.toLocaleDateString()}.</p>
      <p>Please update your payment method to avoid service interruption.</p>
    `,
  });
};
