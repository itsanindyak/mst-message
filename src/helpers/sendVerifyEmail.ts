import { resend } from "@/lib/resendMail";

import VerificationEmail from "../../emails/emailTemplate";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerifyEmail(
  email: string,
  username: string,
  verifycode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Mstry-message verification",
      react: VerificationEmail({ username, otp: verifycode }),
    });

    return { success: true, message: "Verification email send successfully" };
  } catch (error) {
    console.log("Error to sending verification email");

    return { success: false, message: "Failed to send email" };
  }
}
