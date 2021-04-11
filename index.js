const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3kxg0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5500;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("appointments");
  
  app.post('/addAppointment', (req, res) => {
      const appointment = req.body;
      appointmentCollection.insertOne(appointment)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  });

  app.get('/appointments', (req, res) => {
    appointmentCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
})

  app.post('/appointmentsByDate', (req, res) => {
    const date = req.body;
    console.log(date.date)
    appointmentCollection.find({date: date.date})
    .toArray((err, documents) => {
        res.send(documents)
    })
})



});


app.listen(process.env.PORT || port)