import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { runSortEngine } from '../engines/sorting.js';

export const algoRouter = Router();
const db = new PrismaClient();

algoRouter.get('/algorithms', async (_req, res) => {
  const list = await db.algorithm.findMany();
  res.json({ code: 200, message: 'success', data: list });
});

algoRouter.post('/sort/:id', async (req, res) => {
  const { id } = req.params;
  const { array } = req.body;
  if (!array || !Array.isArray(array)) return res.json({ code: 400, message: 'array required' });

  const start = Date.now();
  const steps = runSortEngine(id, array);
  const elapsed = Date.now() - start;

  const last = steps[steps.length - 1];
  await db.executionHistory.create({
    data: { algorithmId: id, inputSize: array.length, comparisons: last.comparisons, swaps: last.swaps, timeMs: elapsed },
  });

  res.json({ code: 200, message: 'success', data: { algorithm: id, steps, stats: { comparisons: last.comparisons, swaps: last.swaps, timeMs: elapsed } } });
});

algoRouter.get('/sort/history', async (_req, res) => {
  const list = await db.executionHistory.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ code: 200, message: 'success', data: list });
});
