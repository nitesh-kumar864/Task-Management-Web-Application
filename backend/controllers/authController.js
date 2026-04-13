import bcrypt from "bcrypt";
import crypto from "crypto";

import generateTokenAndSetCookies from "../utils/generateTokenAndSetCookies.js";

import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail
} from "../utils/email/emails.js";

import User from "../models/userModel.js";


// --------------------SIGNUP  -------------------- */

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}\-_=+|;:'",.<>/\\]).{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a strong password",
      });
    }



    const userAlreadyExists = await User.findOne({ normalizedEmail });
    if (userAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      email: normalizedEmail,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();

    // Create cookie
    generateTokenAndSetCookies(res, user);

    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (err) {
      console.log("Email failed:", err.message);
    }

    res.status(201).json({
      success: true,
      message: "User created successfully. Verification code sent.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This email already registered",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || "Signup failed",
    });
  }
};


/* --------------------VERIFY EMAIL (OTP)------------------------ */
export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    generateTokenAndSetCookies(res, user._id);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ----------------LOGIN-------------- */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "This email is not registered" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid email or password" });
    }

    generateTokenAndSetCookies(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });

  } catch (error) {
    console.log("Error in login:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};




/* -------------------------LOGOUT---------------------------- */
export const logout = async (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};




/* -----------------------FORGOT PASSWORD--------------------------- */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendPasswordResetEmail(user.email, user.name, resetURL);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};


/* ----------------------------RESET PASSWORD-------------------------- */
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}\-_=+|;:'",.<>/\\])[A-Za-z\d@$!%*?&#^()[\]{}\-_=+|;:'",.<>/\\]{8,}$/


  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
    });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email, user.name);

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.log("Error in resetPassword:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

/* ----------------------------- CHECK AUTH--------------------------- */
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");


    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log("Error in checkAuth:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
