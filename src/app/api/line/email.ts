import formData from "form-data";
import Mailgun from "mailgun.js";

interface Props {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const contactEmail = async (props: Props) => {
  const { to, subject, text, html } = props;
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY || "key-yourkeyhere",
  });

  const res = mg.messages
    .create("swim-kochi.org", {
      from: "お問い合わせ受付 <contact@swim-kochi.org>",
      to: to,
      subject: subject,
      text: text,
      html: html,
    })
    .then((msg) => console.log(msg)) // logs response data
    .catch((err) => console.error(err)); // logs any error

  return res;
};
