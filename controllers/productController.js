const db = require('../database');

module.exports = {
  getProducts: (req, res) => {
    let sqlGetProduct = ` SELECT * FROM tbproducts`;

    let sqlGetStock = ` SELECT st.idstock, st.idproduct, sz.size AS code, st.qty AS total
                        FROM tbstock st
                        JOIN tbsize sz
                        ON st.idsize = sz.idsize`;
    let sqlGetImage = ` SELECT * FROM tbpreview`;

    db.query(sqlGetProduct, (err, results) => {
      if (err) res.status(500).send(err);

      db.query(sqlGetStock, (err2, results2) => {
        if (err2) res.status(500).send(err2);

        db.query(sqlGetImage, (err3, results3) => {
          if (err3) res.status(500).send(err3);

          if (results3) {
            results.forEach((item, index) => {
              results[index].stock = [];

              results2.forEach((value, idx) => {
                if (value.idproduct == item.idproduct) {
                  results[index].stock.push(value);

                  results[index].images = [];
                  results3.forEach((elem, i) => {
                    if (elem.idproduct == item.idproduct) {
                      results[index].images.push(elem);
                    }
                  });
                }
              });
            });
          }
          // console.log('GET GUYSSSSSS', req.query.idproduct);
          if (req.query.idproduct) {
            let ix = results.findIndex(
              (e) => e.idproduct == req.query.idproduct
            );
            res.status(200).send(results[ix]);
          } else {
            res.status(200).send(results);
          }
        });
      });
    });
  },

  addProduct: (req, res) => {
    let sqlInsert = `INSERT INTO tbproducts SET ?`;
    let sqlStock = `INSERT INTO tbstock (idproduct, idsize, qty) VALUES ?`;
    let sqlPreview = `INSERT INTO tbpreview (idproduct, image) VALUES ?`;

    db.query(sqlInsert, req.body.data, (err, results) => {
      if (err) res.status(500).send(err);

      if (results.insertId) {
        req.body.stock.forEach((item, index) => {
          item.unshift(results.insertId);
        });

        req.body.images.forEach((item, index) => {
          req.body.images[index] = [results.insertId, item];
        });

        // console.log(req.body.stock);
        // console.log(req.body.images);

        db.query(sqlStock, [req.body.stock], (err2, results2) => {
          if (err2) res.status(500).send(err2);

          db.query(sqlPreview, [req.body.images], (err3, results3) => {
            if (err3) res.status(500).send(err3);
            res.status(200).send('Add new product complete');
          });
        });
      }
    });
  },

  // multiple insert
  multipleInsert: (req, res) => {
    // console.log('PRODUCTS 1', req.body.products);

    req.body.products.forEach((item, index) => {
      let data = ['null'];
      for (let prop in item) {
        data.push(`${db.escape(item[prop])}`);
      }
      req.body.products[index] = `(${data.toString()}, null)`;
    });

    // console.log('PRODUCTS 2', req.body.products);

    let sqlInsert = `INSERT INTO tbproducts values ${req.body.products.toString()}`;

    // console.log(sqlInsert);

    db.query(sqlInsert, (err, results) => {
      if (err) res.status(500).send(err);
      res.status(200).send(results);
    });
  },
  editProduct: (req, res) => {},
  //   deleteCarousel: (req, res) => {
  //     // console.log(req.params.id);
  //     let sqlDelete = `DELETE FROM tbcarousel WHERE idcarousel = ${req.params.id}`;

  //     let sqlGet = `SELECT * FROM tbcarousel`;

  //     db.query(sqlDelete, (err, results) => {
  //       if (err) res.status(500).send(err);

  //       db.query(sqlGet, (errGet, resultsGet) => {
  //         if (errGet) res.status(500).send(errGet);
  //         res.status(200).send(resultsGet);
  //       });
  //     });
  //   },
  //   updateCarousel: (req, res) => {
  //     let dataUpdate = [];
  //     for (x in req.body) {
  //       //   console.log(x);
  //       dataUpdate.push(`${x} = ${db.escape(req.body[x])}`);
  //     }

  //     // console.log(dataUpdate.toString());

  //     let sqlUpdate = `UPDATE tbcarousel
  //                       SET ${dataUpdate}
  //                       WHERE idcarousel=${req.params.id}`;

  //     let sqlGet = `SELECT * FROM tbcarousel`;

  //     db.query(sqlUpdate, (err, results) => {
  //       if (err) res.status(500).send(err);

  //       db.query(sqlGet, (errGet, resultsGet) => {
  //         if (errGet) res.status(500).send(errGet);
  //         res.status(200).send(resultsGet);
  //       });
  //     });
  //   },
};
