import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import traineeRoutes from './routes/trainee.routes';
import membershipRoutes from "./routes/memebership.routes";
import trainerRoutes from "./routes/trainer.routes";
import traineemembershipRoutes from "./routes/traineemembership.routes"
import communityPostRoutes from "./routes/communityPost.route"
import gymRoutes from "./routes/gym.routes"
import gymBranchRoutes from "./routes/gymBranch.routes"
import userRoutes from "./routes/user.routes"
import passwordRoute from "./routes/passwordReset.routes"


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



// 🔥 Add CORS middleware here
// app.use(cors({
//   origin: "http://localhost:3000", // frontend origin
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));


app.use(cors({
  origin: 'http://localhost:3000', // frontend origin
  // origin: '*', // frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // if you're sending cookies
}));


// app.options('*', cors()); // allow preflight across the app


app.use(express.json());



// Example
app.use("/api/trainers", trainerRoutes);
// Mount customer routes
app.use('/api/trainees', traineeRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/trainee-memberships", traineemembershipRoutes);
app.use("/api/community-post", communityPostRoutes);
app.use("/api/gym", gymRoutes)
app.use("/api/gym-branch", gymBranchRoutes)
app.use("/api/auth", userRoutes)
app.use("/api/password", passwordRoute)

// Start the server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
