const express = require('express');
// hak akses dari front-end
const cors = require('cors');
const bearerToken = require('express-bearer-token');
// membaca data yang dikirim oleh request endpoint/url front-end
const bodyParser = require('body-parser');

const db = require('./database');
const app = express();

const PORT = 4000;

// fungsi untuk check koneksi database
db.connect((err) => {
  if (err) {
    console.error('error connecting : ' + err.stack);
  }
  console.log('connected as id : ' + db.threadId);
});

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(cors());
app.use(bearerToken()); // bearerToken, digunakan untuk mengambil authorization oleh header request url dari frontend

app.get('/', (req, res) => {
  res.status(200).send('<h1>REST API</h1>');
});

/* START ROUTES */
const {
  usersRouter,
  carouselRouter,
  productRouter,
  transactionRouter,
} = require('./routers');

app.use('/users', usersRouter);
app.use('/carousel', carouselRouter);
app.use('/products', productRouter);
app.use('/transaction', transactionRouter);
/* END ROUTES */

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
