import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, 'dist');
const app = express();

app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.use(express.static(distPath));
// SPA fallback: let React Router handle any non-API route.
app.get(/^(?!\/api\/).*/, (_req, res) => res.sendFile(path.join(distPath, 'index.html')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`golf-course-app listening on :${port}`));
