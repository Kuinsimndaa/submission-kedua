require('dotenv').config();
const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const subscriptions = [];

webpush.setVapidDetails(
  'mailto:your@email.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Endpoint untuk simpan subscription user
app.post('/subscribe', (req, res) => {
  const sub = req.body;
  subscriptions.push(sub);
  res.status(201).json({ message: 'Subscription saved.' });
});

// Endpoint untuk kirim push ke semua subscriber
app.post('/push', async (req, res) => {
  const { title, body, url } = req.body;
  const payload = JSON.stringify({ title, body, url });
  let success = 0;
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
      success++;
    } catch (err) {
      // Handle expired subscription, etc.
    }
  }
  res.json({ message: `Push sent to ${success} subscribers.` });
});

app.listen(3000, () => console.log('Push server running on http://localhost:3000'));
