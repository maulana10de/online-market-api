const db = require('../database');

module.exports = {
  getTransaction: (req, res) => {
    let sqlGet = `select * from tbtransaction
                  where iduser = ${req.user.iduser}`;

    let sqlGetDetail = `select td.idtransdetail, td.invoice, p.idproduct, 
    p.name, p.category, sz.size,  td.qty, p.price from transaction_detail td
    join tbproducts p 
          on td.idproduct = p.idproduct
          join tbstock st
          on st.idstock = td.idstock
          join tbsize sz
          on st.idsize = sz.idsize
          where td.iduser = ${req.user.iduser};`;

    let sqlGetImage = ` SELECT * FROM tbpreview`;

    // console.log(sqlGetDetail);

    db.query(sqlGet, (err, results) => {
      if (err) res.status(500).send(err);

      db.query(sqlGetDetail, (err2, results2) => {
        if (err2) res.status(500).send(err2);

        db.query(sqlGetImage, (err3, results3) => {
          if (err3) res.status(500).send(err3);

          results.forEach((item, index) => {
            results[index].detail = [];
            results2.forEach((val, i) => {
              results3.forEach((elem, ix) => {
                if (elem.idproduct == val.idproduct) {
                  if (!results2[i].image) {
                    results2[i].image = elem.image;
                  }
                }
              });
              if (item.invoice == val.invoice) {
                results[index].detail.push(val);
              }
            });
          });
          // console.log(results);
          res.status(200).send(results);
        });
      });
    });
  },
  addTransaction: (req, res) => {
    console.log('====>', req.body);
    let hour = new Date();
    let invoice = `INV/00${req.body.iduser}${
      req.body.cart.length * 3
    }${hour.getMilliseconds()}2020`;
    let totalpayment = 0;
    req.body.cart.forEach((e) => {
      totalpayment += e.qty * e.price;
    });
    let sqlInsert = ` insert into tbtransaction (invoice, iduser, total_payment) 
                      values (${db.escape(invoice)},${db.escape(
      req.body.iduser
    )}, ${db.escape(totalpayment)})`;

    let sqlInsertDetail = `insert into transaction_detail values `;

    db.query(sqlInsert, (err, results) => {
      if (err) res.status(500).send(err);

      if (results) {
        let data = [];
        req.body.cart.forEach((e) => {
          data.push(
            `(null, ${db.escape(invoice)}, ${db.escape(
              e.idproduct
            )}, ${db.escape(req.body.iduser)}, ${db.escape(
              e.idstock
            )}, ${db.escape(e.qty)} )`
          );
        });
        // console.log(sqlInsertDetail + data.toString());
        db.query(sqlInsertDetail + data.toString(), (err2, results2) => {
          if (err2) {
            console.log(err2);
            res.status(500).send(err2);
          }
          req.body.cart.forEach((e) => {
            let sqlDelete = `DELETE FROM tbcart WHERE idcart = ${e.idcart}`;
            db.query(sqlDelete, (errDel, resultsDel) => {
              if (err) res.status(500).send(errDel);
            });
          });
          res.status(200).send('Transaction Success');
        });
      }
    });
  },
  // postDataToTransaction: (req, res) => {
  //   req.body.cart.forEach((item, index) => {
  //     let data = ['null'];
  //     for (let prop in item) {
  //       data.push(`${db.escape(item[prop])}`);
  //     }
  //     req.body.cart[index] = `(${data.toString()},null)`;
  //   });

  //   let sqlInsert = `INSERT INTO tbtransaction VALUES ${req.body.cart.toString()}`;
  //   db.query(sqlInsert, (err, results) => {
  //     if (err) res.status(500).send(err);
  //     console.log('GET CHECKOUT :', results);
  //     res.status(200).send(results);
  //   });
  // },
  updateStatusTransaction: (req, res) => {
    console.log(req.body.status, req.params.idtransaction);
    let sqlUpdate = ` UPDATE tbtransaction
                      SET ?
                      WHERE idtransaction = ${req.params.idtransaction}`;

    db.query(sqlUpdate, req.body, (err, results) => {
      if (err) res.status(500).send(err);
      console.log(results);
      res.status(200).send(results);
    });
  },
};
