const jwt = require('jsonwebtoken');

module.exports = {
  createJWTToken: (payload) => {
    return jwt.sign(payload, 'kunciKU', {
      expiresIn: '12h',
    });
  },
};
