const db = require('../database');
const { createJWTToken } = require('../helper/createToken');
const Crypto = require('crypto');
const transporter = require('../helper/nodemailer');

module.exports = {
  register: (req, res) => {
    // console.log('GET DATA REQUEST REGISTER :', req.body);
    let sqlInsert = `INSERT INTO tbusers SET ?`;

    let hashPassword = Crypto.createHmac('sha256', 'kuncitokoku')
      .update(req.body.password)
      .digest('hex');

    req.body.password = hashPassword;

    let karakter = `0123456789abcdefghijklmnopqrstuvwxyz`;
    let OTP = ``;
    for (let i = 0; i < 6; i++) {
      OTP += karakter.charAt(Math.floor(Math.random() * karakter.length));
    }

    req.body.status = OTP;

    // console.log(req.body);

    // console.log('Check Body Register ===>', req.body);

    db.query(sqlInsert, req.body, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      console.log(results);

      let sqlGet = `SELECT * FROM tbusers 
                    WHERE iduser = ${results.insertId}`;

      db.query(sqlGet, (err2, results2) => {
        if (err2) {
          console.log(err2);
          res.status(500).status(err2);
        }
        console.log('results2', results2);

        if (results2) {
          let { iduser, username, email, phone, role, status } = results2[0];
          let token = createJWTToken({
            iduser,
            username,
            email,
            phone,
            role,
            status,
          });

          console.log('====>', token);

          let mail = {
            from: 'Admin <maulana4de@gmail.com>',
            to: 'maulana10de@gmail.com', // bisa juga menggunakan email yang sedang mendaftar
            subject: `Confirm Register`,
            html: ` Your OTP : <h3>${OTP}</h3>
                      <a href='http://localhost:3000/verification/${token}'>Click Here !</a>`,
          };
          transporter.sendMail(mail, (errB, resB) => {
            if (errB) {
              console.log(errB);
              return res.status(500).send(errB);
            }
            res.status(200).send(results);
          });
        }
      });
    });
  },

  verification: (req, res) => {
    // console.log('verifikasi', req.user.iduser, req.body.otp);
    let sqlUpdate = `UPDATE tbusers
                     SET status = 'verified'
                     WHERE iduser=${req.user.iduser} 
                     AND status=${db.escape(req.body.otp)}`;

    db.query(sqlUpdate, (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }
      console.log(results);
      res.status(200).send(results);
    });
  },

  login: (req, res) => {
    // console.log(req.query);

    let hashPassword = Crypto.createHmac('sha256', 'kuncitokoku')
      .update(req.query.password)
      .digest('hex');
    // console.log(hashPassword);
    let sqlGet = `SELECT * 
                        FROM tbusers 
                        WHERE username = ${db.escape(req.query.username)} 
                        AND password = ${db.escape(hashPassword)} `;

    db.query(sqlGet, (err, results) => {
      if (err) res.status(500).send(err);
      // console.log(results);
      let { iduser, username, email, password, role } = results[0];
      let token = createJWTToken({ iduser, username, email, role });
      // console.log(token);
      res.status(200).send({
        dataLogin: { iduser, username, email, role, token },
        messages: 'Login Success',
      });
    });
  },
  keepLogin: (req, res) => {
    // res.status(200).send(req.user.iduser);
    console.log('===> keep login', req.user);

    // console.log('GET ID', req.user.iduser == 'null');
    let sqlGet = `SELECT *
                        FROM tbusers
                        WHERE iduser = ${req.user.iduser}`;

    if (req.user.iduser != 'null') {
      db.query(sqlGet, (err, results) => {
        if (err) res.status(500).send(err);

        let { iduser, username, email, password, role } = results[0];
        let token = createJWTToken({ iduser, username, email, role });
        res
          .status(200)
          .send({ dataKeepLogin: { iduser, username, email, role, token } });
      });
    }
  },
  addToCart: (req, res) => {
    console.log(req.body.cart);
    let sqlGet = `SELECT * FROM tbcart 
                  WHERE iduser = ${req.body.cart.iduser} 
                  AND idproduct = ${req.body.cart.idproduct} AND idstock = ${req.body.cart.idstock}`;

    let sqlInsert = `INSERT INTO tbcart SET ?`;

    db.query(sqlGet, (errGet, resultsGet) => {
      if (errGet) {
        console.log(errGet);
        res.status(500).send(errGet);
      }

      console.log('====>', resultsGet);
      if (resultsGet[0]) {
        let sqlUpdate = `UPDATE tbcart SET qty = ${
          req.body.cart.qty + resultsGet[0].qty
        }`;

        db.query(sqlUpdate, (errUpdate, resultsUpdate) => {
          if (errUpdate) res.status(500).send(errUpdate);
          res.status(200).send(resultsUpdate);
        });
      } else {
        db.query(sqlInsert, req.body.cart, (err, results) => {
          if (err) res.status(500).send(err);
          res.status(200).send(results);
        });
      }
    });
  },
  // versi II
  // addToCart: (req, res) => {
  //   let sqlInsert = `INSERT INTO tbcart SET ?`;
  //   // console.log(req.body.cart);

  //   db.query(sqlInsert, req.body.cart, (err, results) => {
  //     if (err) res.status(500).send(err);
  //     res.status(200).send(results);
  //   });
  // },
  getCart: (req, res) => {
    let sqlGet = `select c.idcart, st.idstock, st.idsize, p.idproduct, p.name, p.category, 
                    sz.size, c.qty, p.price from tbproducts p
                    join tbcart c 
                    on p.idproduct = c.idproduct
                    join tbstock st
                    on c.idstock = st.idstock
                    join tbsize sz
                    on sz.idsize = st.idsize
                    where c.iduser = ${req.user.iduser};`;

    let sqlGetImage = `SELECT * FROM tbpreview`;

    db.query(sqlGet, (err, results) => {
      if (err) res.status(500).send(err);

      db.query(sqlGetImage, (err2, results2) => {
        if (err2) res.status(500).send(err2);

        results.forEach((element, idx) => {
          results2.forEach((item, index) => {
            if (element.idproduct == item.idproduct) {
              results[idx].image = item.image;
            }
          });
        });
        // console.log(results);
        res.status(200).send(results);
      });
    });
  },
  getProfile: (req, res) => {
    let sqlGetProfile = `SELECT * 
                        FROM tbusers 
                        WHERE iduser = ${req.params.id}`;
    // console.log('GET PROFILE');
  },
  updateQtyInCart: (req, res) => {
    // console.log(req.body.qty);
    let sqlUpdate = `UPDATE tbcart
                     SET qty = ${req.body.qty}
                     WHERE idcart=${req.params.idcart}`;

    db.query(sqlUpdate, (err, results) => {
      if (err) res.status(500).send(err);
      // console.log(results);
      res.status(200).send(results);
    });
  },
  deleteCart: (req, res) => {
    // console.log(req.body.qty);
    let sqlDelete = `DELETE FROM tbcart
                     WHERE idcart=${req.params.idcart}`;

    db.query(sqlDelete, (err, results) => {
      if (err) res.status(500).send(err);
      // console.log(results);
      res.status(200).send(results);
    });
  },
  deleteCartMultipleRow: (req, res) => {
    console.log(req.query.idcart);
    let sqlDelete = `DELETE FROM tbcart
                     WHERE idcart IN (${req.query.idcart.toString()})`;
    db.query(sqlDelete, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
};
