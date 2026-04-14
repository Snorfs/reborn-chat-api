
module.exports = async (req, res) => {
  const origin = req.headers.origin;

  const allowedOrigins = [
    'https://www.rebornwithmichael.com',
    'https://rebornwithmichael.com'
  ];

  if (
    origin &&
    (
      allowedOrigins.includes(origin) ||
      origin.includes('.kajabi.com') ||
      origin.includes('.mykajabi.com')
    )
  ) {
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

    const anthropicMessages = (messages || [])
      .filter(m => m && m.content)
      .map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: [
          {
            type: 'text',
            text: String(m.content)
          }
        ]
      }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 600,
        system,
        messages: anthropicMessages
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('ANTHROPIC ERROR:', data);
      return res.status(response.status).json({
        error: data.error?.message || 'Anthropic request failed',
        raw: data
      });
    }

    const reply = (data.content || [])
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n')
      .trim();

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('API ERROR:', error);
    return res.status(500).json({
      error: error.message || 'Server error'
    });
  }
};
