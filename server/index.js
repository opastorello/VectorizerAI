import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import multer from 'multer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3001;

const API_BASE = 'https://api.vectorizer.ai/api/v1';

const VECTORIZER_API_ID = process.env.VECTORIZER_API_ID;
const VECTORIZER_API_SECRET = process.env.VECTORIZER_API_SECRET;

const AUTH_USERNAME = process.env.AUTH_USERNAME;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

function getVectorizerAuthHeader() {
  if (!VECTORIZER_API_ID || !VECTORIZER_API_SECRET) {
    return null;
  }
  const token = Buffer.from(`${VECTORIZER_API_ID}:${VECTORIZER_API_SECRET}`).toString('base64');
  return `Basic ${token}`;
}

app.use(cors());
app.use(express.json());

app.get('/api/auth/config', (req, res) => {
  const authRequired = !!(AUTH_USERNAME && AUTH_PASSWORD);
  res.json({ authRequired });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!AUTH_USERNAME || !AUTH_PASSWORD) {
    return res.json({ success: true });
  }

  if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
    return res.json({ success: true });
  }

  res.status(401).json({ success: false, error: 'Invalid credentials' });
});

app.get('/api/account', async (req, res) => {
  try {
    const authHeader = getVectorizerAuthHeader();
    if (!authHeader) {
      return res.status(500).json({ error: 'Missing VECTORIZER_API_ID or VECTORIZER_API_SECRET' });
    }

    const response = await fetch(`${API_BASE}/account`, {
      headers: { Authorization: authHeader },
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/vectorize', upload.single('image'), async (req, res) => {
  try {
    const authHeader = getVectorizerAuthHeader();
    if (!authHeader) {
      return res.status(500).json({ error: 'Missing VECTORIZER_API_ID or VECTORIZER_API_SECRET' });
    }

    const formData = new FormData();

    if (req.file) {
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append('image', blob, req.file.originalname);
    }

    if (req.body['image.url']) {
      formData.append('image.url', req.body['image.url']);
    }

    if (req.body.mode) {
      formData.append('mode', req.body.mode);
    }

    if (req.body['output.file_format']) {
      formData.append('output.file_format', req.body['output.file_format']);
    }

    const response = await fetch(`${API_BASE}/vectorize`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
      },
      body: formData,
    });

    const creditsCharged = response.headers.get('X-Credits-Charged') || '0';
    const creditsCalculated = response.headers.get('X-Credits-Calculated') || '0';

    if (!response.ok) {
      const errorText = await response.text();
      try {
        return res.status(response.status).json(JSON.parse(errorText));
      } catch {
        return res.status(response.status).json({ error: errorText || 'Vectorizer API error' });
      }
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const isSvg = contentType.includes('image/svg+xml');

    if (isSvg || contentType.startsWith('text/')) {
      const content = await response.text();
      return res.json({ content, contentType, isBase64: false, creditsCharged, creditsCalculated });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const content = buffer.toString('base64');
    res.json({ content, contentType, isBase64: true, creditsCharged, creditsCalculated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
