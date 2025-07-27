import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Clear both user and token cookies
  res.setHeader('Set-Cookie', [
    serialize('user', '', {
      maxAge: -1,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: false // Allow JavaScript to read the cookie
    }),
    serialize('token', '', {
      maxAge: -1,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true
    })
  ]);

  res.status(200).json({ message: 'Logged out successfully' });
}
