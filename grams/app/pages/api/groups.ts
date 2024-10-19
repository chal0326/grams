import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions';
import type { NextApiRequest, NextApiResponse } from 'next';
import { TelegramGroup } from '../../types';

const apiId = Number(process.env.NEXT_PUBLIC_API_ID);
const apiHash = process.env.NEXT_PUBLIC_API_HASH as string;
const sessionString = process.env.NEXT_PUBLIC_SESSION_STRING as string;

const client = new TelegramClient(new StringSession(sessionString), apiId, apiHash, {
  connectionRetries: 5,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            await client.connect();
            const dialogs = await client.getDialogs();

            const groups: TelegramGroup[] = dialogs
                .filter(dialog => (dialog.isChannel || dialog.isGroup) && dialog.id !== undefined && dialog.title !== undefined) // Check for undefined
                .map(dialog => ({
                    id: dialog.id!.toString(), // Use non-null assertion
                    title: dialog.title!, // Use non-null assertion to ensure title is defined
                }));

            res.status(200).json(groups);
        } catch (error) {
            console.error('Error fetching groups:', error);
            res.status(500).json({ error: 'Failed to fetch groups' });
        } finally {
            await client.disconnect();
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
