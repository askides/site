import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  json,
  redirect,
} from '@remix-run/node';
import { email, object, pipe, safeParse, string } from 'valibot';
import { mailer } from '~/shared/emails';
import { liquid } from '~/shared/liquid';
import { auth } from '~/shared/session';

const APP_URL = process.env.APP_URL as string;
const RESEND_API_KEY = process.env.RESEND_API_KEY as string;
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL as string;
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID as string;

export async function action({ request }: ActionFunctionArgs) {
  // Validate the data
  const { issues, output: data } = safeParse(
    object({
      email: pipe(string(), email()),
    }),
    await request.json()
  );

  if (issues) {
    return json(
      { message: 'The provided email is invalid. Please try again.' },
      { status: 400 }
    );
  }

  if (!RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    return json(
      { message: 'The application is not configured to send emails.' },
      { status: 500 }
    );
  }

  // Subscribe the user in the audience. (Will be unsubscribed by default)
  const response = await mailer.contacts.create({
    email: data.email,
    unsubscribed: true,
    audienceId: RESEND_AUDIENCE_ID,
  });

  // Send the confirmation email to the user.
  const html = await liquid.renderFile('subscribe', {
    href: `${APP_URL}/api/subscribe?id=${response.data?.id}`,
  });

  await mailer.emails.send({
    from: RESEND_FROM_EMAIL,
    to: data.email,
    subject: '[Action Required] Confirm Your Email!',
    html: html,
  });

  return json({ message: 'Operation successful.', response });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id || !RESEND_API_KEY || !RESEND_AUDIENCE_ID) {
    return json({ message: 'Invalid request.' }, { status: 400 });
  }

  // Confirm the user in the audience.
  await mailer.contacts.update({
    audienceId: RESEND_AUDIENCE_ID,
    id,
    unsubscribed: false,
  });

  // Flash the success message.
  const session = await auth.retrieve(request);

  session.flash('message', 'Your email has been confirmed.');

  return redirect('/', {
    headers: {
      'Set-Cookie': await auth.commit(session),
    },
  });
}
