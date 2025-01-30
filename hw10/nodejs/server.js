import express from 'express';
import { Client } from '@elastic/elasticsearch';

const app = express();
const client = new Client({ node: 'http://elasticsearch:9200' });

app.get('/autocomplete', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await client.search({
      index: 'autocomplete',
      body: {
        query: {
          match: {
            word: {
              query,
              fuzziness: query.length > 7 ? 3 : 'AUTO'
            }
          }
        }
      }
    });

    console.log('Response:', response);

    if (response.hits?.hits) {
      const words = response.hits.hits.map(hit => hit._source.word);
      res.json(words);
    } else {
      res.status(404).json({ error: 'No results found' });
    }
  } catch (error) {
    console.error('Error:', error); // Log error for further debugging
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
