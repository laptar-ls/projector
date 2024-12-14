import express from 'express';
import mongoose from 'mongoose';
import { Client } from '@elastic/elasticsearch';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;

app.use(bodyParser.json());

const mongoUri = 'mongodb://localhost:27017/monitoring_db';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const recordSchema = new mongoose.Schema({
  data: String,
  timestamp: { type: Date, default: Date.now },
});
const Record = mongoose.model('Record', recordSchema);

const esUri = 'http://localhost:9200';
const esClient = new Client({ node: esUri });
const esIndex = 'monitoring';

app.get('/', (req, res) => {
  res.send({ status: 'app is running' });
});

app.post('/mongo', async (req, res) => {
  try {
    const { data } = req.body;
    const record = new Record({ data });
    await record.save();
    res.status(201).send({ message: 'Record saved to MongoDB', record });
  } catch (err) {
    res.status(500).send({ error: 'Error saving to MongoDB', details: err.message });
  }
});

app.post('/elastic', async (req, res) => {
  try {
    const { data } = req.body;
    const response = await esClient.index({
      index: esIndex,
      document: { data, timestamp: new Date() },
    });
    res.status(201).send({ message: 'Document indexed in Elasticsearch', response });
  } catch (err) {
    res.status(500).send({ error: 'Error indexing in Elasticsearch', details: err.message });
  }
});

app.get('/health/mongo', async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.send({ status: mongoStatus });
});

app.get('/health/elastic', async (req, res) => {
  try {
    const esStatus = await esClient.cluster.health();
    res.send({ status: 'connected', cluster: esStatus });
  } catch (err) {
    res.status(500).send({ error: 'Error connecting to Elasticsearch', details: err.message });
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
