import cors from 'cors';

const corsOptions: cors.CorsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

export default cors(corsOptions);
