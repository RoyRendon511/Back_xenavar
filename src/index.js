import 'dotenv/config';  // Esto carga las variables de entorno automáticamente

import app from './app.js';
import { connectDB } from './db.js';

connectDB();

app.listen(process.env.PORT || 4000, () => {
  console.log('Server on port', process.env.PORT || 4000);
});
