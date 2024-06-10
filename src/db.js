import 'dotenv/config';
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000, // Incrementado a 20 segundos
      socketTimeoutMS: 45000, // Tiempo de espera de socket
    });

    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB Cluster');
    });

    mongoose.connection.on('error', (err) => {
      console.log('Mongoose connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose Disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });

    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.log("Could not connect to MongoDB Atlas: ", error.message);
  }
};
