import express from 'express';
import { userappRouter } from './src/userapp/userapp.routes';
import { adminRouter } from './src/admin/admin.routes';
import { ownerRouter } from './src/owner/owner.routes';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Rutas actualizadas
app.use('/api/userapp', userappRouter);
app.use('/api/admin', adminRouter);
app.use('/api/owner', ownerRouter);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000/')
})