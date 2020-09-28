const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const uri = "mongodb://organicUser:czVUeRnuEUh38uAa@cluster0-shard-00-00.4xssl.mongodb.net:27017,cluster0-shard-00-01.4xssl.mongodb.net:27017,cluster0-shard-00-02.4xssl.mongodb.net:27017/organicdb?ssl=true&replicaSet=atlas-3sy2t9-shard-0&authSource=admin&retryWrites=true&w=majority";
const client = new MongoClient(uri,  {useUnifiedTopology: true}, { useNewUrlParser: true });
const ObjectId = require("mongodb").ObjectId;

const pw = "czVUeRnuEUh38uAa"

const port = 4000;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); 

app.get('/', (req, res) =>{
  res.sendFile(__dirname + "/index.html")
})

client.connect(err => {
  const  productCollection = client.db("organicdb").collection("products");
  
  app.get('/products',  (req, res) => {
    productCollection.find({})
    .toArray(  (err, documents) =>{
      console.log(err,documents);
      res.send(documents)
      
    })
  })

  app.get('product/:id', (req, res) =>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) =>{
     res.send(documents)
    })
  
  })
  
  app.post("/addProduct", (req, res) =>{
    const product = req.body;
    productCollection.insertOne(product)
    .then(result =>{
      console.log('data added');
      res.send('success')

    })
  })
 
  
 
  app.delete('/delete/:id', (req, res) =>{
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) =>{
      console.log(result);
    })
  })
  
});


app.listen(port, () => console.log(`listening on ${port}`));