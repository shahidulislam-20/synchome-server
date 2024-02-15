const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middlewares
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zgm5tdq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    const apartmentCollection = client.db("synchomeDB").collection("apartments");
    const userCollection = client.db("synchomeDB").collection("users");
    const requestCollection = client.db("synchomeDB").collection("requests");


    // Users Collection Here

    app.get('/api/v1/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    app.post('/api/v1/new-user', async(req, res) => {
      const data = req.body;
      console.log(data);
      const result = await userCollection.insertOne(data);
      res.send(result);
    })

    app.get('/api/v1/users/:email', async (req, res) => {
      const email = req.params?.email;
      const result = await userCollection.findOne({ email: email });
      res.send(result);
    })

    app.patch('/api/v1/update-user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body.data;
      const updateDoc = {
        $set: {
          name: data?.name,
          email: data?.email,
          phone: data?.phone,
          role: data?.role
        }
      }
      const result = await userCollection.updateOne(query, updateDoc);
      res.send(result);
    })

    app.delete('/api/v1/delete-user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

    app.put('/api/v1/update-profile/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const data = req.body.data;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: data?.name,
          address: data?.address,
          phone: data?.phone,
          age: data?.age,
          gender: data?.gender,
          region: data?.region,
          role: data?.role
        }
      }
      const result = await userCollection.updateOne(query, updateDoc, options);
      res.send(result);
    })

    app.put('/api/v1/userLoginActivity/:email', async(req, res) => {
      const email = req.params.email;
      const query = {email: email};
      const data = req.body.data;
      const updateDoc = {
        $push: {login_activity: {"date": data}}
      }
      const result = await userCollection.updateOne(query, updateDoc);
      res.send(result);
    })

    //Requests collection 
    app.post('/api/v1/requests', async(req, res) => {
      const data = req.body;
      const result = await requestCollection.insertOne(data);
      res.send();
    })

    app.get('/api/v1/requests', async(req, res) => {
      const result = await requestCollection.find().toArray();
      res.send(result);
    })

    app.get('/api/v1/request/:email', async(req, res) => {
      const email = req.params.email;
      const result = await requestCollection.findOne({email});
      res.send(result);
    })

    app.patch('/api/v1/requests/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const data = req.body.req;
      const updateDoc = {
        $set: {'status': data}
      }
      const result = await requestCollection.updateOne(query, updateDoc);
      res.send(result);
    })

    // Apartmets Collection API's Here

    app.get('/api/v1/apartments', async (req, res) => {
      const result = await apartmentCollection.find().toArray();
      res.send(result);
    })

    app.put('/api/v1/apartments/:id', async (req, res) => {
      const id = req.params?.id;
      const query = { _id: new ObjectId(id) };
      const device = req.body.data;
      const updateDoc = { $push: { devices: device } }
      console.log(id, device);
      const result = await apartmentCollection.updateOne(query, updateDoc);
      res.send(result);
    })

    app.put('/api/v1/apartments/members/:id', async (req, res) => {
      const id = req.params?.id;
      const query = { _id: new ObjectId(id) };
      const member = req.body.data;
      const updateDoc = { $set: { members: member } };
      const result = await apartmentCollection.updateOne(query, updateDoc);
      res.send(result);
    })

    app.put('/api/v1/apartments/wifi/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body.data;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          router: { name: data.name, brand: data.brand, img: data.img, status: data.status },
          wifi: data.wifi
        }
      }
      const result = await apartmentCollection.updateOne(query, updateDoc, options);
      res.send(result);
    })

    app.put('/api/v1/apartments/ac/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body.data;
      const options = { upsert: true };
      const updateDoc = { $set: { ac: data } };
      const result = await apartmentCollection.updateOne(query, updateDoc, options);
      res.send(result);
    })

    app.put('/api/v1/apartments/cctv/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body.data;
      const options = { upsert: true };
      const updateDoc = { $set: { cctv: data } };
      const result = await apartmentCollection.updateOne(query, updateDoc, options);
      res.send(result);
    })

    app.put('/api/v1/apartments/total/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body.data;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          "energy_usage": [
            { "duration": "week", "electricity": data?.electricity1, "water": data?.water1, "gas": data?.gas1 },
            { "duration": "month", "electricity": data?.electricity2, "water": data?.water2, "gas": data?.gas2 },
            { "duration": "year", "electricity": data?.electricity3, "water": data?.water3, "gas": data?.gas3 },
          ]
        }
      }
      const result = await apartmentCollection.updateOne(query, updateDoc, options);
      res.send(result);
    })

    app.put('/api/v1/apartments/weekly/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body.data;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          "usageData": [
            { "day": "Monday", "electricity": data?.electricity1, "water": data?.water1, "gas": data?.gas1 },
            { "day": "Tuesday", "electricity": data?.electricity2, "water": data?.water2, "gas": data?.gas2 },
            { "day": "Wednesday", "electricity": data?.electricity3, "water": data?.water3, "gas": data?.gas3 },
            { "day": "Thursday", "electricity": data?.electricity4, "water": data?.water4, "gas": data?.gas4 },
            { "day": "Friday", "electricity": data?.electricity5, "water": data?.water5, "gas": data?.gas5 },
            { "day": "Saturday", "electricity": data?.electricity6, "water": data?.water6, "gas": data?.gas6 },
            { "day": "Sunday", "electricity": data?.electricity7, "water": data?.water7, "gas": data?.gas7 }
          ]
        }
      }
      const result = await apartmentCollection.updateOne(query, updateDoc, options);
      res.send(result);
    })

    app.put('/api/v1/apartments/del-device/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body.index;
      const unsetDoc = {
        $unset: { [`devices.${data}`]: 1 }
      }
      await apartmentCollection.updateOne(query, unsetDoc);
      const pullDoc = {
        $pull: { "devices": null }
      }
      const result = await apartmentCollection.updateOne(query, pullDoc);
      res.send(result);
    })

    app.put('/api/v1/apartments/device-switch/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const data = req.body;
      console.log('ase')
      const updateDoc = {
        $set: { [`devices.${data?.index}.status`]: data?.value }
      }
      const result = await apartmentCollection.updateOne(query, updateDoc);
      res.send(result);
    })

    app.put('/api/v1/apartments/simple-switch/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const data = req.body;
      const updateDoc = {
        $set: {[`${data?.name}.status`]: data?.value}
      }
      const result = await apartmentCollection.updateOne(query, updateDoc);
      res.send(result);
    })

    app.patch('/api/v1/apartments/actemp/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const temp = req.body.tempControl;
      console.log(temp, id);
      const updateDoc = {
        $set: {"ac.temp": temp}
      }
      const result = await apartmentCollection.updateOne(query, updateDoc);
      res.send(result);
    })

    app.patch('/api/v1/apartments/acmode/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const mode = req.body.newMode;
      const updateDoc = {
        $set: {"ac.mode": mode}
      }
      const result = await apartmentCollection.updateOne(query, updateDoc);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Sync Home server is running...');
})

app.listen(port, () => {
  console.log(`server running on port: ${port}`)
})