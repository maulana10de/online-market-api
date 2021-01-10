const jwt = require('jsonwebtoken');

module.exports = {
  readToken: (req, res, next) => {
    jwt.verify(req.token, 'kunciKU', (err, decoded) => {
      if (err) {
        return res.status(401).send('User Not Authorization');
      }
      req.user = decoded;

      // console.log(req.user);

      next();
    });
  },
};
