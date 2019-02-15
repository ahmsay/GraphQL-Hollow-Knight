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

app.use(express.static('public'));

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

const port = process.env.PORT || 4000;

app.get('/', function (req, res) {
  res.send("<div>Click <a href='http://localhost:" + port + "/graphql'>here</a> to use the API.</div>");
});

app.listen(port, () => {
  console.log('App running on port ' + port + '...');
});