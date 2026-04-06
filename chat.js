export async function OPTIONS(req) {
  const origin = req.headers.get('origin');
  const allowedOrigins = [
    'https://www.rebornwithmichael.com',
    'https://rebornwithmichael.com'
  ];

  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return new Response(null, { status: 200, headers });
}

export async function POST(req) {
  const origin = req.headers.get('origin');
  const allowedOrigins = [
    'https://www.rebornwithmichael.com',
    'https://rebornwithmichael.com'
  ];

  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  try {
    const { system, messages } = await req.json();

    return new Response(
      JSON.stringify({
        content: [{ text: 'API working' }]
      }),
      { status: 200, headers }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Server error' }),
      { status: 500, headers }
    );
  }
}
