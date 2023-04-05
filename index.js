const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { query } = require('express');
require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());



// Mongodb database setup
const dbUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gksews0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try{
        // db all collections
        const jobsCollection = client.db('NexusJobs').collection('jobs');
        const jobsCategoriesCollection = client.db('NexusJobs').collection('jobsCategories');


        // all user data insert on databse
        app.post('/jobs', async(req, res) => {
            const task = req.body;
            // console.log(task);
            const result = await jobsCollection.insertOne(task);
            res.send(result);
        })

        //delete a user api

        app.delete('/jobs/:_id', async(req, res) => {
            const id = req.params._id;
            console.log(id);
            const filter = { _id: ObjectId(id) }
            const result = await jobsCollection.deleteOne(filter);
            res.send(result);
        })

        // buyer role email send to client side
        app.get('/jobs', async(req, res) => {
            const jobs = await jobsCollection.find({}).toArray();
            res.send(jobs);
        })

        app.get('/jobsCategories', async(req, res) => {
            const category = await jobsCategoriesCollection.find({}).toArray();
            res.send(category);
        })
 



    }

    finally{

    }
    
}
run().catch(console.log())


app.get('/', async(req, res) => {
    res.send('Server server is running');
})

app.listen(port, () => {
    console.log(`Server runnin on: ${port}`);
})