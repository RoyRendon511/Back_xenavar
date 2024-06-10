import express from "express";
import morgan from "morgan";
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import cookieParser from "cookie-parser";
import productoRoutes from './routes/productos.routes.js';

const app = express();

app.use(cors({ 
    origin: process.env.FRONTEND_URL, // Cambiar esto a la URL de tu frontend en producción
    credentials: true 
})); 
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use("/api", authRoutes);
app.use("/api", productoRoutes);
app.use((req, res) => {
    res.status(404).json({ status: false, message: "Ruta no encontrada" });
});

export default app;
