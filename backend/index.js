const express = require('express');
const db = require('./models'); 

const app = express();

db.sequelize.sync({ force: true }) 
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
