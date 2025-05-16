// const express = require('express');
import 'dotenv/config';
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import indexRoutes from './routes/index.routes.js';
import itemsRoutes from './routes/items.routes.js';
import items2Routes from './routes/items2.routes.js';
import loginRoutes from './routes/login.routes.js';
import {connectDB} from './utils/mongodb.js';


const app = express();

connectDB();

app.use(cors())
app.use(morgan("dev"))
app.use(express.json());
app.use(indexRoutes);
app.use(itemsRoutes);
app.use(loginRoutes);
app.use(items2Routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// export default app;
