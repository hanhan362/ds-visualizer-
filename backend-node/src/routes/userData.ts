import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { auth, requireAuth, AuthRequest } from '../middleware/auth.js';

export const userDataRouter = Router();
const db = new PrismaClient();
userDataRouter.use(auth);

// History
userDataRouter.get('/history', requireAuth, async (req: AuthRequest, res) => {
  const list = await db.history.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'desc' } });
  res.json({ code: 200, message: 'success', data: list });
});

userDataRouter.post('/history', requireAuth, async (req: AuthRequest, res) => {
  const { structure, operation } = req.body;
  await db.history.create({ data: { userId: req.userId!, structure, operation } });
  res.json({ code: 200, message: 'success', data: { saved: true } });
});

// Favorites
userDataRouter.get('/favorites', requireAuth, async (req: AuthRequest, res) => {
  const list = await db.favorite.findMany({ where: { userId: req.userId }, orderBy: { createdAt: 'desc' } });
  res.json({ code: 200, message: 'success', data: list });
});

userDataRouter.post('/favorites', requireAuth, async (req: AuthRequest, res) => {
  const { structure } = req.body;
  const exist = await db.favorite.findFirst({ where: { userId: req.userId!, structure } });
  if (exist) {
    await db.favorite.delete({ where: { id: exist.id } });
    res.json({ code: 200, message: 'success', data: { saved: true, favorited: false } });
  } else {
    await db.favorite.create({ data: { userId: req.userId!, structure } });
    res.json({ code: 200, message: 'success', data: { saved: true, favorited: true } });
  }
});

// Notes
userDataRouter.get('/notes', requireAuth, async (req: AuthRequest, res) => {
  const list = await db.note.findMany({ where: { userId: req.userId }, orderBy: { updatedAt: 'desc' } });
  res.json({ code: 200, message: 'success', data: list });
});

userDataRouter.post('/notes', requireAuth, async (req: AuthRequest, res) => {
  const { content } = req.body;
  const note = await db.note.create({ data: { userId: req.userId!, content } });
  res.json({ code: 200, message: 'success', data: { saved: true, id: note.id } });
});

// Progress
userDataRouter.get('/progress', requireAuth, async (req: AuthRequest, res) => {
  const list = await db.learningProgress.findMany({ where: { userId: req.userId }, orderBy: { finishedAt: 'desc' } });
  res.json({ code: 200, message: 'success', data: list });
});

userDataRouter.post('/progress', requireAuth, async (req: AuthRequest, res) => {
  const { algorithmId, steps, score } = req.body;
  await db.learningProgress.create({ data: { userId: req.userId!, algorithmId, completedSteps: steps, score: score || 100 } });
  res.json({ code: 200, message: 'success', data: { saved: true } });
});
