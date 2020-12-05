require('dotenv').config();
const axios = require('axios');
const cron = require('node-cron');
const Twitter = require('twitter');
const TwitterClient = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET
});

let lastStats = Number(42872);
cron.schedule('30 19 * * *', () => {
  const coronaInfo = axios.get('https://www.trackcorona.live/api/countries/mk')
    .then(function(response) {
      const twitterText = `Дневна статистика за 29/11/2020:
Излечени/Опоравени ${response.data.data[0].recovered - lastStats} од Корона Вирус!
Податоци од WHO - Светска здраствена организација`
      lastStats = response.data.data[0].recovered;
      TwitterClient.post('statuses/update', {
        status: twitterText
      })
        .then((tweet) => {
        })
        .catch((error) => {
          console.log(error);
        });
      });
});
