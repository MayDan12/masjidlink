import nodemailer from "nodemailer";

export async function sendEmailToFollowers(emails: string[], event: any) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SENDER, // e.g. your@gmail.com
      pass: process.env.EMAIL_APP_PASSWORD, // app password if using Gmail
    },
  });

  const emailPromises = emails.map((email) =>
    transporter.sendMail({
      from: `"MasjidLink" <${process.env.EMAIL_SENDER}>`,
      to: email,
      subject: `New Event: ${event.title}`,
      html: `
        <h2>${event.title}</h2>
        <p>${event.description}</p>
        <p><strong>Date:</strong> ${event.date}</p>
        <p><strong>Time:</strong> ${event.startTime} - ${
        event.endTime || "N/A"
      }</p>
        <p><strong>Location:</strong> ${event.location}</p>
      `,
    })
  );

  await Promise.all(emailPromises);
}
