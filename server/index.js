// index.js
import express from 'express';
import 'dotenv/config';
import morgan from 'morgan';
import cors from 'cors';

// Importación de rutas
import indexRoutes from './routes/index.routes.js';
import itemsRoutes from './routes/items.routes.js';     // Rutas que usan PostgreSQL
import items2Routes from './routes/items2.routes.js';   // Rutas que usan MongoDB
import loginRoutes from './routes/login.routes.js';     // Puede usar Mongo o PG

// Conexión a MongoDB
import { connectDB } from './utils/mongodb.js';

// Conecta a MongoDB (no afecta PG)
connectDB();

// Inicializa Express
const app = express();

// Middlewares
app.use(cors({
  origin: "https://...",  // o ['https://...'] si quieres múltiples
  credentials: true,
  exposedHeaders: ["Authorization"],
}));
app.options('*', cors());

app.use(morgan('dev'));
app.use(express.json());
// Rutas
app.use(indexRoutes);
app.use(itemsRoutes);   // PostgreSQL
app.use(items2Routes);  // MongoDB
app.use(loginRoutes);   // Depende del caso

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
