import express from "express";
import allRoutes from "./routes/index";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import corsMiddleware from "./config/cors";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
// Routes
app.use("/api/v1", allRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
