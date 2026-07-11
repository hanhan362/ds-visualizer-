import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './routes/auth.js';
import { algoRouter } from './routes/algorithms.js';
import { userDataRouter } from './routes/userData.js';
import { auth } from './middleware/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(auth);

// API 路由
app.use('/api', authRouter);
app.use('/api', algoRouter);
app.use('/api', userDataRouter);

// 生产环境：提供前端静态文件
const frontendDist = path.join(__dirname, '..', 'frontend-dist');
app.use(express.static(frontendDist));
// SPA fallback：所有非 API 请求返回 index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(Number(PORT), () => console.log(`Backend running on port ${PORT}`));
