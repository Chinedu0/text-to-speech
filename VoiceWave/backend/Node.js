const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Security
app.use(helmet()); // Adds various security headers
app.use(cors({ origin: 'https://your-frontend-url.com' })); // Adjust as needed

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 // Limit each IP to 100 requests per windowMs
});

app.use(limiter);

app.use(express.json());

app.post('/tts', async (req, res) => {
  const { text, voice, rate, pitch, volume } = req.body;

  try {
    const response = await axios.post('https://text-to-speech-api-url', {
      input: { text },
      voice: { name: voice },
      audioConfig: { audioEncoding: 'MP3', speakingRate: rate, pitch, volumeGainDb: volume }
    }, {
      headers: { 'Authorization': `Bearer ${process.env.TTS_API_KEY}`, 'Content-Type': 'application/json' }
    });

    res.json({ audioUrl: response.data.audioContent });
  } catch (error) {
    console.error('Error converting text to speech:', error);
    res.status(500).json({ error: 'Error converting text to speech' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
