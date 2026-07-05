/**
 * KRYONIS Forms Worker
 * Receives JSON from kryonis.global forms and forwards to the Studio via Resend.
 * Secret required: RESEND_API_KEY
 */

const ALLOWED_ORIGINS = [
  'https://kryonis.global',
  'https://www.kryonis.global',
];

const TO_ADDRESS = 'hq@kryonis.global';
const FROM_ADDRESS = 'KRYONIS <hq@kryonis.global>';

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return json({ ok: false, error: 'Method not allowed' }, 405, cors);
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return json({ ok: false, error: 'Invalid JSON' }, 400, cors);
    }

    // Honeypot: silently accept and drop
    if (data.website) {
      return json({ ok: true }, 200, cors);
    }

    const clean = (v, max = 500) => String(v ?? '').slice(0, max).trim();
    const name = clean(data.name, 200);
    const email = clean(data.email, 200);
    const message = clean(data.message, 6000);
    const formType = clean(data.form, 50) || 'inquiry';

    if (!name || !email.includes('@') || !message) {
      return json({ ok: false, error: 'Missing required fields' }, 400, cors);
    }

    const skip = new Set(['website', 'form', 'page']);
    const lines = Object.entries(data)
      .filter(([k, v]) => !skip.has(k) && String(v ?? '').trim() !== '')
      .map(([k, v]) => `${k}: ${clean(v, 6000)}`)
      .join('\n');

    const subjectHint = clean(data.instrument || data.track || 'Inquiry', 120);
    const subject = `[${formType.toUpperCase()}] ${subjectHint} — ${name}`;

    const body = [
      `Form: ${formType}`,
      `Page: ${clean(data.page, 200)}`,
      `Received: ${new Date().toISOString()}`,
      '',
      lines,
    ].join('\n');

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [TO_ADDRESS],
        reply_to: email,
        subject,
        text: body,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => '');
      console.error('Resend error:', resp.status, err);
      return json({ ok: false, error: 'Delivery failed' }, 502, cors);
    }

    return json({ ok: true }, 200, cors);
  },
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}
