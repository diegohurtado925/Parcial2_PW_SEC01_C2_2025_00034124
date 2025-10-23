import { cuentas } from '../data/cuentas.js';

const parseBalance = (balanceStr) => {

  const raw = String(balanceStr || '').replace(/[$,]/g, '');
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
};

export const handleGetCuentas = (req, res) => {
  const query = req.query || {};
  const hasQuery = Object.keys(query).length > 0;

  if (!hasQuery) {
    return res.json({
      count: cuentas.length,
      data: cuentas
    });
  }

  const { _id: qId, client: qClient, gender: qGender, isActive, balance: qBalance } = query;
  console.log('Query recibida:', { qId, qClient, qGender, isActive, qBalance });
  let resultados = [];

  if (qId) {
    resultados = cuentas.filter(acc => acc._id === qId);
  } else if (qClient) {
    const needle = qClient.toLowerCase();
    resultados = cuentas.filter(acc => String(acc.client || '').toLowerCase().includes(needle));
  } else if (qGender) {
    const g = qGender.toLowerCase();
    resultados = cuentas.filter(acc => String(acc.gender || '').toLowerCase() === g);
  } else if (isActive) {
    const isActiveBool = (isActive === 'true');
    console.log('Filtrando por isActive:', isActiveBool);
    resultados = cuentas.filter(c => c.isActive === isActiveBool);
  } else if (qBalance) {
    console.log('Filtrando por balance:', qBalance);

    if (qBalance.includes(':')) {
      const [operator, value] = qBalance.split(':');
      const balanceValue = parseFloat(value);
      resultados = cuentas.filter(acc => {
        const accBalance = parseBalance(acc.balance);
 
        return false;
      });
    } else {
      // Si no hay operador, busca exacto
      const targetBalance = parseFloat(qBalance);
      resultados = cuentas.filter(acc => parseBalance(acc.balance) === targetBalance);
    }
  } else {
    return res.status(400).json({ finded: false, message: 'Consulta no válida' });
  }

  if (resultados.length === 0) {
    return res.json({ finded: false });
  }

  if (resultados.length === 1) {
    return res.json({ finded: true, account: resultados[0] });
  }

  return res.json({ finded: true, data: resultados });
};

export const getCuentaById = (req, res) => {
  const { id } = req.params;
  const cuenta = cuentas.find(acc => acc._id === id);

  if (!cuenta) {
    return res.status(404).json({ finded: false });
  }

  res.json({ finded: true, account: cuenta });
};

export const getTotalBalance = (req, res) => {
  const activas = cuentas.filter(acc => acc.isActive === true);

  if (activas.length === 0) {
    return res.json({ status: false, accountBalance: 0 });
  }

  const total = activas.reduce((sum, acc) => sum + parseBalance(acc.balance), 0);

  res.json({ status: true, accountBalance: total });
};
