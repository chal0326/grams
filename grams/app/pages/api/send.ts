import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import type { NextApiRequest, NextApiResponse } from 'next';
import { SendMessageRequest } from '../../types';
import { SendMessageResponse } from './types';

const apiId = Number(process.env.NEXT_PUBLIC_API_ID);
const apiHash = process.env.NEXT_PUBLIC_API_HASH as string;
const sessionString = process.env.NEXT_PUBLIC_SESSION_STRING as string;

const client = new TelegramClient(new StringSession(sessionString), apiId, apiHash, {
  connectionRetries: 5,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse<SendMessageResponse>) {
    if (req.method === 'POST') {
        const { message, groupIds }: SendMessageRequest = req.body;

        try {
            await client.connect();

            const results = await Promise.all(
                groupIds.map(async (groupId) => {
                    try {
                        await client.sendMessage(groupId, { message });
                        return { groupId, success: true };
                    } catch (error) {
                        console.error(`Failed to send message to group ${groupId}:`, error);
                        return { groupId, success: false, error: (error as Error).message };
                    }
                })
            );

            res.status(200).json({ success: true, results });
        } catch (error) {
            console.error('Error sending messages:', error);
            res.status(500).json({ success: false, results: [], error: 'Failed to send messages' });
        } finally {
            await client.disconnect();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
