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





