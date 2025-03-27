import {NextApiRequest, NextApiResponse} from 'next';
import Redis from 'ioredis';
import {v4 as uuidv4} from 'uuid';

// Redis configuration
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        try {
            const {files} = req.body;
            const userId = req.headers['x-user-id'] as string;

            if (!userId) {
                return res.status(400).json({error: 'User ID is required'});
            }

            // Generate a unique session ID for this upload batch
            const sessionId = uuidv4();

            // Store files in Redis with expiration
            const redisKey = `upload:${userId}:${sessionId}`;
            await redis.set(
                redisKey,
                JSON.stringify(files),
                'EX',
                600 // 10 minutes expiration
            );

            res.status(200).json({
                message: 'Files stored in Redis',
                sessionId
            });
        } catch (error) {
            console.error('Redis storage error:', error);
            res.status(500).json({error: 'Failed to store files'});
        }
    } else if (req.method === 'GET') {
        // Endpoint to retrieve stored files
        const {userId, sessionId} = req.query;

        try {
            const redisKey = `upload:${userId}:${sessionId}`;
            const storedFiles = await redis.get(redisKey);

            if (storedFiles) {
                res.status(200).json(JSON.parse(storedFiles));
            } else {
                res.status(404).json({error: 'No files found'});
            }
        } catch (e) {
            res.status(500).json({error: 'Failed to retrieve files', e});
        }
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}