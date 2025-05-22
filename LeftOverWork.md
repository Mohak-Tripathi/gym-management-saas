model Trainer {
  id              String       @id @default(uuid())
  fullName        String
  specialization  String
  experienceYears Int
  phone           String
  email           String       @unique
  trainees        Trainee[]
  workoutPlans    WorkoutPlan[]
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
}


model Membership {
  id           String     @id @default(uuid())
  name         String
  price        Decimal
  duration     Int        // in months
  benefits     String[]
  trainees     Trainee[]
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}





model Payment {
  id               String     @id @default(uuid())
  amountPaid       Decimal    // Amount actually paid in this transaction
  totalAmountDue   Decimal    // Total cost of membership/item
  paymentDate      DateTime   @default(now())
  nextPaymentDate  DateTime?  // When the next part of payment is due
  mode             PaymentMode
  note             String?    // Optional remarks

  // Who made the payment (via Trainee → User)
  traineeId        String
  trainee          Trainee    @relation(fields: [traineeId], references: [id])

  // If this payment was for a specific membership
  traineeMembershipId String?
  traineeMembership   TraineeMembership? @relation(fields: [traineeMembershipId], references: [id])

  // Tenant scoping
  gymId            String
  gym              Gym        @relation(fields: [gymId], references: [id])
  gymBranchId      String?
  gymBranch        GymBranch? @relation(fields: [gymBranchId], references: [id])

  createdAt        DateTime   @default(now())
  updatedAt        DateTime   @updatedAt

  @@index([traineeId])
  @@index([gymId])
  @@index([gymBranchId])
}



model Payment {
  id             String     @id @default(uuid())
  trainee        Trainee    @relation(fields: [traineeId], references: [id])
  traineeId      String
  amount         Decimal
  paymentDate    DateTime
  paymentMethod  PaymentMethod
  transactionId  String?
  status         PaymentStatus
  // Tenant scoping
  gymId          String
  gym            Gym        @relation(fields: [gymId], references: [id])
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  
  // Branch scoping (secondary)
  gymBranchId     String
  gymBranch       GymBranch @relation(fields: [gymBranchId], references: [id])
  @@index([gymId])
}



//model Admin {
  //id          String   @id @default(uuid())
  //username    String   @unique
  //email       String   @unique
  //password    String
  //role        AdminRole
  //posts  CommunityPost[]
  //notifications  Notification[]
  //createdAt   DateTime @default(now())
//}




