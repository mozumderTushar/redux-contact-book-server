const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jos17.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json())
app.use(cors())

const port = 5000


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const contactCollection = client.db("ReduxContactBook").collection("contacts");

    console.log('db connected')

    // post single contact to server
    app.post('/contact', (req, res) => {
        const contact = req.body;
        contactCollection.insertOne(contact)
            .then(result => {
                console.log(result)
                res.send(result)
            })
    })

    //get all contacts from server
    app.get('/contacts', (req, res) => {
        contactCollection.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)