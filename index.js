const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
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

    //update data
    app.patch('/update/:id', (req, res) => {
        contactCollection.updateOne({_id: ObjectId(req.params.id)},
        {
          $set: {name: req.body.name, phone: req.body.phone, email: req.body.email}
        } )
        .then(result => {
          res.send(result.modifiedCount > 0)
      })
    })

    //delete data
    app.delete('/delete/:id',(req, res) =>{
        contactCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0);
        })
    })

});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(process.env.PORT || port)