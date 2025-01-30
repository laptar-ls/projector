import fs from 'fs';
import { Client } from '@elastic/elasticsearch';

const client = new Client({ node: 'http://elasticsearch:9200' });

async function uploadWords() {
  try {
    const indexExists = await client.indices.exists({ index: 'autocomplete' });
    if (!indexExists.body) {
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
      console.log('Index created successfully');
    } else {
      console.log('Index already exists');
    }

    const wordsData = JSON.parse(fs.readFileSync('/app/words.json', 'utf-8'));
    const words = Object.keys(wordsData);

    const chunkSize = 500;
    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).map(word => [{ index: { _index: 'autocomplete' } }, { word }]).flat();

      try {
        await client.bulk({ body: chunk });
        console.log(`Uploaded ${i + chunkSize} words`);
        await new Promise(resolve => setTimeout(resolve, 20));
      } catch (bulkError) {
        console.error('Error during bulk upload:', bulkError);
      }
    }

    console.log('Words uploaded successfully');
  } catch (error) {
    console.error('Error uploading words:', error);
  }
}

uploadWords();
