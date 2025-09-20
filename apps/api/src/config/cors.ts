import cors from 'cors';

const corsOptions: cors.CorsOptions = {
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:5173',
  ], // Add your frontend URLs here
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // Allow cookies if needed
};

export default cors(corsOptions);
