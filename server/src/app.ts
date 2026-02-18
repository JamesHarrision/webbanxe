import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import adminRoutes from "./routes/admin.routes";
import carRoutes from "./routes/car.routes";
import uploadRoutes from "./routes/upload.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6868;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/cars', carRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running smoothly' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});

export default app;