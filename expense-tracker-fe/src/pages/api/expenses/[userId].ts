import type { NextApiRequest, NextApiResponse } from 'next';
import api from '@/lib/axios';
import { withAuth } from '@/middleware/withAuth';

export default withAuth(async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get expenses
        const response = await api.get(`/expense/${userId}`);
        return res.status(200).json(response.data);

      case 'POST':
        // Create expense
        const { amount, description, category_id, date } = req.body;
        const createResponse = await api.post('/expense', {
          amount,
          description,
          user_id: userId,
          category_id,
          date
        });
        return res.status(201).json(createResponse.data);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error: any) {
    console.error('API Route Error:', error.response?.data || error.message);
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'Internal server error'
    });
  }
});
