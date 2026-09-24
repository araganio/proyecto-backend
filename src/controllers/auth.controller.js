// Controlador de autenticación: recibe el login y devuelve el token.
const AuthService = require('../services/auth.service');

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email y password son obligatorios' });
    }

    const resultado = await AuthService.loginUser(email, password);
    res.status(200).json(resultado);
  } catch (error) {
    // 401 Unauthorized: credenciales incorrectas.
    // Se responde el mismo mensaje en ambos casos para no revelar
    // si un correo está registrado o no.
    if (error.message === 'Usuario no encontrado' || error.message === 'Contraseña incorrecta') {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }
    next(error);
  }
};

module.exports = { login };
