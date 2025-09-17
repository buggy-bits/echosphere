import cors from "cors";

const corsOptions: cors.CorsOptions = {
  origin: ["*"], // Add your frontend URLs here
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // Allow cookies if needed
};

export default cors(corsOptions);
