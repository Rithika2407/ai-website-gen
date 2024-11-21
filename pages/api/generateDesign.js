import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'No prompt provided' });
    }

    try {
      const apiKey = (process.env.NEXT_PUBLIC_SAMBANOVA_API_KEY || '').trim();

      console.log(`Authorization Header: Bearer ${apiKey}`);

      const sambanovaResponse = await fetch('https://api.sambanova.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stream: true,
          model: 'Meta-Llama-3.1-8B-Instruct',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that can provide HTML/CSS code or suggest tools and methods (like Figma, React, etc.) for creating websites.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!sambanovaResponse.ok) {
        const errorDetails = await sambanovaResponse.text();
        console.error('Error from SambaNova API:', errorDetails);
        throw new Error('Failed to generate response from SambaNova.');
      }

      const responseBody = sambanovaResponse.body;
      let completeResponse = '';

      for await (const chunk of responseBody) {
        const chunkText = chunk.toString('utf-8');

        if (chunkText.trim().startsWith('data:')) {
          const jsonLine = chunkText.replace('data: ', '').trim();

          if (jsonLine === '[DONE]') break;

          try {
            const parsedChunk = JSON.parse(jsonLine);
            const content = parsedChunk.choices[0]?.delta?.content || '';
            completeResponse += content;
          } catch (parseError) {
            console.error('Error parsing chunk:', jsonLine, parseError.message);
          }
        }
      }

      console.log('Final Response:', completeResponse);

      return res.status(200).json({
        success: true,
        htmlCssCode: completeResponse,
        alternativeSuggestions: `<h2>Alternative suggestions here</h2>`,
      });
    } catch (error) {
      console.error('Error:', error.message);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
