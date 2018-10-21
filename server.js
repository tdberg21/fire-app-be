const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.locals.title = 'Fire Tracker';
app.set('port', process.env.PORT || 3001);
// require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  next()
});

// app.use((request, response, next) => {
//   response.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   next()
// });

app.get('/api/v1/wildfires/all', (request, response) => {
  database('wildfires').select()
    .then((fire) => {
      response.status(200).json(fire);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/wildfires/new', (request, response) => {
  const fire = request.body;
  for (let requiredParameter of ['latitude', 'longitude']) {
    if (!fire[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `You're missing a "${requiredParameter}" property.` });
    }
  }
  database('wildfires').insert(fire, 'id')
    .then(fire => {
      response.status(201).json({ id: fire[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});



app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});