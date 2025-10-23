import express from 'express';
import apiRoutes from './routes/cuentasRoutes.js';

const appServer = express();
const PORT = process.env.PORT || 3130;

appServer.use(express.json());

appServer.use('/', apiRoutes);

appServer.listen(PORT, () => {
    console.log('Server running at http://localhost:' + PORT);
});