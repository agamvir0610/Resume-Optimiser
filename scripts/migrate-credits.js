const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateCredits() {
  try {
    console.log('Starting credit migration...');
    
    // Get all users
    const users = await prisma.user.findMany({
      include: {
        credits: true
      }
    });

    console.log(`Found ${users.length} users`);

    for (const user of users) {
      // Check if user already has credits
      const existingCredits = await prisma.credit.findMany({
        where: { userId: user.id }
      });

      if (existingCredits.length === 0) {
        // Add 10 free credits for users without any credits
        await prisma.credit.create({
          data: {
            userId: user.id,
            amount: 10,
            type: 'bonus'
          }
        });
        console.log(`Added 10 credits to user ${user.email}`);
      } else {
        console.log(`User ${user.email} already has credits`);
      }
    }

    console.log('Credit migration completed!');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateCredits();
