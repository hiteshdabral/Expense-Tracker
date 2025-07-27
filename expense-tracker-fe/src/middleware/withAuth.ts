import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiHandler } from 'next';

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Get the token from the cookies
      const token = req.cookies['token'];
      
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // Add token to request headers for backend API calls
      if (!req.headers) {
        req.headers = {};
      }
      req.headers['Authorization'] = `Bearer ${token}`;

      // Call the original handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      return res.status(401).json({ message: 'Authentication failed' });
    }
  };
}
