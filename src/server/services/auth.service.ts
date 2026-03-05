import prisma from '../prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail, sendPasswordResetEmail } from './email.service';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secret';

const generateTokens = (userId: string, role: string) => {
  const accessToken = jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const registerUser = async (email: string, name: string, password: string) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error('Email already in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  const verifyToken = crypto.randomBytes(32).toString('hex');

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      emailVerifyToken: verifyToken,
      wallet: { create: { balance: 0 } },
    },
  });

  await sendVerificationEmail(user.email, verifyToken);

  return { message: 'Registration successful. Please verify your email.' };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  if (!user.isEmailVerified) throw new Error('Please verify your email first');

  const { accessToken, refreshToken } = generateTokens(user.id, user.role);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return { accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
};

export const refreshToken = async (token: string) => {
  const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
  
  if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }

  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    
    if (!user) throw new Error('User not found');

    // Revoke old token (Rotation)
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    const tokens = generateTokens(user.id, user.role);

    // Create new refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return tokens;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

export const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({ where: { emailVerifyToken: token } });
  if (!user) throw new Error('Invalid or expired token');

  await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true, emailVerifyToken: null },
  });

  return { message: 'Email verified successfully' };
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { message: 'If email exists, a reset link has been sent' }; // Prevent email enumeration

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expireDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { resetPasswordToken: resetToken, resetPasswordExpire: expireDate },
  });

  await sendPasswordResetEmail(user.email, resetToken);

  return { message: 'If email exists, a reset link has been sent' };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: token,
      resetPasswordExpire: { gt: new Date() },
    },
  });

  if (!user) throw new Error('Invalid or expired token');

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpire: null,
    },
  });

  // Revoke all refresh tokens on password reset
  await prisma.refreshToken.updateMany({
    where: { userId: user.id },
    data: { revoked: true },
  });

  return { message: 'Password reset successfully' };
};
