import { PORT } from "./config/env";
import app from "./app";
import connectToDatabase from "./database/mongodb";

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectToDatabase();
});
