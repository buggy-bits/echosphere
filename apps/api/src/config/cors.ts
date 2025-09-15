import cors from "cors";

const corsOptions: cors.CorsOptions = {
  origin: ["http://localhost:3000"], // Add your frontend URLs here
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allow cookies if needed
};

export default cors(corsOptions);
