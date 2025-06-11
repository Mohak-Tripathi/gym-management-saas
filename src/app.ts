import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import traineeRoutes from './routes/trainee.routes';
import membershipRoutes from "./routes/memebership.routes";
import trainerRoutes from "./routes/trainer.routes";
import traineemembershipRoutes from "./routes/traineemembership.routes";
import communityPostRoutes from "./routes/communityPost.route";
import gymRoutes from "./routes/gym.routes";
import gymBranchRoutes from "./routes/gymBranch.routes";
import userRoutes from "./routes/user.routes";
import passwordRoute from "./routes/passwordReset.routes";
import crmLeads from "./routes/crmLead.route";
import equipmentsRoute from "./routes/equipment.routes"
import maintenanceSchedule from "./routes/maintenanceSchedule.routes"
import feedbackRoutes from "./routes/feedback.route"
import complaintRotes from "./routes/complaint.route"
import attendanceRoutes from "./routes/attendence.route"
import { globalRateLimiter } from './middlewares/rateLimiter';
import qrRoutes from "./routes/qr.routes"
import paymentRoutes from "./routes/payment.route"
import invoiceRoutes from "./routes/invoice.routes"
import productCategoryRoutes from "./routes/productCategory.routes"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



// 🔥 Add CORS middleware here
// app.use(cors({
//   origin: "http://localhost:3000", // frontend origin
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));


// app.use(cors({
//   origin: 'http://localhost:3000', 'https://gym-management-saas-frontend-lcle.vercel.app', 
//   // origin: '*', // frontend origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true // if you're sending cookies
// }));


const allowedOrigins = [
  'http://localhost:3000',
  'https://gym-management-saas-frontend-lcle.vercel.app'
];

app.use(cors({
  origin: function (origin:any, callback:any) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));




// app.options('*', cors()); // allow preflight across the app


app.use(express.json());
app.use(globalRateLimiter); 


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
app.use("/api/crm-lead", crmLeads)
app.use("/api/gym-equipments", equipmentsRoute)
app.use("/api/maintenance-schedule",maintenanceSchedule)
app.use("/api/feedback", feedbackRoutes)
app.use("/api/complaint", complaintRotes)
// Mount route under `/api/attendance`
app.use('/api/attendance', attendanceRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/payment', paymentRoutes);
app.use("/api/invoice", invoiceRoutes)
app.use("/api/product-categories", productCategoryRoutes)

// Start the server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
