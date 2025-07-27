import type { NextApiRequest, NextApiResponse } from 'next';
import api from '@/lib/axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userId = req.query.userId as string;
    const [expenseRes, categoryRes] = await Promise.all([
      api.get(`/expense/${userId}`),
      api.get(`/category/${userId}`),
    ]);

    res.status(200).json({
      expenses: expenseRes.data,
      categories: categoryRes.data,
    });
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ 
      message: error.response?.data?.message || 'Failed to fetch dashboard data' 
    });
  }
}
