import { Injectable } from "@nestjs/common";
import { Resend } from "resend";
import { ResetPasswordEmail } from "./reset-password";
import { render } from "react-email";

@Injectable()
export class EmailService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY);

  async sendPasswordReset(to: string, name: string, otp: string) {
    const html = await render(<ResetPasswordEmail email={to} name={name} resetOtp={otp} />);
    await this.resend.emails.send({
      from: 'noreply@gomile.fr',
      to,
      subject: 'Reset your password',
      html,
    });
  }

}



