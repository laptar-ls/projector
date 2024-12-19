import axios from 'axios';
import { v4 as uuid4 } from 'uuid';

const config = {
  exchangeRateApiUrl: 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&json',
  ga4MeasurementId: 'G-DJ6VSF2JBG',
  ga4ApiSecret: 'mXcLjvuqTrOOoKBvQFYmOA',
  ga4Endpoint: 'https://www.google-analytics.com/mp/collect',
  currencyCode: 'UAH',
  fetchInterval: 10000,
};

async function fetchExchangeRate() {
  try {
    const response = await axios.get(config.exchangeRateApiUrl);
    const rate = response.data[0]?.rate;

    if (!rate) {
      throw new Error(`Exchange rate for ${config.currencyCode} not found`);
    }

    console.log(`Fetched exchange rate: 1 USD = ${rate} ${config.currencyCode}`);
    return rate;
  } catch (error) {
    console.error('Error fetching exchange rate:', error.message);
    throw error;
  }
}

async function sendToGA4(exchangeRate) {
  try {
    const payload = {
      client_id: uuid4(),
      events: [
        {
          name: 'exchange_rate_update',
          params: {
            currency_code: config.currencyCode,
            exchange_rate: exchangeRate,
          },
        },
      ],
    };

    const url = `${config.ga4Endpoint}?measurement_id=${config.ga4MeasurementId}&api_secret=${config.ga4ApiSecret}`;

    const response = await axios.post(url, payload);

    console.log('Data sent to GA4 successfully:', response.status);
  } catch (error) {
    console.error('Error sending data to GA4:', error.message);
    throw error;
  }
}

async function worker() {
  try {
    const exchangeRate = await fetchExchangeRate();
    await sendToGA4(exchangeRate);
  } catch (error) {
    console.error('Worker encountered an error:', error.message);
  }
}

setInterval(worker, config.fetchInterval);

worker();
