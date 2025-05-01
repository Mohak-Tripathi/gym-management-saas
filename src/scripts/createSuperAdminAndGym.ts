import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createSuperAdminAndGym() {
  // Gym & Branch details
  // const gymName = 'Iron Paradise';
  const gymName = 'Muscle Tech';
//   const branchName = 'Main Branch';
//   const branchAddress = 'Connaught Place, Delhi';

  // SuperAdmin details
  // const adminName = 'Rohit Sharma';
  // const adminEmail = 'rohit@ironparadise.com';
  // const adminPassword = 'supersecurepassword';

  const adminName = 'Virat Kohli';
  const adminEmail = 'virat@muscletech.com';
  const adminPassword = 'supersecurepassword';

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const result = await prisma.$transaction(async (tx:any) => {
    // 1. Create Gym
    const gym = await tx.gym.create({
      data: {
        name: gymName,
      },
    });

    // 2. Create Main Branch
    // const branch = await tx.gymBranch.create({
    //   data: {
    //     name: branchName,
    //     address: branchAddress,
    //     gymId: gym.id,
    //   },
    // });

    // 3. Create SuperAdmin (User) scoped to gym (but NOT gymBranch)
    const superAdmin = await tx.user.create({
      data: {
        fullName: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'SUPERADMIN',
        gymId: gym.id,
        // No gymBranchId for superadmin
      },
    });

    return { gym, superAdmin };
  });

  console.log('✅ Successfully created Gym + Branch + SuperAdmin');
  console.log(result);
}

createSuperAdminAndGym()
  .catch((error) => {
    console.error('❌ Error creating SuperAdmin & Gym:', error);
  })
  .finally(() => prisma.$disconnect());
