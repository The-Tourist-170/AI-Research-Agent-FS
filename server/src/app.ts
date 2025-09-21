import './service/worker'; 
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import express from 'express';
import cors from 'cors';
import { initDb } from './db/initDb';
import apiRoutes from './routes/routes';


initDb().catch(err => console.error('Error initializing DB on startup:', err));

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: process.env.ALLOWED_ORIGIN }));
app.use(express.json());

app.use('/', apiRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});