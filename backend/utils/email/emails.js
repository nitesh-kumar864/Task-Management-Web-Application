import sendMail from "./sendEmail.js";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";


// ----------------------- SEND VERIFICATION EMAIL (OTP) -----------------
export const sendVerificationEmail = async (email, userName, code) => {
  const html = VERIFICATION_EMAIL_TEMPLATE
    .replace("{userName}", userName)
    .replace("{verificationCode}", code);

  await sendMail({
    to: email,
    subject: "Verify Your Email",
    html,
  });
};

// -------------------------- SEND PASSWORD RESET EMAIL -----------------
export const sendPasswordResetEmail = async (email, userName, resetLink) => {
  const html = PASSWORD_RESET_REQUEST_TEMPLATE
    .replace("{userName}", userName)
    .replace("{resetURL}", resetLink);

  await sendMail({
    to: email,
    subject: "Reset Your Password",
    html,
  });
};

// ------------------------- SEND PASSWORD RESET SUCCESS EMAIL ----------------
export const sendResetSuccessEmail = async (email, userName) => {
  const html = PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{userName}", userName);

  await sendMail({
    to: email,
    subject: "Password Reset Successful",
    html,
  });
};
