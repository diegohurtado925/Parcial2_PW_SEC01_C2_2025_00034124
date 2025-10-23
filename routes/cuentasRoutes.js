import express from 'express';
import {
    handleGetCuentas as listarCuentas,
    getCuentaById as obtenerCuentaPorId,
    getTotalBalance as obtenerBalanceTotal
} from '../controllers/cuentasController.js';

const router = express.Router();

// listado de cuentas
router.route('/cuentas').get(listarCuentas);

// detalle por id
router.route('/cuenta/:id').get(obtenerCuentaPorId);

// balance total
router.get('/cuentasBalance', obtenerBalanceTotal);

export default router;