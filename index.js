// Backend: index.js (Express Server)

// Install dependencies using the following command before running this script
// npm install telegram input dotenv express

const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const apiId = parseInt(process.env.API_ID, 10);
const apiHash = process.env.API_HASH;
const phoneNumber = process.env.PHONE_NUMBER;
const stringSession = new StringSession(process.env.SESSION_STRING || '');

let client;
let groups = [];

app.get('/groups', async (req, res) => {
    try {
        if (!client) {
            client = new TelegramClient(stringSession, apiId, apiHash, {});
            await client.start({
                phoneNumber: phoneNumber,
                password: async () => '', // No password for 2FA if not set
                phoneCode: async () => await input.text('Please enter the code you received: '),
                onError: (err) => console.log(err),
            });
            console.log('You are now connected.');
            console.log(client.session.save()); // Save this string to avoid re-authenticating
        }

        const dialogs = await client.getDialogs();
        groups = dialogs.filter(dialog => (dialog.isGroup || dialog.isChannel) && dialog.title);

        res.json(groups.map((group, index) => ({ id: index, title: group.title })));
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve groups. Please try again later.' });
        console.error(error);
    }
});

app.post('/send', async (req, res) => {
    try {
        const selectedGroupIndices = Array.isArray(req.body.groups) ? req.body.groups : [req.body.groups];
        const selectedGroups = selectedGroupIndices.map(index => groups[parseInt(index)]);
        const message = req.body.message;

        for (const group of selectedGroups) {
            try {
                await client.sendMessage(group.id, { message });
                console.log(`Message sent to ${group.title}`);
            } catch (error) {
                console.error(`Failed to send message to ${group.title}:`, error);
            }
        }

        res.json({ status: 'Messages sent successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send messages. Please try again later.' });
        console.error(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
