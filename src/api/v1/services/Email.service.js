import nodemailer from "nodemailer";
import { EventEmitter } from "events";

export const Sendmailservice = async ({ to, subject, html, attachments = [] }) => {
    try {
        const EMAIL = process.env.EMAIL_USER;
        const PASSWORD = process.env.EMAIL_PASSWORD;

        if (!EMAIL || !PASSWORD) {
            console.log("Email credentials not found in environment variables.");
            return;
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: { user: EMAIL, pass: PASSWORD },
        });

        const info = await transporter.sendMail({
            from: `"Youssef" <${EMAIL}>`,
            to,
            subject,
            html,
            attachments,
        });

        return info;
    } catch (error) {
        console.log("Email sending failed:", error);
    }
};

/* ------------------ EVENT EMITTER ------------------ */

export const emitter = new EventEmitter();

emitter.on("SendEmail", ({ to, subject, html, attachments = [] }) => {
    Sendmailservice({ to, subject, html, attachments })
        .then(() => console.log(`Email event executed successfully for: ${to}`))
        .catch((err) => console.log("Email event failed:", err));
});