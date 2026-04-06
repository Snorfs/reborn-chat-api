module.exports = async (req, res) => {
  const allowedOrigins = [
    'https://www.rebornwithmichael.com',
    'https://rebornwithmichael.com'
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { system, messages } = req.body;

    return res.status(200).json({
      content: [{ text: 'API working' }]
    });
  } catch (error) {
    console.error('API ERROR:', error);
    return res.status(500).json({
      error: error.message || 'Server error'
    });
  }
};
