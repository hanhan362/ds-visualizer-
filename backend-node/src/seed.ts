import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();

async function main() {
  console.log('🌱 开始插入种子数据...\n');

  // 算法数据
  const algorithms = [
    { id: 'bubble',    name: 'Bubble Sort',    timeComplexity: 'O(n^2)',     spaceComplexity: 'O(1)',     stable: true  },
    { id: 'selection', name: 'Selection Sort', timeComplexity: 'O(n^2)',     spaceComplexity: 'O(1)',     stable: false },
    { id: 'insertion', name: 'Insertion Sort', timeComplexity: 'O(n^2)',     spaceComplexity: 'O(1)',     stable: true  },
    { id: 'quick',     name: 'Quick Sort',     timeComplexity: 'O(n log n)', spaceComplexity: 'O(log n)', stable: false },
    { id: 'merge',     name: 'Merge Sort',     timeComplexity: 'O(n log n)', spaceComplexity: 'O(n)',     stable: true  },
  ];

  for (const algo of algorithms) {
    await db.algorithm.upsert({
      where: { id: algo.id },
      update: {},
      create: algo,
    });
    console.log(`  ✅ ${algo.id} → ${algo.name}`);
  }

  // 测试用户
  const pwd = bcrypt.hashSync('123456', 10);
  const user = await db.user.upsert({
    where: { username: 'demo' },
    update: {},
    create: { username: 'demo', password: pwd, email: 'demo@example.com' },
  });
  console.log(`\n  👤 测试用户: demo / 123456  (id=${user.id})`);

  // 一条测试执行记录
  await db.executionHistory.create({
    data: { algorithmId: 'bubble', inputSize: 10, comparisons: 45, swaps: 23, timeMs: 12 },
  });
  console.log('  📊 插入了一条测试执行记录');

  console.log('\n🎉 种子数据插入完成！');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
