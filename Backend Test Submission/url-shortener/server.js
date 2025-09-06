const express = require('express');
const bodyParser = require('body-parser');
const log = require('./loggingMiddleware');
const crypto = require('crypto');
const app = express();

app.use(bodyParser.json());

const urlStore = {};

function generateShortcode() {
    return crypto.randomBytes(3).toString('hex');
}

app.post('/shorturls', async (req, res) => {
    const { url, validity = 30, shortcode } = req.body;

    try {
        new URL(url);
    } catch {
        await log('backend', 'error', 'handler', 'Invalid URL format');
        return res.status(400).json({ message: 'Invalid URL format.' });
    }

    let code = shortcode;
    if (!code || typeof code !== 'string' || code.length < 4) {
        code = generateShortcode();
    }
    if (urlStore[code]) {
        await log('backend', 'error', 'handler', `Shortcode already exists: ${code}`);
        return res.status(409).json({ message: 'Shortcode already exists.' });
    }

    const expiryDate = new Date(Date.now() + validity * 60 * 1000).toISOString();
    urlStore[code] = { url, expiry: expiryDate };

    await log('backend', 'info', 'handler', `Short URL created: ${code} for ${url}`);
    res.status(201).json({
        shortUrl: `http://localhost:4000/${code}`,
        expiry: expiryDate
    });
});

app.get('/shorturls/:code', async (req, res) => {
    const { code } = req.params;
    const entry = urlStore[code];

    if (!entry) {
        await log('backend', 'error', 'handler', `Shortcode not found: ${code}`);
        return res.status(404).json({ message: 'Shortcode not found.' });
    }

    const now = new Date();
    if (now > new Date(entry.expiry)) {
        await log('backend', 'error', 'handler', `Shortcode expired: ${code}`);
        return res.status(410).json({ message: 'Shortcode expired.' });
    }

    await log('backend', 'info', 'handler', `Redirected: ${code} to ${entry.url}`);
    res.redirect(entry.url);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:4000');
});
