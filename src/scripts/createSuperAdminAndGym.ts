// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// async function createSuperAdminAndGym() {
//   // Gym & Branch details
//   const gymName = 'Iron Paradise';
//   // const gymName = 'Muscle Tech';
// //   const branchName = 'Main Branch';
// //   const branchAddress = 'Connaught Place, Delhi';

//   // SuperAdmin details
//   const adminName = 'Rohit Sharma';
//   const adminEmail = 'rohit@myironparadise.com';
//   const adminPassword = 'supersecurepassword';

//   // const adminName = 'Virat Kohli';
//   // const adminEmail = 'virat@muscletech.com';
//   // const adminPassword = 'supersecurepassword';

//   const hashedPassword = await bcrypt.hash(adminPassword, 10);

//   const result = await prisma.$transaction(async (tx:any) => {
//     // 1. Create Gym
//     const gym = await tx.gym.create({
//       data: {
//         name: gymName,
//       },
//     });

//     // 2. Create Main Branch
//     // const branch = await tx.gymBranch.create({
//     //   data: {
//     //     name: branchName,
//     //     address: branchAddress,
//     //     gymId: gym.id,
//     //   },
//     // });

//     // 3. Create SuperAdmin (User) scoped to gym (but NOT gymBranch)
//     const superAdmin = await tx.user.create({
//       data: {
//         fullName: adminName,
//         email: adminEmail,
//         password: hashedPassword,
//         role: 'SUPERADMIN',
//         gymId: gym.id,
//         // No gymBranchId for superadmin
//       },
//     });

//     return { gym, superAdmin };
//   });

//   console.log('✅ Successfully created Gym + Branch + SuperAdmin');
//   console.log(result);
// }

// createSuperAdminAndGym()
//   .catch((error) => {
//     console.error('❌ Error creating SuperAdmin & Gym:', error);
//   })
//   .finally(() => prisma.$disconnect());




// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';

// const prisma = new PrismaClient();

// async function createSuperAdminAndGym() {
//   // Gym details
//   const gymName = 'Golds Gym';

//   // SuperAdmin details
//   const adminName = 'Mohak Tripathi';
//   const adminEmail = 'mohaktripathi@mygoldsgym.com';
//   const adminPassword = 'supersecurepassword';

//   // Hash the password once
//   const hashedPassword = await bcrypt.hash(adminPassword, 10);

//   const result = await prisma.$transaction(async (tx: any) => {
//     // 1. Check if the Gym already exists by name
//     let gym = await tx.gym.findUnique({
//       where: { name: gymName },
//     });
    
//     if (!gym) {
//       gym = await tx.gym.create({
//         data: {
//           name: gymName,
//         },
//       });
//       console.log(`Created Gym: ${gymName}`);
//     } else {
//       console.log(`Gym "${gymName}" already exists.`);
//     }

//     // 2. Check if the SuperAdmin already exists by email
//     let superAdmin = await tx.user.findUnique({
//       where: { email: adminEmail },
//     });
//     if (!superAdmin) {
//       superAdmin = await tx.user.create({
//         data: {
//           fullName: adminName,
//           email: adminEmail,
//           password: hashedPassword,
//           role: 'SUPERADMIN',
//           gymId: gym.id, // Associate the SuperAdmin with the gym
//         },
//       });
//       console.log(`Created SuperAdmin with email: ${adminEmail}`);
//     } else {
//       console.log(`SuperAdmin with email "${adminEmail}" already exists.`);
//     }

//     return { gym, superAdmin };
//   });

//   console.log('✅ Successfully processed Gym and SuperAdmin creation:');
//   console.log(result);
// }

// createSuperAdminAndGym()
//   .catch((error) => {
//     console.error('❌ Error creating SuperAdmin & Gym:', error);
//   })
//   .finally(() => prisma.$disconnect());
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Get input values from CLI arguments
const [, , gymName, adminName, adminEmail, adminPassword, phone] = process.argv;

// Basic validation
if (!gymName || !adminName || !adminEmail || !adminPassword || !phone) {
  console.error(
    '❌ Missing arguments.\nUsage: ts-node createSuperAdminAndGym.ts <gymName> <adminName> <adminEmail> <adminPassword> <phone>'
  );
  process.exit(1);
}

async function createSuperAdminAndGym() {
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const result = await prisma.$transaction(async (tx) => {
    let gym = await tx.gym.findFirst({ where: { name: gymName } });

    if (!gym) {
      gym = await tx.gym.create({
        data: { name: gymName },
      });
      console.log(`✅ Created Gym: ${gymName}`);
    } else {
      console.log(`ℹ️ Gym "${gymName}" already exists.`);
    }

    let superAdmin = await tx.user.findUnique({ where: { email: adminEmail } });

    if (!superAdmin) {
      superAdmin = await tx.user.create({
        data: {
          fullName: adminName,
          email: adminEmail,
          password: hashedPassword,
          phone: phone,
          role: 'SUPERADMIN',
          gymId: gym.id,
        },
      });
      console.log(`✅ Created SuperAdmin: ${adminEmail}`);
    } else {
      console.log(`ℹ️ SuperAdmin "${adminEmail}" already exists.`);
    }

    return { gym, superAdmin };
  });

  console.log('🏁 Done:', result);
}

createSuperAdminAndGym()
  .catch((error) => {
    console.error('❌ Error creating SuperAdmin & Gym:', error);
  })
  .finally(() => prisma.$disconnect());
