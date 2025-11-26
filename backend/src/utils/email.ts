export const sendPasswordResetEmail = async (
  email: string,
  resetLink: string
) => {
  // TODO: replace this with real email sending (e.g. nodemailer)
  console.log(`Password reset link for ${email}: ${resetLink}`);
};
