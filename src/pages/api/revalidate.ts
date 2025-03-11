import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const secret = process.env.REVALIDATE_SECRET;
    if (req.query.secret !== secret) {
        return res.status(401).json({ message: 'Invalid Token' });
    }

    try {
        // Revalidate die Startseite
        await res.revalidate('/');
        return res.json({ revalidated: true });
    } catch (err) {
        return res.status(500).json({ message: 'Error revalidating' });
    }
}
