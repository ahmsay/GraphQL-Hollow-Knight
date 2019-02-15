const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://paleKing:theWhiteLady@hollowknightgraphql-doplt.mongodb.net/HollowKnight?retryWrites=true', { useNewUrlParser: true });
mongoose.connection.once('open', () => {
  console.log('Connected to database.');
});
mongoose.set('useFindAndModify', false);

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

const port = process.env.PORT || 4000;

let url = '';
if(port == 4000)
  url = 'http://localhost:4000/graphql';
else
  url = 'https://hollow-knight-gql.herokuapp.com/graphql';

app.get('/', function (req, res) {
  let content = "<h1>Hollow Knight GraphQL API</h1>" +
  "<span>Click <a href='" + url + "'>here</a> to use the API.</span>";
  res.send(content);
});

app.listen(port, () => {
  console.log('App running on port ' + port + '...');
});