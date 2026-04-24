import { createHash } from 'node:crypto';

const PIXEL_ID = '2132201073841264';
const API_VERSION = 'v19.0';
const CAPI_URL = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;

function sha256(str) {
    return createHash('sha256').update(str).digest('hex');
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://cg.leonardoames.com.br');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const token = process.env.META_ACCESS_TOKEN;
    if (!token) return res.status(500).json({ error: 'Token not configured' });

    const { event_name, event_id, event_source_url, fbp, fbc, em, ph } = req.body || {};

    if (!event_name) return res.status(400).json({ error: 'event_name required' });

    const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
    const ua = req.headers['user-agent'] || '';

    const user_data = {
        client_ip_address: ip,
        client_user_agent: ua,
    };
    if (fbp) user_data.fbp = fbp;
    if (fbc) user_data.fbc = fbc;
    if (em)  user_data.em  = sha256(em.toLowerCase().trim());
    if (ph)  user_data.ph  = sha256(ph.replace(/\D/g, ''));

    const payload = {
        data: [{
            event_name,
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: event_source_url || 'https://cg.leonardoames.com.br',
            action_source: 'website',
            event_id: event_id || `${event_name}_${Date.now()}`,
            user_data,
        }],
        access_token: token,
    };

    try {
        const response = await fetch(CAPI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);
        return res.status(200).json({ ok: true, events_received: data.events_received });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
