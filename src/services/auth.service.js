// Servicio de autenticación: login con JWT.
// Un JWT (JSON Web Token) es un "pase" firmado que el servidor entrega al iniciar
// sesión. El cliente lo envía en cada petición y el servidor verifica la firma,
// así no hay que mandar usuario y contraseña cada vez.
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret } = require('../config/dotenv');
const Usuario = require('../models/usuario.model');
const RolPermiso = require('../models/rol_permiso.model');

const loginUser = async (email, password) => {
  try {
    // Verificar si el usuario existe.
    // unscoped() hace que SÍ traiga la contraseña: el modelo la oculta por
    // defecto, pero aquí la necesitamos para compararla.
    const user = await Usuario.unscoped().findOne({ where: { email } });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar si la contraseña es correcta.
    // bcrypt.compare vuelve a hashear la contraseña recibida y compara resultados.
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    // Consultar los permisos del rol en la tabla roles_permisos
    const rolePermissions = await RolPermiso.findAll({
      where: { rol_id: user.rol_id },
      attributes: ['permiso_id'],
    });

    const permisos = rolePermissions.map((rp) => rp.permiso_id);

    // Generar un token JWT.
    // El "payload" son los datos que viajan dentro del token.
    // NUNCA se mete la contraseña: el token se puede leer, solo no se puede falsificar.
    const token = jwt.sign(
      { id: user.id, nombre: user.nombre, email: user.email, rol_id: user.rol_id, permisos },
      jwtSecret,
      { expiresIn: '1h' },
    );

    return token;
  } catch (error) {
    throw new Error(error.message || 'Error al iniciar sesión');
  }
};

// Verifica un token y devuelve su contenido. La usa el middleware.
const verificarToken = (token) => jwt.verify(token, jwtSecret);

module.exports = { loginUser, verificarToken };
