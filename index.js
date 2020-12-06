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

var lastStats = Number(42872);

function postToTwitter() {
  const datum = new Date();
  const coronaInfo = axios.get('https://www.trackcorona.live/api/countries/mk')
    .then(function(response) {
      const twitterText = `Дневна статистика за ${datum.getDay()}.${datum.getMonth()}.${datum.getFullYear()}:
___________________________________________________

Излечени/Опоравени ${response.data.data[0].recovered - lastStats} од Корона Вирус!
___________________________________________________
Податоци од СЗО - Светска здравствена организација`
      lastStats = response.data.data[0].recovered;
      console.log(twitterText);
      TwitterClient.post('statuses/update', {
        status: twitterText
      })
        .then((tweet) => {
        })
        .catch((error) => {
          console.log(error);
        });
      });
}

cron.schedule('10 20 * * *', () => {
  postToTwitter();
});
