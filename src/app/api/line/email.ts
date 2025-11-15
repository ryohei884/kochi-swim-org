import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.EMAIL_CONTACT_HOST,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_CONTACT_USER,
    pass: process.env.EMAIL_CONTACT_PASS,
  },
  dkim: {
    domainName: process.env.EMAIL_CONTACT_DOMAIN ?? "",
    keySelector: process.env.EMAIL_KEY_SELECTOR ?? "",
    privateKey: process.env.EMAIL_PRIVATE_KEY ?? "",
  },
});

interface Props {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const contactEmail = async (props: Props) => {
  const { to, subject, text, html } = props;
  const info = await transporter.sendMail({
    from: '"お問い合わせ受付" <contact@swim-kochi.org>',
    to: to,
    subject: subject,
    text: text,
    html: html,
  });

  return info;
};
