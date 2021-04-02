import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export class Mailer {
  private transporter: Mail;

  constructor() {
    this.transporter = createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_SENDER_PASSWORD,
      },
    });
  }

  public async sendCode(name: string, email: string, code: string) {
    try {
      await this.transporter.sendMail({
        from: `"Code sender" <${process.env.EMAIL_SENDER}>`,
        to: email,
        subject: "Verification code",
        text: `Hello, ${name}. Your verification code is ${code}`,
        html: `<div><b>Email verification</b><p>Hello, ${name}. Your verification code is <b>${code}</b></p></div>`,
      });
    } catch (err) {
      console.error(err);
    }
  }
}
