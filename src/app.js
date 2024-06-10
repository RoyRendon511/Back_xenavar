import express from "express";
import morgan from "morgan";
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import cookieParser from "cookie-parser";
import productoRoutes from './routes/productos.routes.js';
import mongoose from "mongoose";

const conexion = process.env.DB_DATABASE
mongoose.connect(conexion).then()

const app = express();
app.use(cors({ 
    origin: 'http://localhost:5174',
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
