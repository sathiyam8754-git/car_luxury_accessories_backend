const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('car luxury Server running');
});

app.listen(3000, () => {
  console.log('car luxury Server started on port 3000');
});