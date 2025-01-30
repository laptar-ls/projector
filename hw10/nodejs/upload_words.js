// # upload_words.js
const fs = require('fs');
const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://elasticsearch:9200' });

async function uploadWords() {
  try {
    await client.indices.create({
      index: 'autocomplete',
      body: {
        settings: {
          analysis: {
            analyzer: {
              autocomplete_analyzer: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'asciifolding']
              }
            }
          }
        },
        mappings: {
          properties: {
            word: { type: 'text', analyzer: 'autocomplete_analyzer' }
          }
        }
      }
    });

    const words = fs.readFileSync('/usr/share/dict/words', 'utf-8')
      .split('\n')
      .filter(Boolean)
      .map(word => ({ index: { _index: 'autocomplete' } }, { word }));

    await client.bulk({ body: words.flat() });
    console.log('Words uploaded successfully');
  } catch (error) {
    console.error('Error uploading words:', error);
  }
}

uploadWords();

// # server.js
const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const app = express();
const client = new Client({ node: 'http://elasticsearch:9200' });

app.get('/autocomplete', async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const { body } = await client.search({
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
    res.json(body.hits.hits.map(hit => hit._source.word));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
