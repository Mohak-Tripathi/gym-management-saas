"use strict";
// export async function sendPasswordSetupEmail(email: string, token: string) {
//     const url = `https://yourdomain.com/set-password?token=${token}`;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordSetupEmail = void 0;
//     // Use Nodemailer, Resend, SendGrid, etc.
//     // await someMailer.send({
//     //   to: email,
//     //   subject: "Set your password",
//     //   html: `<p>Click <a href="${url}">here</a> to set your password.</p>`,
//     // });
//   }
// Using Resend
const resend_1 = require("resend");
async function sendPasswordSetupEmail(email, token) {
    const url = `https://yourdomain.com/set-password?token=${token}`;
    const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
        from: 'onboarding@resend.dev', // Can use this for testing
        to: email,
        subject: 'Welcome, Set your password',
        html: `<p>Click <a href="${url}">here</a> to set your password.</p>`
    });
}
exports.sendPasswordSetupEmail = sendPasswordSetupEmail;
// const resend = new Resend('re_CqLgBwf7_PabBs8BrwTrxhRCqWUV8dGTC');
// resend.emails.send({
//   from: 'onboarding@resend.dev',
//   to: 'mohaktripathi8@gmail.com',
//   subject: 'Hello World',
//   html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
// });
