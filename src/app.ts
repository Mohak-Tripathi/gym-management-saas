import express from 'express';
import dotenv from 'dotenv';
import customerRoutes from './routes/customer.route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Mount customer routes
app.use('/api/customers', customerRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
