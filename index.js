const express = require('express')
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.AKA_USER}:${process.env.AKA_PASS}@cluster0.aacuwof.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    client.connect()



    const coinCollection = client.db("aka-coins").collection("coin");
    const walletCollection = client.db("aka-coins").collection("wallet");


    //  get coins
    app.get('/coins', async (req, res) => {
        const coin = await coinCollection.find().toArray()
        res.send(coin)
    })

    //  delete coin
    app.delete('/deleteCoin/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const filter = { _id: ObjectId(id) }
        const result = await coinCollection.deleteOne(filter)
        res.send(result)
    })

    app.patch('/coindetail/:id', async (req, res) => {
        const id = req.params.id;
        const data = req.body;
        const filter = { _id: ObjectId(id) }
        const options = { upsert: true };
        const updateDoc = {
            $set: data,
        };

        const result = await coinCollection.updateOne(filter, updateDoc, options);
        res.send(updateDoc);
    });



    // add coin
    app.post('/coin', async (req, res) => {
        const coin = req.body;
        const result = await coinCollection.insertOne(coin);
        res.send(result);

    })

    // add wallet
    app.post('/wallet', async (req, res) => {
        const tool = req.body;
        const result = await walletCollection.insertOne(tool);
        res.send(result);

    })

    // get wallets
    app.get('/wallets', async (req, res) => {
        const coin = await walletCollection.find().toArray()
        res.send(coin)
    })






}

run().catch(console.dir())


app.get('/', (req, res) => {
    res.send('aka is run')
})

app.listen(port, () => {
    console.log(`aka  lisining is ${port}`);
})