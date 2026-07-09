import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB = path.join(__dirname, '..', 'data');

// ── JSON 文件读写 ──
function readDB(name: string): any[] {
  try { return JSON.parse(fs.readFileSync(path.join(DB, name + '.json'), 'utf-8')); } catch { return []; }
}
function writeDB(name: string, data: any[]) {
  if (!fs.existsSync(DB)) fs.mkdirSync(DB, { recursive: true });
  fs.writeFileSync(path.join(DB, name + '.json'), JSON.stringify(data));
}
function nextId(name: string): number {
  try {
    const meta = JSON.parse(fs.readFileSync(path.join(DB, '_meta.json'), 'utf-8'));
    meta[name] = (meta[name] || 0) + 1;
    fs.writeFileSync(path.join(DB, '_meta.json'), JSON.stringify(meta));
    return meta[name];
  } catch {
    fs.writeFileSync(path.join(DB, '_meta.json'), JSON.stringify({ [name]: 1 }));
    return 1;
  }
}

// ── JWT ──
const SECRET = 'ds-visualizer-jwt-secret-key-2024';
function signToken(user: any) { return jwt.sign({ id: user.id, sub: user.username }, SECRET, { expiresIn: '24h' }); }
function authMw(req: any, _res: any, next: any) {
  const h = req.headers.authorization;
  if (h?.startsWith('Bearer ')) {
    try { const p = jwt.verify(h.slice(7), SECRET) as any; req.userId = p.id; req.username = p.sub; } catch {}
  }
  next();
}

// ── 种子算法 ──
const algorithms = [
  { id: 'bubble', name: 'Bubble Sort', timeComplexity: 'O(n^2)', spaceComplexity: 'O(1)', stable: true },
  { id: 'selection', name: 'Selection Sort', timeComplexity: 'O(n^2)', spaceComplexity: 'O(1)', stable: false },
  { id: 'insertion', name: 'Insertion Sort', timeComplexity: 'O(n^2)', spaceComplexity: 'O(1)', stable: true },
  { id: 'quick', name: 'Quick Sort', timeComplexity: 'O(n log n)', spaceComplexity: 'O(log n)', stable: false },
  { id: 'merge', name: 'Merge Sort', timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)', stable: true },
];

// ── 排序引擎 ──
function runSort(id: string, input: number[]) {
  const a = [...input], steps: any[] = [];
  let comp = 0, swap = 0;
  const st = (compared: [number,number], swapped: [number,number], sorted: number[]) =>
    steps.push({ array: [...a], compared, swapped, sorted: [...sorted], comparisons: comp, swaps: swap });

  if (id === 'bubble') {
    const sorted: number[] = [];
    for (let i = 0; i < a.length - 1; i++) {
      let f = false;
      for (let j = 0; j < a.length - 1 - i; j++) { comp++; st([j, j+1], [-1,-1], sorted); if (a[j] > a[j+1]) { [a[j], a[j+1]] = [a[j+1], a[j]]; swap++; f = true; st([j, j+1], [j, j+1], sorted); } }
      sorted.push(a.length - 1 - i);
      if (!f) { for (let k = a.length - 2 - i; k >= 0; k--) sorted.push(k); break; }
    }
  } else if (id === 'selection') {
    const sorted: number[] = [];
    for (let i = 0; i < a.length - 1; i++) {
      let m = i;
      for (let j = i + 1; j < a.length; j++) { comp++; st([m, j], [-1,-1], sorted); if (a[j] < a[m]) m = j; }
      if (m !== i) { [a[i], a[m]] = [a[m], a[i]]; swap++; st([i, m], [i, m], sorted); }
      sorted.push(i);
    }
    sorted.push(a.length - 1);
  } else if (id === 'insertion') {
    const sorted = [0];
    for (let i = 1; i < a.length; i++) {
      const key = a[i]; let j = i - 1;
      while (j >= 0) { comp++; st([j, j+1], [-1,-1], sorted); if (a[j] > key) { a[j+1] = a[j]; swap++; st([j, j+1], [j, j+1], sorted); j--; } else break; }
      a[j+1] = key; sorted.push(i);
    }
  } else if (id === 'quick') {
    const sorted = new Set<number>();
    function part(lo: number, hi: number): number {
      const pivot = a[hi]; let i = lo - 1;
      for (let j = lo; j < hi; j++) { comp++; st([j, hi], [-1,-1], [...sorted]); if (a[j] < pivot) { i++; [a[i], a[j]] = [a[j], a[i]]; swap++; st([i, j], [i, j], [...sorted]); } }
      [a[i+1], a[hi]] = [a[hi], a[i+1]]; if (i+1 !== hi) { swap++; st([i+1, hi], [i+1, hi], [...sorted]); }
      sorted.add(i+1); return i+1;
    }
    function qs(lo: number, hi: number) { if (lo >= hi) { sorted.add(lo); return; } const pi = part(lo, hi); if (pi-1>lo) qs(lo, pi-1); else sorted.add(lo); if (pi+1<hi) qs(pi+1, hi); else sorted.add(hi); }
    qs(0, a.length - 1);
  } else if (id === 'merge') {
    const aux = [...a], sorted = new Set<number>();
    function merge(lo: number, mid: number, hi: number) {
      for (let k = lo; k <= hi; k++) aux[k] = a[k];
      let i = lo, j = mid + 1;
      for (let k = lo; k <= hi; k++) {
        if (i > mid) { a[k] = aux[j++]; swap++; }
        else if (j > hi) { a[k] = aux[i++]; swap++; }
        else { comp++; st([i, j], [-1,-1], [...sorted]); if (aux[i] <= aux[j]) { a[k] = aux[i++]; } else { a[k] = aux[j++]; } swap++; st([i-1, j-1], [-1, k], [...sorted]); }
      }
    }
    function ms(lo: number, hi: number) { if (lo >= hi) { sorted.add(lo); return; } const mid = Math.floor((lo + hi) / 2); ms(lo, mid); ms(mid + 1, hi); merge(lo, mid, hi); if (lo === 0 && hi === a.length - 1) for (let i = 0; i < a.length; i++) sorted.add(i); }
    ms(0, a.length - 1);
  }
  return { steps, comparisons: comp, swaps: swap };
}

// ═══════════ Express ═══════════
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(authMw);

function ok(data?: any, msg = 'success') { return { code: 200, message: msg, data: data ?? null }; }
function err(msg: string, code = 400) { return { code, message: msg }; }

// Auth
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (!username) return res.json(err('用户名不能为空'));
  if (!password || password.length < 6) return res.json(err('密码长度不能少于6位'));
  const users = readDB('users');
  if (users.find((u: any) => u.username === username)) return res.json(err('用户名已存在'));
  const user = { id: nextId('users'), username, password: bcrypt.hashSync(password, 10), email: username + '@example.com', avatar: '', createdAt: new Date().toISOString() };
  users.push(user); writeDB('users', users);
  res.json(ok({ token: signToken(user), user: { id: user.id, username: user.username, avatar: user.avatar } }, '注册成功'));
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username) return res.json(err('用户名不能为空'));
  if (!password) return res.json(err('密码不能为空'));
  const user = readDB('users').find((u: any) => u.username === username);
  if (!user) return res.json(err('用户名不存在'));
  if (!bcrypt.compareSync(password, user.password)) return res.json(err('密码错误'));
  res.json(ok({ token: signToken(user), user: { id: user.id, username: user.username, avatar: user.avatar } }, '登录成功'));
});

// Algorithms
app.get('/api/algorithms', (_req, res) => res.json(ok(algorithms)));

app.post('/api/sort/:id', (req, res) => {
  const { array } = req.body;
  if (!array || !Array.isArray(array)) return res.json(err('array required'));
  const start = Date.now();
  const result = runSort(req.params.id, array);
  const elapsed = Date.now() - start;
  const history = readDB('execution_history');
  history.push({ id: nextId('execution_history'), algorithmId: req.params.id, inputSize: array.length, comparisons: result.comparisons, swaps: result.swaps, timeMs: elapsed, createdAt: new Date().toISOString() });
  writeDB('execution_history', history);
  res.json(ok({ algorithm: req.params.id, steps: result.steps, stats: { comparisons: result.comparisons, swaps: result.swaps, timeMs: elapsed } }));
});

app.get('/api/sort/history', (_req, res) => res.json(ok(readDB('execution_history'))));

// User data (history/favorites/notes/progress)
app.get('/api/history', (req: any, res) => {
  if (!req.userId) return res.json(ok(null));
  res.json(ok(readDB('history').filter((h: any) => h.userId === req.userId).reverse()));
});
app.post('/api/history', (req: any, res) => {
  if (!req.userId) return res.json(ok({ saved: false }));
  const h = readDB('history');
  h.push({ id: nextId('history'), userId: req.userId, structure: req.body.structure, operation: req.body.operation, createdAt: new Date().toISOString() });
  writeDB('history', h);
  res.json(ok({ saved: true }));
});

app.get('/api/favorites', (req: any, res) => {
  if (!req.userId) return res.json(ok(null));
  res.json(ok(readDB('favorites').filter((f: any) => f.userId === req.userId).reverse()));
});
app.post('/api/favorites', (req: any, res) => {
  if (!req.userId) return res.json(ok({ saved: false }));
  const list = readDB('favorites');
  const idx = list.findIndex((f: any) => f.userId === req.userId && f.structure === req.body.structure);
  if (idx >= 0) { list.splice(idx, 1); writeDB('favorites', list); return res.json(ok({ saved: true, favorited: false })); }
  list.push({ id: nextId('favorites'), userId: req.userId, structure: req.body.structure, createdAt: new Date().toISOString() });
  writeDB('favorites', list);
  res.json(ok({ saved: true, favorited: true }));
});

app.get('/api/notes', (req: any, res) => {
  if (!req.userId) return res.json(ok(null));
  res.json(ok(readDB('notes').filter((n: any) => n.userId === req.userId).reverse()));
});
app.post('/api/notes', (req: any, res) => {
  if (!req.userId) return res.json(ok({ saved: false }));
  const n = readDB('notes');
  const note = { id: nextId('notes'), userId: req.userId, content: req.body.content, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  n.push(note); writeDB('notes', n);
  res.json(ok({ saved: true, id: note.id }));
});

app.get('/api/progress', (req: any, res) => {
  if (!req.userId) return res.json(ok(null));
  res.json(ok(readDB('learning_progress').filter((p: any) => p.userId === req.userId).reverse()));
});
app.post('/api/progress', (req: any, res) => {
  if (!req.userId) return res.json(ok({ saved: false }));
  const p = readDB('learning_progress');
  p.push({ id: nextId('learning_progress'), userId: req.userId, algorithmId: req.body.algorithmId, completedSteps: req.body.steps || 0, score: req.body.score || 100, finishedAt: new Date().toISOString() });
  writeDB('learning_progress', p);
  res.json(ok({ saved: true }));
});

const PORT = process.env.PORT || 8080;
app.listen(Number(PORT), () => console.log(`Backend running on port ${PORT}`));
