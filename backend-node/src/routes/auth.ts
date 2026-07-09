import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { signToken } from '../middleware/auth.js';

export const authRouter = Router();
const db = new PrismaClient();

authRouter.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username) return res.json({ code: 400, message: '用户名不能为空' });
  if (!password || password.length < 6) return res.json({ code: 400, message: '密码长度不能少于6位' });
  const exist = await db.user.findUnique({ where: { username } });
  if (exist) return res.json({ code: 400, message: '用户名已存在' });

  const user = await db.user.create({
    data: { username, password: bcrypt.hashSync(password, 10), email: username + '@example.com' },
  });
  const token = signToken(user.id, user.username);
  res.json({ code: 200, message: '注册成功', data: { token, user: { id: user.id, username: user.username, avatar: user.avatar || '' } } });
});

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username) return res.json({ code: 400, message: '用户名不能为空' });
  if (!password) return res.json({ code: 400, message: '密码不能为空' });

  const user = await db.user.findUnique({ where: { username } });
  if (!user) return res.json({ code: 400, message: '用户名不存在' });
  if (!bcrypt.compareSync(password, user.password)) return res.json({ code: 400, message: '密码错误' });

  const token = signToken(user.id, user.username);
  res.json({ code: 200, message: '登录成功', data: { token, user: { id: user.id, username: user.username, avatar: user.avatar || '' } } });
});
