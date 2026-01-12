import express from 'express';
import cors from 'cors';
import multer from 'multer';
import FormData from 'form-data';

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3001;

const API_BASE = 'https://api.vectorizer.ai/api/v1';

const AUTH_USERNAME = process.env.AUTH_USERNAME;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

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
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing Authorization header' });
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
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing Authorization header' });
    }

    const formData = new FormData();

    if (req.file) {
      formData.append('image', req.file.buffer, {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });
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
        ...formData.getHeaders(),
      },
      body: formData,
    });

    const creditsCharged = response.headers.get('X-Credits-Charged') || '0';
    const creditsCalculated = response.headers.get('X-Credits-Calculated') || '0';

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json(errorData);
    }

    const content = await response.text();
    res.json({ content, creditsCharged, creditsCalculated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
