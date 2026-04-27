import { createHash } from 'node:crypto';
import { config } from 'dotenv';

config({ path: new URL('../.env', import.meta.url).pathname });

const PIXEL_ID   = '2132201073841264';
const API_VERSION = 'v19.0';
const CAPI_URL   = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;
const LOCAL_URL  = 'http://localhost:3000/api/track';

function sha256(str) {
    return createHash('sha256').update(str).digest('hex');
}

// Dados de teste — altere à vontade
const TEST = {
    event_name:        'Lead',
    email:             'teste@exemplo.com',
    phone:             '11999999999',
    first_name:        'Leonardo',
    last_name:         'Ames',
    city:              'São Paulo',
    state:             'SP',
    country:           'BR',
    event_source_url:  'https://cg.leonardoames.com.br',
};

// ─── Modo 1: direto na Meta CAPI (testa token + pixel) ───────────────────────
async function testDirect() {
    const token = process.env.META_ACCESS_TOKEN;
    if (!token) {
        console.error('❌  META_ACCESS_TOKEN não encontrado. Crie um .env com essa variável.');
        process.exit(1);
    }

    const event_id = `Lead_test_${Date.now()}`;

    const user_data = {
        em:      sha256(TEST.email.toLowerCase().trim()),
        ph:      sha256(TEST.phone.replace(/\D/g, '')),
        fn:      sha256(TEST.first_name.toLowerCase()),
        ln:      sha256(TEST.last_name.toLowerCase()),
        ct:      sha256(TEST.city.toLowerCase()),
        st:      sha256(TEST.state.toLowerCase()),
        country: sha256(TEST.country.toLowerCase()),
        client_ip_address: '177.72.241.1',   // IP brasileiro fictício
        client_user_agent: 'Mozilla/5.0 (test)',
    };

    const payload = {
        data: [{
            event_name:       TEST.event_name,
            event_time:       Math.floor(Date.now() / 1000),
            event_source_url: TEST.event_source_url,
            action_source:    'website',
            event_id,
            user_data,
        }],
        access_token: token,
        ...(testCode && { test_event_code: testCode }),
    };

    console.log('\n📡  Modo: direto na Meta CAPI');
    console.log('   event_id:', event_id);
    console.log('   user_data keys:', Object.keys(user_data).join(', '));

    const res  = await fetch(CAPI_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
    });
    const body = await res.json();

    if (res.ok) {
        console.log('\n✅  Evento enviado com sucesso!');
        console.log('   events_received:', body.events_received);
    } else {
        console.error('\n❌  Erro da Meta:', JSON.stringify(body, null, 2));
    }
}

// ─── Modo 2: via serverless local (testa a função /api/track) ────────────────
async function testLocal() {
    const event_id = `Lead_test_${Date.now()}`;

    const body = {
        event_name:       TEST.event_name,
        event_id,
        event_source_url: TEST.event_source_url,
        em:               TEST.email,
        ph:               TEST.phone,
        fn:               TEST.first_name,
        ln:               TEST.last_name,
        // fbp e fbc omitidos intencionalmente no teste
    };

    console.log('\n📡  Modo: servidor local', LOCAL_URL);
    console.log('   payload:', JSON.stringify(body, null, 2));

    try {
        const res  = await fetch(LOCAL_URL, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(body),
        });
        const data = await res.json();

        if (res.ok) {
            console.log('\n✅  Resposta do servidor:', JSON.stringify(data, null, 2));
        } else {
            console.error('\n❌  Erro do servidor:', JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error('\n❌  Servidor não está rodando em', LOCAL_URL);
        console.error('   Suba o projeto com: vercel dev');
    }
}

// ─── Execução ─────────────────────────────────────────────────────────────────
const mode      = process.argv[2] || 'direct';
const testCode  = process.argv[3] || null;

if (mode === 'local') {
    await testLocal();
} else {
    await testDirect();
}
