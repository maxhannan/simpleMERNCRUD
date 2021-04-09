/* eslint-disable no-console */
/* eslint-disable implicit-arrow-linebreak */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const Item = require('./models/Item');

const members = require('./members');
const { MONGODB } = require('./config/config');

const app = express();

// Connect to datatbase
mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongo Connected'))
  .catch((err) => console.log({ Error: err }));
// Get the default connection
const db = mongoose.connection;
// Bind connection to error event (to get notification of connection errors)
// eslint-disable-next-line no-console
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Body Parser init
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Working!');
});

app.get('/api', (req, res) => {
  res.json(members);
});

app.post('/add-item', (req, res) => {
  if (req.body.name) {
    const item = new Item({
      name: req.body.name,
    });
    item
      .save()
      .then((result) => {
        res.send(result);
      })
      .catch((err) => console.log(err));
  }
});

app.get('/all-items', (req, res) => {
  Item.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

app.get('/one-item/:id', (req, res) => {
  Item.findById(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

app.put('/one-item/:id', (req, res) => {
  Item.findByIdAndUpdate(req.params.id, { name: req.body.name })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

app.delete('/one-item/:id', (req, res) => {
  Item.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.status(404);
  res.send('404 Error page not found');
  next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`),
);
