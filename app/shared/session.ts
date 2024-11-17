import { createCookieSessionStorage } from '@remix-run/node';

type SessionData = {
  user_id: number;
  user_email: string;
};

type SessionFlashData = {
  error: string;
  message: string;
};

const isProduction = process.env.NODE_ENV === 'production';

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: '__session',

      // Use environment variable for secrets, fallback to dev secret if not set
      secrets: [process.env.APP_SECRET || 's3cret1'],

      // Secure settings for production
      secure: isProduction,
      sameSite: 'lax',

      // Common settings
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',

      // Production domain (optional)
      ...(isProduction && process.env.APP_URL
        ? { domain: process.env.APP_URL }
        : {}),

      httpOnly: true, // Always true for security
    },
  });

export const auth = {
  commit: commitSession,
  destroy: destroySession,
  retrieve: async (request: Request) => {
    return getSession(request.headers.get('cookie'));
  },
};
