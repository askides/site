import { Resend } from 'resend';

let instance: Resend | null = null;

// Lazy, so the app boots without a Resend API key.
export function mailer() {
  if (!instance) {
    instance = new Resend(process.env.RESEND_API_KEY);
  }

  return instance;
}
