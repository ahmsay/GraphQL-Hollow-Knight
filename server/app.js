const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://testuser:testpassword@graphqltest-doplt.mongodb.net/test?retryWrites=true');
mongoose.connection.once('open', () => {
  console.log('Connected to database.');
});

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('App running on port 4000...');
});