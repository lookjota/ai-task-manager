import "dotenv/config";
import { PrismaClient } from '~/generated/prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { fakeUser, fakePost, fakeTask } from './fake';

const databaseUrl = process.env.TURSO_DATABASE_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

if (!databaseUrl || !authToken) {
  throw new Error("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set");
}

const adapter = new PrismaLibSQL({
  url: databaseUrl,
  authToken: authToken,
});

const prisma = new PrismaClient({ adapter });

async function main() {


  console.log("🌱 Starting seed...");

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  await prisma.task.deleteMany();

  // Create 20 users
  console.log("👥 Creating 20 users...");
  const users = [];
  for (let i = 0; i < 20; i++) {
    const userData = fakeUser();
    const user = await prisma.user.create({
      data: userData,
    });
    users.push(user);
    console.log(`  ✓ Created user ${i + 1}/20: ${user.email}`);
  }

  // Create 60 posts (3 posts per user)
  console.log("\n📝 Creating 60 posts...");
  for (let i = 0; i < 60; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const postData = fakePost(randomUser.id);
    const post = await prisma.post.create({
      data: postData,
    });
    if ((i + 1) % 10 === 0) {
      console.log(`  ✓ Created post ${i + 1}/60`);
    }
  }

  // Create 10 tasks and associate with random users
  console.log("\n📋 Creating 10 tasks...");
  for (let i = 0; i < 10; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const taskData = fakeTask(randomUser.id);
    const task = await prisma.task.create({
      data: taskData,
    });
    console.log(`  ✓ Created task ${i + 1}/10: ${task.title}`);
  }

  console.log("\n✅ Seed completed successfully!");
  console.log(`   - Created ${users.length} users`);
  console.log(`   - Created 60 posts`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

