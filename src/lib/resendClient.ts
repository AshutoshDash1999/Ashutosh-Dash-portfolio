import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(data: { name: string; email: string; message: string }) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode - email would have been sent:', data);
    return { id: 'dev-mode' };
  }

  return await resend.emails.send({
    from: 'contact@yourdomain.com',
    to: 'your@email.com',
    subject: `Portfolio Contact: ${data.name}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`,
  });
}

export { resend };
