// Servicio de autenticación: login con JWT.
// Un JWT (JSON Web Token) es un "pase" firmado que el servidor entrega al iniciar
// sesión. El cliente lo envía en cada petición y el servidor verifica la firma,
// así no hay que mandar usuario y contraseña cada vez.
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { jwtSecret } = require('../config/dotenv');
const { Usuario, Rol, Permiso } = require('../models/asociaciones');

const loginUser = async (email, password) => {
  // 1. Verificar si el usuario existe.
  //    unscoped() se usa para que SÍ traiga la contraseña: el modelo la oculta
  //    por defecto, pero aquí la necesitamos para compararla.
  const user = await Usuario.unscoped().findOne({
    where: { email },
    include: [{
      model: Rol,
      as: 'rol',
      include: [{ model: Permiso, as: 'permisos', through: { attributes: [] } }],
    }],
  });

  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // 2. Comparar la contraseña recibida con la contraseña hasheada de la base de datos.
  //    bcrypt.compare vuelve a hashear la contraseña enviada y compara los resultados.
  const passwordValida = await bcrypt.compare(password, user.password);
  if (!passwordValida) {
    throw new Error('Contraseña incorrecta');
  }

  // 3. Armar la lista de permisos del rol (crear, visualizar, actualizar, eliminar)
  const permisos = user.rol ? user.rol.permisos.map((p) => p.nombre) : [];

  // 4. Generar el token. El "payload" son los datos que viajan dentro del token.
  //    NUNCA se mete la contraseña ahí: el token se puede leer, solo no se puede falsificar.
  const token = jwt.sign(
    { id: user.id, email: user.email, rol_id: user.rol_id, permisos },
    jwtSecret,
    { expiresIn: '2h' }, // el token caduca en 2 horas
  );

  return {
    token,
    usuario: {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      rol: user.rol ? user.rol.nombre : null,
      permisos,
    },
  };
};

// Verifica un token y devuelve su contenido. La usa el middleware.
const verificarToken = (token) => jwt.verify(token, jwtSecret);

module.exports = { loginUser, verificarToken };
