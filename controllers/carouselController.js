const db = require('../database');

module.exports = {
  getCarousel: (req, res) => {
    // console.log(req.query);
    let sqlGet;
    if (req.query.status) {
      sqlGet = `SELECT * 
                FROM tbcarousel 
                WHERE status= ${db.escape(req.query.status)}`;
    } else {
      sqlGet = `SELECT * FROM tbcarousel`;
    }

    db.query(sqlGet, (err, results) => {
      if (err) res.status(500).send(err);
      //   console.log(results);
      res.status(200).send(results);
    });
  },
  addCarousel: (req, res) => {
    let { image, title, status } = req.body;
    let sqlInsert = `INSERT INTO tbcarousel (image, title, status) 
                    VALUES (
                      ${db.escape(image)}, 
                      ${db.escape(title)},
                      ${db.escape(status)}  
                    )`;

    let sqlGet = `SELECT * FROM tbcarousel`;

    db.query(sqlInsert, (err, results) => {
      if (err) res.status(500).send(err);

      db.query(sqlGet, (errGet, resultsGet) => {
        if (errGet) res.status(500).send(errGet);
        res.status(200).send(resultsGet);
      });
    });
  },
  deleteCarousel: (req, res) => {
    // console.log(req.params.id);
    let sqlDelete = `DELETE FROM tbcarousel WHERE idcarousel = ${req.params.id}`;

    let sqlGet = `SELECT * FROM tbcarousel`;

    db.query(sqlDelete, (err, results) => {
      if (err) res.status(500).send(err);

      db.query(sqlGet, (errGet, resultsGet) => {
        if (errGet) res.status(500).send(errGet);
        res.status(200).send(resultsGet);
      });
    });
  },
  updateCarousel: (req, res) => {
    let dataUpdate = [];
    for (x in req.body) {
      //   console.log(x);
      dataUpdate.push(`${x} = ${db.escape(req.body[x])}`);
    }

    // console.log(dataUpdate.toString());

    let sqlUpdate = `UPDATE tbcarousel 
                      SET ${dataUpdate} 
                      WHERE idcarousel=${req.params.id}`;

    let sqlGet = `SELECT * FROM tbcarousel`;

    db.query(sqlUpdate, (err, results) => {
      if (err) res.status(500).send(err);

      db.query(sqlGet, (errGet, resultsGet) => {
        if (errGet) res.status(500).send(errGet);
        res.status(200).send(resultsGet);
      });
    });
  },
};
